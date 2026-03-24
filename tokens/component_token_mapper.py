from pathlib import Path


class ComponentTokenMapper:

    def generate(self, components, tokens):

        base = Path("design-system-knowledge/components")

        base.mkdir(parents=True, exist_ok=True)

        for comp in components:

            file = base / f"{comp}_tokens.md"

            with open(file, "w") as f:

                f.write(f"# {comp.title()} Tokens\n\n")

                for t in tokens:

                    if comp in t["name"]:

                        f.write(
                            f"- `{t['css_usage']}` → {t['name']}\n"
                        )