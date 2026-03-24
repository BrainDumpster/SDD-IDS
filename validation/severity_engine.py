class SeverityEngine:

    def score(self, violations):

        for v in violations:

            if "accessibility" in str(v):
                v["severity"] = "critical"
            elif "token" in v.get("type",""):
                v["severity"] = "high"
            elif "structure" in v.get("type",""):
                v["severity"] = "medium"
            else:
                v["severity"] = "low"

        return violations