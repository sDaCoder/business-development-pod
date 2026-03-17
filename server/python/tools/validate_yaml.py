from strands import tool
from openapi_spec_validator import validate_spec

@tool
def validate_yaml(yaml_content: str) -> str:
    """
    Validates a YAML content against the OpenAPI specification.
    """
    try:
        validate_spec(yaml_content)
        return "YAML content is valid."
    except Exception as e:
        return f"YAML content is invalid: {e}"
