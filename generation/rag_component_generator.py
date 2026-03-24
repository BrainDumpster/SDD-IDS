"""
RAG-Powered Component Generator
Takes natural language queries and generates framework components using design system knowledge
"""

from typing import Dict, Any, List
from langchain_community.llms import Ollama
from rag.design_rag import DesignRAG
from generation.component_generator import ComponentGenerator
from generation.style_modes import StyleMode
from generation.auto_repair_engine import AutoRepairEngine


class RAGComponentGenerator:
    """
    Query-driven component generator using RAG
    """
    
    def __init__(self, model: str = "llama3"):
        self.rag = DesignRAG()
        self.generator = ComponentGenerator(model)
        self.repair_engine = AutoRepairEngine()
        self.llm = Ollama(model=model, temperature=0.1)
    
    def generate_from_query(
        self,
        query: str,
        framework: str = "React",
        style_mode: str = "css-module"
    ) -> Dict[str, Any]:
        """
        Generate component from natural language query
        
        Args:
            query: Natural language description of component requirements
            framework: React or Angular
            style_mode: css-module, css-in-js, or angular-scss
            
        Returns:
            Generated component with context and metadata
        """
        
        # 1️⃣ Extract component requirements from query
        component_info = self._analyze_query(query)
        
        # 2️⃣ Retrieve relevant design knowledge
        design_knowledge = self._retrieve_design_knowledge(query, component_info)
        
        # 3️⃣ Generate component using enhanced prompt
        generated = self._generate_with_rag(
            query=query,
            component_info=component_info,
            design_knowledge=design_knowledge,
            framework=framework,
            style_mode=style_mode
        )
        
        # 4️⃣ Auto-repair and validate
        repaired = self.repair_engine.repair(component_info.get('name', 'Component'), generated)
        
        return {
            "query": query,
            "component_info": component_info,
            "framework": framework,
            "style_mode": style_mode,
            "design_knowledge": design_knowledge,
            "generated_code": repaired,
            "metadata": {
                "rag_enabled": True,
                "model": "llama3",
                "embedding_model": "embeddinggemma"
            }
        }
    
    def _analyze_query(self, query: str) -> Dict[str, Any]:
        """Analyze user query to extract component requirements"""
        
        analysis_prompt = f"""
Analyze this component request and extract key information:

Query: "{query}"

Extract and return:
1. Component name/type
2. Main functionality/purpose
3. Key features required
4. Style/theme requirements
5. Any specific constraints

Respond in JSON format:
{{
  "name": "component_name",
  "purpose": "main_functionality",
  "features": ["feature1", "feature2"],
  "style_requirements": "style_info",
  "constraints": "constraints_info"
}}
"""
        
        response = self.llm.invoke(analysis_prompt)
        
        # Simple JSON extraction (in production, use proper JSON parsing)
        try:
            import json
            return json.loads(response)
        except:
            # Fallback extraction
            return {
                "name": "custom_component",
                "purpose": query,
                "features": [],
                "style_requirements": "",
                "constraints": ""
            }
    
    def _retrieve_design_knowledge(self, query: str, component_info: Dict[str, Any]) -> str:
        """Retrieve relevant design system knowledge"""
        
        # Build comprehensive RAG query
        rag_query = f"""
Component: {component_info.get('name', 'Unknown')}
Purpose: {component_info.get('purpose', '')}
Features: {', '.join(component_info.get('features', []))}
Style Requirements: {component_info.get('style_requirements', '')}

Original Query: {query}

Please provide comprehensive design system guidance including:
- Design tokens and CSS variables with actual values
- Layout specifications and spacing
- Typography hierarchy
- Color schemes (light/dark theme)
- State management (hover, focus, disabled, active)
- Accessibility requirements and ARIA attributes
- Responsive design guidelines
- Component anatomy and structure
- Implementation best practices
"""
        
        return self.rag.query(rag_query)
    
    def _generate_with_rag(
        self,
        query: str,
        component_info: Dict[str, Any],
        design_knowledge: str,
        framework: str,
        style_mode: str
    ) -> Dict[str, str]:
        """Generate component using RAG-enhanced prompt"""
        
        # Build enhanced prompt template
        prompt = self._build_enhanced_prompt(
            query=query,
            component_info=component_info,
            design_knowledge=design_knowledge,
            framework=framework,
            style_mode=style_mode
        )
        
        # Generate using the component generator with enhanced context
        context = {
            "component_name": component_info.get('name', 'CustomComponent'),
            "rules": design_knowledge,
            "anatomy": self._extract_section(design_knowledge, ['anatomy', 'structure']),
            "tokens": self._extract_section(design_knowledge, ['tokens', 'variables', 'css']),
            "spec": design_knowledge,
            "request": query,
            "framework": framework,
            "style_mode": style_mode
        }
        
        style_enum = StyleMode(style_mode)
        return self.generator.generate(
            context=context,
            framework=framework,
            style_mode=style_enum
        )
    
    def _build_enhanced_prompt(
        self,
        query: str,
        component_info: Dict[str, Any],
        design_knowledge: str,
        framework: str,
        style_mode: str
    ) -> str:
        """Build comprehensive prompt for component generation"""
        
        return f"""
You are an expert UI/UX developer and design system specialist.

TASK: Generate a {framework} component based on the user's requirements and design system knowledge.

USER QUERY:
{query}

COMPONENT ANALYSIS:
- Name: {component_info.get('name', 'CustomComponent')}
- Purpose: {component_info.get('purpose', '')}
- Features: {', '.join(component_info.get('features', []))}
- Style Requirements: {component_info.get('style_requirements', '')}

DESIGN SYSTEM KNOWLEDGE:
{design_knowledge}

REQUIREMENTS:
1. Use the provided design tokens and CSS variables exactly as specified
2. Follow the layout and spacing guidelines from the design system
3. Implement proper accessibility (ARIA attributes, keyboard navigation)
4. Include all states (hover, focus, disabled, active) as specified
5. Support both light and dark themes using semantic tokens
6. Follow the component anatomy and structure guidelines
7. Use the typography hierarchy as specified
8. Ensure responsive design principles

FRAMEWORK: {framework}
STYLE MODE: {style_mode}

OUTPUT FORMAT:
Generate clean, production-ready code that:
- Follows modern {framework} best practices
- Uses semantic HTML elements
- Implements proper event handling
- Includes comprehensive styling
- Is fully accessible and responsive

For React with CSS Modules:
=== COMPONENT ===
[React component code]

=== CSS ===
[CSS module code]

For React with CSS-in-JS:
=== COMPONENT ===
[React component with styled-components]

For Angular with SCSS:
=== COMPONENT_TS ===
[TypeScript component code]

=== COMPONENT_HTML ===
[HTML template code]

=== COMPONENT_SCSS ===
[SCSS stylesheet code]
"""
    
    def _extract_section(self, knowledge: str, keywords: List[str]) -> str:
        """Extract relevant sections from design knowledge"""
        lines = knowledge.split('\n')
        relevant_lines = []
        
        for line in lines:
            if any(keyword.lower() in line.lower() for keyword in keywords):
                # Add current and surrounding lines
                idx = knowledge.split('\n').index(line)
                for i in range(max(0, idx-2), min(len(lines), idx+4)):
                    relevant_lines.append(lines[i])
        
        return '\n'.join(relevant_lines) if relevant_lines else knowledge[:1000]


# Usage examples and query patterns
QUERY_PATTERNS = {
    "button": [
        "Create a primary button with hover effects",
        "Generate a disabled button state",
        "Build a button with loading spinner"
    ],
    "form": [
        "Create a login form with validation",
        "Build a contact form with proper accessibility",
        "Generate a multi-step form wizard"
    ],
    "navigation": [
        "Create a responsive navigation menu",
        "Build a breadcrumb navigation",
        "Generate a tab component"
    ],
    "data_display": [
        "Create a data table with sorting",
        "Build a card component for content",
        "Generate a list view with filters"
    ]
}


def generate_component_from_query(query: str, framework: str = "React", style_mode: str = "css-module") -> Dict[str, Any]:
    """
    Convenience function to generate component from query
    """
    generator = RAGComponentGenerator()
    return generator.generate_from_query(query, framework, style_mode)
