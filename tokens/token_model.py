from dataclasses import dataclass


@dataclass
class DesignToken:

    name: str

    value: str

    type: str

    collection: str

    css_variable: str

    css_usage: str