from typing import Dict, Any
from langchain_community.llms import Ollama

from validation.validate_design import validate_design


class AutoRepairEngine:
    """
    Automatically repairs generated components using validator feedback.
    """

    def __init__(self, model: str = "llama3"):
        self.llm = Ollama(model=model, temperature=0.1)

    def repair(
        self,
        component_name: str,
        generated: Dict[str, str],
        max_attempts: int = 2
    ) -> Dict[str, Any]:

        current = generated
        attempts = 0

        while attempts < max_attempts:

            report = validate_design(
                component_name,
                current.get("component", "")
            )

            critical = report["summary"].get("critical", 0)
            high = report["summary"].get("high", 0)

            if critical == 0 and high == 0:
                return {
                    "final_output": current,
                    "validation": report,
                    "repaired": attempts > 0
                }

            issues = "\n".join([
                f"- {v.get('message','violation')}"
                for v in report["violations"]
            ])

            repair_prompt = f"""
Fix the component to satisfy design rules.

VIOLATIONS:
{issues}

CURRENT CODE:
{current.get("component","")}

Fix all issues. Output only corrected code.
"""

            fixed = self.llm.invoke(repair_prompt)

            current["component"] = fixed
            attempts += 1

        return {
            "final_output": current,
            "validation": report,
            "repaired": True,
            "warning": "Max repair attempts reached"
        }