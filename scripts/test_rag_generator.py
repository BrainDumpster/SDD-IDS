#!/usr/bin/env python3
"""
Test script for RAG-Powered Component Generator
"""

import sys
from pathlib import Path

# Add project root to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from generation.rag_component_generator import generate_component_from_query


def test_component_generation():
    """Test various component generation scenarios"""
    
    print("🎨 Testing RAG-Powered Component Generator")
    print("=" * 60)
    
    test_queries = [
        {
            "query": "Create a primary button with hover effects and loading state",
            "framework": "React",
            "style_mode": "css-module"
        },
        {
            "query": "Build a responsive navigation menu with dropdown submenus and mobile hamburger",
            "framework": "React",
            "style_mode": "css-in-js"
        },
        {
            "query": "Generate a data table with sorting, filtering, and pagination for user management",
            "framework": "Angular",
            "style_mode": "angular-scss"
        },
        {
            "query": "Create a modal dialog with form validation and accessibility features",
            "framework": "React",
            "style_mode": "css-module"
        },
        {
            "query": "Build a card component for displaying product information with image and price",
            "framework": "React",
            "style_mode": "css-in-js"
        }
    ]
    
    for i, test in enumerate(test_queries, 1):
        print(f"\n🧪 Test {i}: {test['query']}")
        print(f"   Framework: {test['framework']}, Style: {test['style_mode']}")
        print("-" * 60)
        
        try:
            result = generate_component_from_query(
                query=test['query'],
                framework=test['framework'],
                style_mode=test['style_mode']
            )
            
            print(f"✅ Component: {result['component_info'].get('name', 'Unknown')}")
            print(f"📋 Purpose: {result['component_info'].get('purpose', 'N/A')}")
            print(f"🎯 Features: {', '.join(result['component_info'].get('features', []))}")
            
            # Show code preview
            generated = result['generated_code']
            if test['framework'].lower() == 'react':
                if generated.get('component'):
                    component_code = generated['component']
                    print(f"📦 Component Code ({len(component_code)} chars)")
                    print(component_code[:200] + "..." if len(component_code) > 200 else component_code)
                
                if generated.get('css'):
                    css_code = generated['css']
                    print(f"🎨 CSS Code ({len(css_code)} chars)")
                    print(css_code[:150] + "..." if len(css_code) > 150 else css_code)
            
            elif test['framework'].lower() == 'angular':
                for file_type, content in generated.items():
                    if content and file_type != 'raw':
                        print(f"📄 {file_type.upper()} ({len(content)} chars)")
                        print(content[:150] + "..." if len(content) > 150 else content)
            
            print(f"🔗 Used {len(result['design_knowledge'])} chars of design knowledge")
            
        except Exception as e:
            print(f"❌ Error: {str(e)}")
        
        print("\n" + "=" * 60)


def interactive_test():
    """Interactive test with user input"""
    
    print("\n🎮 Interactive Component Generator")
    print("Enter your component description (or 'quit' to exit):")
    
    while True:
        query = input("\n📝 Component description: ").strip()
        
        if query.lower() in ['quit', 'exit', 'q']:
            break
        
        if not query:
            continue
        
        framework = input("🔧 Framework (React/Angular) [React]: ").strip() or "React"
        style_mode = input("🎨 Style mode (css-module/css-in-js/angular-scss) [css-module]: ").strip() or "css-module"
        
        print(f"\n🔄 Generating {framework} component with {style_mode}...")
        
        try:
            result = generate_component_from_query(query, framework, style_mode)
            
            print(f"\n✅ Generated: {result['component_info'].get('name', 'Component')}")
            print(f"📋 Purpose: {result['component_info'].get('purpose', '')}")
            
            # Display full code
            generated = result['generated_code']
            print(f"\n💾 Generated Code:")
            print("-" * 40)
            
            if framework.lower() == 'react':
                if generated.get('component'):
                    print("COMPONENT:")
                    print(generated['component'])
                
                if generated.get('css'):
                    print("\nCSS:")
                    print(generated['css'])
            
            elif framework.lower() == 'angular':
                for file_type, content in generated.items():
                    if content and file_type != 'raw':
                        print(f"\n{file_type.upper()}:")
                        print(content)
            
        except Exception as e:
            print(f"❌ Error: {str(e)}")


def main():
    """Main test runner"""
    
    print("🎨 RAG Component Generator Test Suite")
    print("Choose test mode:")
    print("1. Predefined tests")
    print("2. Interactive mode")
    print("3. Both")
    
    choice = input("Enter choice (1-3): ").strip()
    
    if choice == '1':
        test_component_generation()
    elif choice == '2':
        interactive_test()
    elif choice == '3':
        test_component_generation()
        interactive_test()
    else:
        print("Running predefined tests...")
        test_component_generation()


if __name__ == "__main__":
    main()
