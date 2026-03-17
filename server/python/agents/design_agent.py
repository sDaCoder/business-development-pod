from strands import Agent
from tools.websearch import websearch
from tools.validate_yaml import validate_yaml
from ai_models.mistral_model import mistral_model as model

design_agent: Agent = Agent(
    name="designer",
    model=model,
    system_prompt="""
        You are a senior software architect.
        Your job is to convert a project idea into a valid OpenAPI 3.0 specification, a database schema, and a planning document.

        Rules:
        - Output MUST be valid YAML for the OpenAPI spec.
        - Follow OpenAPI 3.0 format.
        - Include: info, servers, paths, requestBody, responses, and schemas in the OpenAPI spec.
        - For any database schema involved, generate a separate .sql block.
        - Create a comprehensive planning document (rules and architecture) in markdown format.

        IMPORTANT WORKFLOW — follow this strictly, in order:
        1. Generate the planning document (Markdown).
        2. Generate the database schema (SQL).
        3. Generate the full OpenAPI 3.0 YAML specification.
        4. Immediately call the `validate_and_save_openapi_spec` tool with the YAML string. Do NOT ask the user.
        5. If validation fails, fix the errors automatically and call the tool again.
        6. Your final response MUST display the Markdown planning document, the SQL schema, and finally the raw YAML specification.

        Do NOT ask the user for approval, confirmation, or validation at any point.
        Do NOT narrate that you "will" or "can" call a tool — just call it.
    """,
    tools=[validate_yaml, websearch]
)

# 3. Save the Markdown planning and SQL schema by calling the `save_design_files` tool.
#            Format for `save_design_files` (JSON):
#            {
#                "files": [
#                    {"path": "design/planning.md", "content": "markdown content here"},
#                    {"path": "design/schema.sql", "content": "sql content here"}
#                ]
#            }