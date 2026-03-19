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

        Return structured format(not in JSON, but in user readable form) containing these important topics:

        {
            "project_summary": "",
            "user_roles": [],
            "user_stories": [],
            "acceptance_criteria": []
        }

    """,
    tools=[current_time, websearch]
)