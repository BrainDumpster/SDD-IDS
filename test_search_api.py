#!/usr/bin/env python3
"""
Test script to demonstrate the new Search API that replaces GitHub API
"""

import requests
import json

# API endpoints
SEARCH_API_URL = "http://localhost:8001/search"
RAG_API_URL = "http://localhost:8000/design/query"

def test_search_api():
    """Test the new search API (replaces GitHub API)"""
    print("=== TESTING NEW SEARCH API (Replaces GitHub API) ===")
    
    payload = {
        "query": "gutter spacing icons",
        "top_k": 5
    }
    
    try:
        response = requests.post(SEARCH_API_URL, json=payload)
        if response.status_code == 200:
            result = response.json()
            print("✅ Search API Response:")
            print(json.dumps(result, indent=2))
            
            # Show results in website format
            print("\n🌐 Website Search Results:")
            for i, item in enumerate(result.get("results", [])):
                print(f"  {i+1}. {item['name']}")
                print(f"     URL: {item['url']}")
                print()
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Connection Error: {e}")

def test_rag_api():
    """Test the existing RAG API (unchanged)"""
    print("=== TESTING EXISTING RAG API (Unchanged) ===")
    
    payload = {
        "question": "What is the gutter spacing for icons?",
        "top_k": 3
    }
    
    try:
        response = requests.post(RAG_API_URL, json=payload)
        if response.status_code == 200:
            result = response.json()
            print("✅ RAG API Response:")
            print(f"Answer: {result.get('answer', 'No answer')}")
            print(f"Sources: {len(result.get('sources', []))} found")
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Connection Error: {e}")

def show_integration_example():
    """Show how this integrates with website"""
    print("\n=== WEBSITE INTEGRATION EXAMPLE ===")
    
    # Before: GitHub API call
    print("🔴 BEFORE (GitHub API):")
    print("  const response = await fetch('https://api.github.com/search/...', {")
    print("    method: 'GET',")
    print("    headers: { 'Authorization': 'token ...' }")
    print("  });")
    print("  // Returns: [{ name: '...', url: 'path/to/file' }]")
    
    # After: Local Search API
    print("\n🟢 AFTER (Local Search API):")
    print("  const response = await fetch('http://localhost:8001/search', {")
    print("    method: 'POST',")
    print("    headers: { 'Content-Type': 'application/json' },")
    print("    body: JSON.stringify({ query: 'gutter spacing', top_k: 10 })")
    print("  });")
    print("  // Returns: [{ name: '...', url: 'content/path/to/file.mdx' }]")
    
    print("\n✨ Benefits:")
    print("  - 🚀 Faster (local Qdrant vs GitHub API)")
    print("  - 💰 No GitHub API rate limits")
    print("  - 🔍 Better search (semantic vs text matching)")
    print("  - 📁 Same URL format (source paths match GitHub paths)")

if __name__ == "__main__":
    print("🚀 Testing Search API (GitHub API Replacement)")
    print("=" * 60)
    
    # Test new search API
    test_search_api()
    
    print("\n" + "=" * 60)
    
    # Test existing RAG API (unchanged)
    test_rag_api()
    
    # Show integration example
    show_integration_example()
    
    print("\n✨ Test Complete!")
    print("\nUsage:")
    print("- Search API: Replace GitHub API for website search")
    print("- RAG API: Unchanged - still generates answers with context")
