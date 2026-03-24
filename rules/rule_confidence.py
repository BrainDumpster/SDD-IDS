import re


class RuleConfidence:

    def score(self, rule):

        score = 0.0

        text = rule.normalized

        if "must" in text:
            score += 0.4

        if "must not" in text:
            score += 0.4

        if rule.component in text:
            score += 0.2

        if re.search(r"\d+px", text):
            score += 0.2

        if len(text) > 200:
            score -= 0.2

        if "example" in text:
            score -= 0.3

        return max(score, 0.0)