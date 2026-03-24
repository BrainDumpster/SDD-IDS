from fastapi import FastAPI
from pydantic import BaseModel
from generation.generation_pipeline import GenerationPipeline

app = FastAPI(title="AI Component Generator")

pipeline = GenerationPipeline()


class GenerationRequest(BaseModel):
    component: str
    request: str
    framework: str = "React"


@app.post("/design/generate")
def generate(req: GenerationRequest):

    result = pipeline.run(req.component, req.request)

    return result