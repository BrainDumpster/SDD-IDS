#!/usr/bin/env python3
"""
Test script to demonstrate both API response formats
"""

import requests
import json

# API endpoint
API_URL = "http://localhost:8000/design/query"

def test_standard_format():
    """Test standard format (default)"""
    print("=== TESTING STANDARD FORMAT ===")
    
    payload = {
        "question": "What is the gutter spacing for icons in masthead?",
        "top_k": 3
    }
    
    try:
        response = requests.post(API_URL, json=payload)
        if response.status_code == 200:
            result = response.json()
            print("✅ Standard Format Response:")
            print(json.dumps(result, indent=2))
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Connection Error: {e}")

def test_json_format():
    """Test JSON format (for website search)"""
    print("\n=== TESTING JSON FORMAT (Website Search) ===")
    
    payload = {
        "question": "What is the gutter spacing for icons in masthead?",
        "top_k": 3,
        "output_format": "json"
    }
    
    try:
        response = requests.post(API_URL, json=payload)
        if response.status_code == 200:
            result = response.json()
            print("✅ JSON Format Response:")
            print(json.dumps(result, indent=2))
            
            # Show website-specific fields
            print("\n🌐 Website-Specific Fields:")
            print(f"Title: {result.get('title')}")
            print(f"Description: {result.get('description')}")
            print(f"URL: {result.get('url')}")
            print(f"Category: {result.get('category')}")
            print(f"Tags: {result.get('tags')}")
            print(f"Source: {result.get('source')}")  # <-- New direct source field
            print(f"All Sources: {result.get('metadata', {}).get('sources', [])}")
            
            # Show full metadata for debugging
            if result.get('metadata', {}).get('all_metadata'):
                print("\n🔍 Document Metadata (for debugging):")
                for i, meta in enumerate(result['metadata']['all_metadata']):
                    print(f"  Doc {i+1}: {meta}")
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    print("🚀 Testing RAG API Response Formats")
    print("=" * 50)
    
    # Test standard format
    test_standard_format()
    
    # Test JSON format
    test_json_format()
    
    print("\n✨ Test Complete!")
    print("\nUsage:")
    print("- Standard format: Use for detailed responses with sources")
    print("- JSON format: Use for website search results")
