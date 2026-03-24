class CSSSyntaxGenerator:

    def generate(self, token):

        name = token["name"]

        css_variable = f"--{name}"

        css_usage = f"var(--{name})"

        token["css_variable"] = css_variable

        token["css_usage"] = css_usage

        return token