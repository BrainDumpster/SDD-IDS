class RuleDeduplicator:

    def deduplicate(self, rules):

        seen = set()

        unique = []

        for r in rules:

            if r.normalized not in seen:

                seen.add(r.normalized)

                unique.append(r)

        return unique