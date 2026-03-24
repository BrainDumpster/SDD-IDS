from pydantic import BaseModel
from typing import Optional


class DesignRule(BaseModel):

    rule_id: str

    component: str

    category: str

    description: str

    severity: str

    source_section: str

    normalized: Optional[str] = None

    confidence: float = 0.0