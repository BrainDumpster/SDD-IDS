from fastapi import FastAPI
from pydantic import BaseModel
from validation.design_validator import DesignValidator

app = FastAPI(title="Design Rule Validator API")

validator = DesignValidator()


class ValidationRequest(BaseModel):
    component: str
    content: str


@app.post("/design/validate")
def validate(req: ValidationRequest):

    report = validator.validate(req.component, req.content)

    return report