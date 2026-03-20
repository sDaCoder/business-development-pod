from strands import Agent
from ai_models.mistral_model import mistral_model as model
from tools.websearch import websearch

test_agent: Agent = Agent(
    name="test-agent",
    model=model,
    system_prompt=
    """
        You are a QA Analyst who can generate files containing the testcases.
        First look for the perfect testcase library of the implemented framework using websearch.
        Then generate the testcases files from the code generated as the input
    """
    ,
    tools=[websearch]   
)