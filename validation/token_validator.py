import re


class TokenValidator:

    def __init__(self, allowed_tokens):
        self.allowed_tokens = allowed_tokens

    def extract_tokens(self, content: str):
        return re.findall(r"var\(--([a-zA-Z0-9-]+)\)", content)

    def validate(self, content: str):

        used = self.extract_tokens(content)

        violations = []

        for token in used:
            if token not in self.allowed_tokens:
                violations.append({
                    "type": "token_violation",
                    "token": token,
                    "message": f"Unauthorized token used: {token}"
                })

        return violations