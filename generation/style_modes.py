from enum import Enum


class StyleMode(str, Enum):
    CSS_MODULE = "css-module"
    CSS_IN_JS = "css-in-js"
    ANGULAR_SCSS = "angular-scss"