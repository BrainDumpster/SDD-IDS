class TokenNormalizer:

    TYPE_MAP = {

        "COLOR": "color",

        "FLOAT": "spacing",

        "STRING": "typography"
    }

    def __init__(self, token_css_transform=None):
        """
        Args:
            token_css_transform: Optional callable(name: str) -> str that
                produces a CSS variable name from a Figma token path.
                If None, uses the default transform.
        """
        self._transform = token_css_transform

    def _default_transform(self, name: str) -> str:
        return f"--{name.lower().replace(' ', '-').replace('/', '-')}"

    def normalize(self, raw):

        token_type = self.TYPE_MAP.get(raw["type"], "generic")

        value = raw["value"]

        if token_type == "spacing":

            value = f"{value}px"

        # Generate CSS variable name using configurable transform
        transform = self._transform or self._default_transform
        css_variable = transform(raw["name"])
        css_usage = f"var({css_variable})"

        return {
            "name": raw["name"],
            "value": value,
            "type": token_type,
            "collection": raw["collection"],
            "css_variable": css_variable,
            "css_usage": css_usage
        }