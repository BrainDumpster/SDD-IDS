import re


class RuleNormalizer:

    def normalize(self, text):

        t = text.lower().strip()

        t = re.sub(r"\s+", " ", t)

        # remove filler phrases
        t = t.replace("should", "must")
        t = t.replace("should not", "must not")

        # remove punctuation
        t = re.sub(r"[^\w\s]", "", t)

        return t