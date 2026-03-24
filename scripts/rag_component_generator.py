#!/usr/bin/env python3
"""
RAG-Powered Component Generator
Integrates design system knowledge with component generation
"""

import sys
from pathlib import Path

# Add project root to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from generation.component_generator import ComponentGenerator
from generation.style_modes import StyleMode
from rag.design_rag import DesignRAG
from generation.auto_repair_engine import AutoRepairEngine


class RAGComponentGenerator:
    """
    Component Generator with RAG integration
    Uses design system knowledge to generate contextually-aware components
    """
    
    def __init__(self, model="llama3"):
        self.rag = DesignRAG()
        self.generator = ComponentGenerator(model)
        self.repair_engine = AutoRepairEngine()
    
    def generate_component(
        self,
        component_name: str,
        description: str,
        framework: str = "React",
        style_mode: str = "css-module"
    ) -> dict:
        """
        Generate a component using RAG-retrieved design knowledge
        
        Args:
            component_name: Name of the component to generate
            description: Natural language description of requirements
            framework: React or Angular
            style_mode: css-module, css-in-js, or angular-scss
            
        Returns:
            Generated component with context and metadata
        """
        
        print(f"🔍 Retrieving design knowledge for: {component_name}")
        
        # 1️⃣ Query RAG for relevant design knowledge
        rag_query = f"""
        Component: {component_name}
        Requirements: {description}
        
        Please provide:
        - Design tokens and CSS variables
        - Layout and spacing guidelines
        - Typography specifications
        - Accessibility requirements
        - State management (hover, focus, disabled)
        - Dark theme considerations
        """
        
        design_knowledge = self.rag.query(rag_query)
        
        print(f"📚 Retrieved design knowledge")
        print(f"🎨 Generating {framework} component with {style_mode}")
        
        # 2️⃣ Build context for generator
        context = {
            "component_name": component_name,
            "rules": design_knowledge,
            "anatomy": self._extract_anatomy(design_knowledge),
            "tokens": self._extract_tokens(design_knowledge),
            "spec": design_knowledge,
            "request": description,
            "framework": framework,
            "style_mode": style_mode
        }
        
        # 3️⃣ Generate component
        style_enum = StyleMode(style_mode)
        
        generated = self.generator.generate(
            context=context,
            framework=framework,
            style_mode=style_enum
        )
        
        # 4️⃣ Auto-repair and validate
        repaired = self.repair_engine.repair(component_name, generated)
        
        # 5️⃣ Add metadata
        result = {
            "component_name": component_name,
            "framework": framework,
            "style_mode": style_mode,
            "description": description,
            "design_knowledge": design_knowledge,
            "generated_code": repaired,
            "metadata": {
                "rag_enabled": True,
                "model": "llama3",
                "embedding_model": "embeddinggemma"
            }
        }
        
        print(f"✅ Component generation completed!")
        return result
    
    def _extract_anatomy(self, knowledge: str) -> str:
        """Extract anatomy information from RAG response"""
        lines = knowledge.split('\n')
        anatomy_section = []
        
        for line in lines:
            if 'anatomy' in line.lower() or 'structure' in line.lower():
                # Add current and next few lines
                idx = knowledge.split('\n').index(line)
                for i in range(max(0, idx-1), min(len(lines), idx+5)):
                    anatomy_section.append(lines[i])
                break
        
        return '\n'.join(anatomy_section) if anatomy_section else ""
    
    def _extract_tokens(self, knowledge: str) -> str:
        """Extract token information from RAG response"""
        lines = knowledge.split('\n')
        token_section = []
        
        for line in lines:
            if any(keyword in line.lower() for keyword in ['token', 'variable', 'css', 'color', 'spacing']):
                # Add current and next few lines
                idx = knowledge.split('\n').index(line)
                for i in range(max(0, idx-1), min(len(lines), idx+3)):
                    token_section.append(lines[i])
                break
        
        return '\n'.join(token_section) if token_section else ""


def main():
    """Interactive component generator"""
    generator = RAGComponentGenerator()
    
    print("🎨 RAG-Powered Component Generator")
    print("=" * 50)
    
    # Get user input
    component_name = input("Component name: ").strip()
    description = input("Description: ").strip()
    framework = input("Framework (React/Angular) [React]: ").strip() or "React"
    style_mode = input("Style mode (css-module/css-in-js/angular-scss) [css-module]: ").strip() or "css-module"
    
    if not component_name or not description:
        print("❌ Component name and description are required!")
        return
    
    # Generate component
    result = generator.generate_component(
        component_name=component_name,
        description=description,
        framework=framework,
        style_mode=style_mode
    )
    
    # Display results
    print("\n" + "=" * 50)
    print(f"📦 Generated: {result['component_name']}")
    print(f"🔧 Framework: {result['framework']}")
    print(f"🎨 Style Mode: {result['style_mode']}")
    print("\n📋 Description:")
    print(result['description'])
    
    print("\n💾 Generated Code:")
    print("-" * 30)
    
    if framework.lower() == "react":
        if result['generated_code'].get('component'):
            print("Component (React):")
            print(result['generated_code']['component'])
        
        if result['generated_code'].get('css'):
            print("\nCSS:")
            print(result['generated_code']['css'])
    
    elif framework.lower() == "angular":
        for file_type, content in result['generated_code'].items():
            if content:
                print(f"\n{file_type.upper()}:")
                print(content)
    
    print("\n🔗 Design Knowledge Used:")
    print("-" * 30)
    print(result['design_knowledge'][:500] + "..." if len(result['design_knowledge']) > 500 else result['design_knowledge'])


if __name__ == "__main__":
    main()
