from strands.models.mistral import MistralModel
import os
from dotenv import load_dotenv

load_dotenv()

mistral_model_ids = ["devstral-latest", "devstral-medium-latest", "mistral-vibe-cli-latest"]

class MistralModelProxy:
    def __init__(self, **kwargs):
        self._model = MistralModel(**kwargs)
        self.model_id = kwargs.get("model_id")
        self.max_tokens = kwargs.get("max_tokens")
        self.temperature = kwargs.get("temperature")

    def update(self, **kwargs):
        """Update the internal model with new parameters."""
        new_params = {
            "model_id": kwargs.get("model_id", self.model_id),
            "api_key": os.getenv("MISTRAL_API_KEY"),
            "max_tokens": kwargs.get("max_tokens", self.max_tokens),
            "temperature": kwargs.get("temperature", self.temperature),
        }
        self._model = MistralModel(**new_params)
        self.model_id = new_params["model_id"]
        self.max_tokens = new_params["max_tokens"]
        self.temperature = new_params["temperature"]
        print(f"MistralModel updated to: {self.model_id}, temp: {self.temperature}")

    def __getattr__(self, name):
        return getattr(self._model, name)

mistral_model = MistralModelProxy(
    model_id="devstral-latest",
    api_key=os.getenv("MISTRAL_API_KEY"),
    max_tokens=10000,
    temperature=0.7,
)

def change_model_params(
    model_id: str,
    max_tokens: int = 10000,
    temperature: float = 0.7
):
    mistral_model.update(
        model_id=model_id,
        max_tokens=max_tokens,
        temperature=temperature
    )