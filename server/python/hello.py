from graph_agent import create_graph_agent
import uuid
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from run_all_agent import run_all_agent
import uvicorn
from ai_models.mistral_model import mistral_model, mistral_model_ids, change_model_params
import boto3
import time
from agents.biz_agent import biz_agent
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/invocations")
async def invocations(request: Request):
    return await run_all_agent(request)

@app.post('/change-model')
async def change_model(request: Request):
    try:
        payload = await request.json()
        model = payload.get("model")
        max_tokens = payload.get("max_tokens", 10000)
        temperature = payload.get("temperature", 0.7)

        if not model:
            return {"error": "Model ID is required"}

        elif model not in mistral_model_ids:
            return {"error": "Model ID is not valid"}

        change_model_params(
            model_id=model,
            max_tokens=max_tokens,
            temperature=temperature
        )

        print(f"Model parameters changed: {model}, tokens: {max_tokens}, temp: {temperature}")

        return {
            "message": "Model configured successfully!",
            "current_settings": {
                "model": model,
                "max_tokens": max_tokens,
                "temperature": temperature
            }
        }
    except Exception as e:
        print(f"Error changing model: {str(e)}")
        return {"error": f"Failed to change model: {str(e)}"}

# AWS DynamoDB config
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('agent-memory')
project_table = dynamodb.Table('projects')

@app.get('/get-data')
def get_data():
    try:
        response = table.get_item(
            Key={
                'session_id': 'user_123',
                'timestamp': '2026-03-19T10:00:00'
            }
        )
        return response
    except Exception as e:
        print(f"Error: {e}")
        return {"error": f"Failed to get data: {str(e)}"}

@app.post('/add-data')
async def add_data(session_id: str, message: str, timestamp: str):
    try:
        table.put_item(
            Item = {
                'session_id': session_id,
                'timestamp': timestamp,
                'message': message
            }
        )
        return {
            "message": "Data added successfully!"
        }
    except Exception as e:
        print("Error: ", e)
        return {"error": f"Failed to add data: {str(e)}"}

# Pydantic models for request validation
class StartRequest(BaseModel):
    user_id: str = "user_123"
    prompt: str

class FeedbackRequest(BaseModel):
    project_id: str
    action: str  = "approve" or "modify"
    feedback: str | None = None

# Initiating the business agent
@app.post('/start-biz-agent')
async def get_biz_agent_data(request: StartRequest):
    try:
        project_id = str(uuid.uuid4())
        user_id = request.user_id
        prompt = request.prompt
        
        response = biz_agent(prompt)
        try:
            business_output = response.message["content"][0]["text"]
        except (KeyError, IndexError, AttributeError, TypeError):
            business_output = str(response)

        item = {
            "PK": f"PROJECT#{project_id}",
            "SK": "STATE",
            "user_id": user_id,
            "stage": "awaiting_approval",
            "business_output": business_output,
            "created_at": str(time.time()),
            "updated_at": str(time.time())
        }

        project_table.put_item(Item=item)
        
        return {
            "project_id": project_id,
            "stage": "awaiting_approval",
            "business_output": business_output
        }
    except Exception as e:
        print("Error: ", e)
        return {"error": f"Failed to get biz agent data: {str(e)}"}

# Looping in the business agent
@app.post('/biz-agent-feedback')
async def biz_agent_feedback(request: FeedbackRequest):
    try:
        response = project_table.get_item(
            Key={
                "PK": f"PROJECT#{request.project_id}",
                "SK": "STATE"
            }
        )

        if "Item" not in response:
            raise Exception("Project not found")

        project = response["Item"]
        
        # User wanted some modification in the business plan
        if request.action == "modify":
            response_obj = biz_agent(
                str(project["business_output"]) + str(request.feedback or "") + "The user asked to modify your previous output. Please modify it and return the updated output."
            )
            
            try:
                updated_output = response_obj.message["content"][0]["text"]
            except (KeyError, IndexError, AttributeError, TypeError):
                updated_output = str(response_obj)

            project["business_output"] = updated_output
            project["feedback"] = request.feedback
            project["updated_at"] = str(time.time())

            project_table.put_item(Item=project)
            return {
                "stage": "awaiting_approval",
                "business_output": updated_output
            }

        # User approved the business plan
        elif request.action == "approve":

            project["stage"] = "approved"
            project["updated_at"] = str(time.time())

            project_table.put_item(Item=project)
            
            graph = create_graph_agent()
            graph_response = await graph.invoke_async(project["business_output"])

            # Combine outputs from all agents
            combined_text = ""
                
            try:
                design_text = graph_response.results["designer"].result.message["content"][0]["text"]
                combined_text += f"## Designer\n{design_text}\n\n"
            except (KeyError, IndexError, AttributeError):
                pass
                
            try:
                dev_text = graph_response.results["developer"].result.message["content"][0]["text"]
                combined_text += f"## Developer\n{dev_text}\n\n"
            except (KeyError, IndexError, AttributeError):
                pass
                
            try:
                test_text = graph_response.results["test-agent"].result.message["content"][0]["text"]
                combined_text += f"## Test Agent\n{test_text}\n\n"
            except (KeyError, IndexError, AttributeError):
                pass

            if not combined_text:
                combined_text = "No output generated by agents."


            return {
                "role": "assistant",
                "content": combined_text
            }
                
    except Exception as e:
        print("Error: ", e)
        return {"error": f"Failed to get biz agent data: {str(e)}"}


if __name__ == "__main__":
    print("Server is live at http://localhost:8080")
    uvicorn.run("hello:app", host="localhost", port=8080, reload=True)