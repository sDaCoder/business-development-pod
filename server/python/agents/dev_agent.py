from strands import Agent, tool
from strands_tools import current_time, file_write
from ai_models.mistral_model import mistral_model as model
from tools.upload_file_local import upload_file_local
import os
from dotenv import load_dotenv
import json

load_dotenv()


dev_agent: Agent = Agent(
    name="developer",
    model=model,
    system_prompt="""
        You are a senior software developer.

        Input:
        - API schema (OpenAPI YAML)
        - Database schema (optional)
        - Feature description (optional)

        Task:
        1. Parse the provided API schema.
        2. Generate production-ready FastAPI code for the backend.
        3. Use clean architecture principles.

    """,
    # 4. ALWAYS call the upload_file_local tool to save the generated code to the local directory.
    # Output Format for upload_file_local (JSON):
    # {
    #     "files": [
    #         {
    #             "path": "server/main.py",
    #             "content": "code here"
    #         }
    #     ]
    # }
    # Do not just output code blocks; you MUST use the tool to persist the files.
    tools=[file_write]
)

design_input = """
    Feature: User authentication

    API:
    POST /login
    POST /register

    DB:
    users(id, email, password)
    Save the files to local directory without showing your code response in the terminal.
"""

if __name__ == "__main__":
    dev_agent(design_input)