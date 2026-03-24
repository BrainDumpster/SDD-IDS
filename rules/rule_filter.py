class RuleFilter:

    def filter(self, rules, threshold=0.5):

        return [r for r in rules if r.confidence >= threshold]