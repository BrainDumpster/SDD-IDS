from fastapi import FastAPI
from pydantic import BaseModel

from rules.rule_engine import RuleEngine


app = FastAPI()

engine = RuleEngine()


class ValidationRequest(BaseModel):

    component: str


@app.post("/validate/component")
def validate_component(req: ValidationRequest):

    result = engine.validate_component(req.component)

    return {
        "component": req.component,
        "rules": result
    }