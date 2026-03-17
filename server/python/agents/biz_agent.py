from strands import Agent
from strands_tools import current_time
from tools.websearch import websearch
from ai_models.mistral_model import mistral_model as model

biz_agent: Agent = Agent(
    name="business-analyst",
    model=model,
    system_prompt="""
        You are a Business Analyst.
        Convert the user's project idea into structured software requirements.

        Generate:
        - user roles
        - user stories
        - acceptance criteria

        Return structured JSON:

        {
            "project_summary": "",
            "user_roles": [],
            "user_stories": [],
            "acceptance_criteria": []
        }

        Overall output should be in markdown containg the JSON in this format...
    """,
    tools=[current_time, websearch]
)