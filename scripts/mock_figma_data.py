#!/usr/bin/env python3
"""
Create mock Figma data for testing token sync pipeline
"""

import json

def create_mock_figma_data():
    """Create mock Figma variables data"""
    
    mock_data = {
        "meta": {
            "variables": {
                "color/blue/primary": {
                    "name": "color/blue/primary",
                    "description": "Primary blue color",
                    "value": "#0066CC",
                    "type": "COLOR"
                },
                "color/gray/light": {
                    "name": "color/gray/light", 
                    "description": "Light gray color",
                    "value": "#F5F5F5",
                    "type": "COLOR"
                },
                "spacing/small": {
                    "name": "spacing/small",
                    "description": "Small spacing unit",
                    "value": "8px",
                    "type": "FLOAT"
                },
                "spacing/medium": {
                    "name": "spacing/medium",
                    "description": "Medium spacing unit", 
                    "value": "16px",
                    "type": "FLOAT"
                },
                "font/size/body": {
                    "name": "font/size/body",
                    "description": "Body text size",
                    "value": "14px",
                    "type": "FLOAT"
                },
                "font/size/heading": {
                    "name": "font/size/heading",
                    "description": "Heading text size",
                    "value": "24px",
                    "type": "FLOAT"
                },
                "border/radius/small": {
                    "name": "border/radius/small",
                    "description": "Small border radius",
                    "value": "4px",
                    "type": "FLOAT"
                },
                "border/radius/medium": {
                    "name": "border/radius/medium",
                    "description": "Medium border radius",
                    "value": "8px",
                    "type": "FLOAT"
                }
            }
        }
    }
    
    # Save mock data
    with open("mock_figma_variables.json", "w") as f:
        json.dump(mock_data, f, indent=2)
    
    print("Mock Figma data created: mock_figma_variables.json")
    print(f"Contains {len(mock_data['meta']['variables'])} mock variables")

if __name__ == "__main__":
    create_mock_figma_data()
