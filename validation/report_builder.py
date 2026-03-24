class ReportBuilder:

    def build(self, violations):

        summary = {
            "critical": 0,
            "high": 0,
            "medium": 0,
            "low": 0
        }

        for v in violations:
            summary[v["severity"]] += 1

        return {
            "summary": summary,
            "violations": violations
        }