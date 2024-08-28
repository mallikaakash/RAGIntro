from llama_index.llms import OpenAI
import os

llama_api_key = os.getenv("LLAMA_API_KEY")
if not llama_api_key:
    raise ValueError("LLAMA_API_KEY environment variable is not set")


llm = OpenAI(
    model="gpt-3.5-turbo",
    model_path=None,
    temperature=0.1,
    max_new_tokens=256,
    context_window=3900,
    generate_kwargs={},
    model_kwargs={"n_gpu_layers": 1},
    verbose=True,
)

# Generate completion
resp = llm.complete("Paul Graham is ")

print(resp)

