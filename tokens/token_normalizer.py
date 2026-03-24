class TokenNormalizer:

    TYPE_MAP = {

        "COLOR": "color",

        "FLOAT": "spacing",

        "STRING": "typography"
    }

    def normalize(self, raw):

        token_type = self.TYPE_MAP.get(raw["type"], "generic")

        value = raw["value"]

        if token_type == "spacing":

            value = f"{value}px"

        # Generate CSS variable name and usage
        css_variable = f"--{raw['name'].lower().replace(' ', '-').replace('/', '-')}"
        css_usage = f"var({css_variable})"

        return {
            "name": raw["name"],
            "value": value,
            "type": token_type,
            "collection": raw["collection"],
            "css_variable": css_variable,
            "css_usage": css_usage
        }