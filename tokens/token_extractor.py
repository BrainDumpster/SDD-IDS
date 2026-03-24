class TokenExtractor:

    def extract(self, figma_data):

        tokens = []

        variables = figma_data["meta"]["variables"]

        for v in variables:

            name = v["name"]

            resolved = v.get("resolvedValuesByMode", {})

            value = list(resolved.values())[0] if resolved else None

            tokens.append({
                "name": name,
                "value": value,
                "type": v["resolvedType"],
                "collection": v["variableCollectionId"]
            })

        return tokens