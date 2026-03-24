from validation.design_validator import DesignValidator


# Singleton instance for performance
_validator = DesignValidator()


def validate_design(component: str, code: str) -> dict:
    """
    Validate a component implementation against design system rules.

    Args:
        component (str): Component name (e.g., 'footer', 'button')
        code (str): HTML/CSS/JSX code to validate

    Returns:
        dict: Validation report with summary and violations
    """

    if not component:
        raise ValueError("Component name is required")

    if not code or not code.strip():
        raise ValueError("Code content is empty")

    report = _validator.validate(component, code)

    return report