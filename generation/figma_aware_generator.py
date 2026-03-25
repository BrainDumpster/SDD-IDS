"""
Figma-Aware Component Generator
Enhanced component generator that integrates Figma specifications with RAG knowledge
"""

import re
from typing import Dict, Any, Optional, List
from langchain_community.llms import Ollama

from generation.style_modes import StyleMode
from generation.figma_enhanced_prompts import FigmaEnhancedPrompts, create_figma_enhanced_context
from generation.component_generator import ComponentGenerator
from tokens.figma_spec_extractor import ComponentSpec
from rag.design_rag import DesignRAG
from retrieval.design_retriever import DesignRetriever


class FigmaAwareGenerator:
    """
    Enhanced component generator that combines Figma specifications with RAG knowledge
    """
    
    def __init__(self, model: str = "llama3"):
        self.llm = Ollama(model=model, temperature=0.1)
        self.rag = DesignRAG()
        self.retriever = DesignRetriever()
        self.base_generator = ComponentGenerator(model)
        self.prompt_builder = FigmaEnhancedPrompts()
    
    def generate_with_figma_specs(
        self,
        figma_spec: ComponentSpec,
        framework: str = "React",
        style_mode: StyleMode = StyleMode.CSS_MODULE,
        additional_query: str = "",
        include_documentation: bool = True
    ) -> Dict[str, str]:
        """
        Generate component using Figma specifications and RAG knowledge
        
        Args:
            figma_spec: Component specification from Figma
            framework: Target framework (React, Angular)
            style_mode: Styling approach
            additional_query: Additional user requirements
            include_documentation: Whether to include documentation from RAG
            
        Returns:
            Generated component with structured output
        """
        print(f"🎨 Generating {figma_spec.name} for {framework} using Figma specs")
        
        # 1️⃣ Retrieve additional documentation if requested
        documentation = ""
        if include_documentation:
            documentation = self._retrieve_documentation(figma_spec)
        
        # 2️⃣ Build enhanced context
        context = create_figma_enhanced_context(
            figma_spec=figma_spec,
            documentation=documentation,
            framework=framework
        )
        
        # 3️⃣ Build Figma-aware prompt
        prompt = self.prompt_builder.build_figma_aware_prompt(
            framework=framework,
            style_mode=style_mode,
            figma_spec=figma_spec,
            additional_context={"documentation": documentation}
        )
        
        # 4️⃣ Add additional query if provided
        if additional_query:
            prompt += f"\n\n## ADDITIONAL REQUIREMENTS\n{additional_query}\n"
        
        # 5️⃣ Generate with LLM
        raw_output = self.llm.invoke(prompt)
        
        # 6️⃣ Parse and validate output
        parsed = self._parse_figma_aware_output(raw_output, framework, style_mode)
        
        # 7️⃣ Validate against Figma specs
        validation = self._validate_against_figma(parsed, figma_spec)
        
        # 8️⃣ Add metadata
        parsed["metadata"] = {
            "component": figma_spec.name,
            "framework": framework.lower(),
            "style_mode": str(style_mode).lower().replace(".", "_"),
            "figma_source": figma_spec.figma_url,
            "node_id": figma_spec.node_id,
            "validation": validation,
            "generated_with_figma": True
        }
        
        print(f"✅ Generated {figma_spec.name} with validation score: {validation['score']}/100")
        return parsed
    
    def generate_with_state_variations(
        self,
        figma_spec: ComponentSpec,
        framework: str = "React",
        style_mode: StyleMode = StyleMode.CSS_MODULE,
        states: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Generate component with all state variations
        
        Args:
            figma_spec: Component specification from Figma
            framework: Target framework
            style_mode: Styling approach
            states: List of states to generate (None for all)
            
        Returns:
            Generated component with state variations
        """
        print(f"🔄 Generating {figma_spec.name} with state variations")
        
        # Get states to generate
        target_states = states or [s['name'] for s in figma_spec.states] if figma_spec.states else []
        
        # Generate base component first
        base_result = self.generate_with_figma_specs(
            figma_spec=figma_spec,
            framework=framework,
            style_mode=style_mode
        )
        
        # Generate state-specific variations
        state_variations = {}
        
        for state_name in target_states:
            if state_name.lower() == 'default':
                continue  # Already included in base
            
            print(f"  🎯 Generating {state_name} state")
            
            # Find state specification
            state_spec = {}
            if figma_spec.states:
                for state in figma_spec.states:
                    if state['name'].lower() == state_name.lower():
                        state_spec = state
                        break
            
            # Build state-specific prompt
            base_prompt = self.prompt_builder.build_figma_aware_prompt(
                framework=framework,
                style_mode=style_mode,
                figma_spec=figma_spec
            )
            
            state_prompt = self.prompt_builder.build_state_specific_prompt(
                base_prompt=base_prompt,
                state_name=state_name,
                state_spec=state_spec
            )
            
            # Generate state variation
            state_output = self.llm.invoke(state_prompt)
            state_parsed = self._parse_figma_aware_output(state_output, framework, style_mode)
            
            state_variations[state_name] = state_parsed
        
        # Combine results
        result = {
            "base_component": base_result,
            "state_variations": state_variations,
            "metadata": base_result.get("metadata", {}),
            "total_states": len(target_states) + 1  # +1 for default
        }
        
        print(f"✅ Generated {figma_spec.name} with {len(state_variations)} state variations")
        return result
    
    def generate_responsive_component(
        self,
        figma_spec: ComponentSpec,
        framework: str = "React",
        style_mode: StyleMode = StyleMode.CSS_MODULE,
        breakpoints: Optional[Dict[str, Dict[str, Any]]] = None
    ) -> Dict[str, str]:
        """
        Generate responsive component based on Figma specifications
        
        Args:
            figma_spec: Component specification from Figma
            framework: Target framework
            style_mode: Styling approach
            breakpoints: Responsive breakpoints
            
        Returns:
            Generated responsive component
        """
        print(f"📱 Generating responsive {figma_spec.name}")
        
        # Default breakpoints if not provided
        if not breakpoints:
            breakpoints = {
                "mobile": {"max_width": "768px", "adjustments": "Stack vertically, larger touch targets"},
                "tablet": {"max_width": "1024px", "adjustments": "Adjust spacing and layout"},
                "desktop": {"max_width": "none", "adjustments": "Full layout"}
            }
        
        # Build base prompt
        base_prompt = self.prompt_builder.build_figma_aware_prompt(
            framework=framework,
            style_mode=style_mode,
            figma_spec=figma_spec
        )
        
        # Build responsive prompt
        responsive_prompt = self.prompt_builder.build_responsive_prompt(
            base_prompt=base_prompt,
            breakpoints=breakpoints
        )
        
        # Generate responsive component
        raw_output = self.llm.invoke(responsive_prompt)
        parsed = self._parse_figma_aware_output(raw_output, framework, style_mode)
        
        # Add responsive metadata
        parsed["metadata"] = parsed.get("metadata", {})
        parsed["metadata"]["responsive"] = True
        parsed["metadata"]["breakpoints"] = breakpoints
        
        print(f"✅ Generated responsive {figma_spec.name}")
        return parsed
    
    def _retrieve_documentation(self, figma_spec: ComponentSpec) -> str:
        """Retrieve relevant documentation for the component"""
        try:
            # Search for component documentation
            docs = self.retriever.search(
                query=f"{figma_spec.name} component design system",
                component=figma_spec.name,
                top_k=5
            )
            
            if docs:
                # Combine documentation snippets
                doc_content = []
                for doc in docs[:3]:  # Top 3 most relevant
                    doc_content.append(doc.page_content)
                
                return "\n\n".join(doc_content)
            
        except Exception as e:
            print(f"⚠️ Error retrieving documentation: {e}")
        
        return ""
    
    def _parse_figma_aware_output(
        self,
        text: str,
        framework: str,
        style_mode: StyleMode
    ) -> Dict[str, str]:
        """
        Parse structured output from LLM with Figma awareness
        """

        def extract(tag: str):
            pattern = rf"=== {tag} ===(.*?)(?===|\Z)"
            match = re.search(pattern, text, re.DOTALL)
            return match.group(1).strip() if match else ""

        # React parsing
        if framework.lower() == "react":

            if style_mode == StyleMode.CSS_MODULE:
                return {
                    "component": extract("COMPONENT"),
                    "css": extract("CSS"),
                    "framework": "react",
                    "style_mode": "css-module"
                }

            elif style_mode == StyleMode.CSS_IN_JS:
                return {
                    "component": extract("COMPONENT"),
                    "css": "",
                    "framework": "react",
                    "style_mode": "css-in-js"
                }

            elif style_mode == StyleMode.BASE_UI_CSS:
                return {
                    "component": extract("COMPONENT"),
                    "css": extract("CSS"),
                    "framework": "react",
                    "style_mode": "base-ui-css"
                }

        # Angular parsing
        elif framework.lower() == "angular":

            return {
                "component_ts": extract("COMPONENT_TS"),
                "component_html": extract("COMPONENT_HTML"),
                "component_scss": extract("COMPONENT_SCSS"),
                "framework": "angular",
                "style_mode": "angular-scss"
            }

        # Fallback
        return {"raw": text, "framework": framework.lower()}
    
    def _validate_against_figma(
        self,
        generated: Dict[str, str],
        figma_spec: ComponentSpec
    ) -> Dict[str, Any]:
        """
        Validate generated code against Figma specifications.
        Includes Synapse/Base UI checks when style_mode is BASE_UI_CSS.
        """

        validation = {
            "score": 0,
            "checks": {},
            "issues": [],
            "warnings": []
        }

        # Combine all generated code for validation
        all_code = ""
        for key, value in generated.items():
            if key != "metadata" and isinstance(value, str):
                all_code += value + "\n"

        # Check for measurements
        if figma_spec.width and figma_spec.height:
            if f"{figma_spec.width}" in all_code or f"{figma_spec.height}" in all_code:
                validation["checks"]["measurements"] = True
                validation["score"] += 20
            else:
                validation["issues"].append("Figma dimensions not found in generated code")

        # Check for font specifications
        if figma_spec.font_family:
            if figma_spec.font_family.lower() in all_code.lower():
                validation["checks"]["font_family"] = True
                validation["score"] += 15
            else:
                validation["issues"].append("Font family from Figma not found")

        # Check for design tokens usage
        if figma_spec.design_tokens:
            token_count = 0
            for token in figma_spec.design_tokens:
                if token['name'].lower() in all_code.lower():
                    token_count += 1

            if token_count > 0:
                validation["checks"]["tokens"] = True
                validation["score"] += min(25, (token_count / len(figma_spec.design_tokens)) * 25)
            else:
                validation["issues"].append("No design tokens from Figma found")

        # Check for states implementation
        if figma_spec.states:
            state_count = 0
            for state in figma_spec.states:
                if state['name'].lower() in all_code.lower():
                    state_count += 1

            if state_count > 0:
                validation["checks"]["states"] = True
                validation["score"] += min(20, (state_count / len(figma_spec.states)) * 20)
            else:
                validation["warnings"].append("Component states from Figma not implemented")

        # Check for anatomy structure
        if figma_spec.anatomy:
            anatomy_count = 0
            for part in figma_spec.anatomy:
                if part['name'].lower() in all_code.lower():
                    anatomy_count += 1

            if anatomy_count > 0:
                validation["checks"]["anatomy"] = True
                validation["score"] += min(20, (anatomy_count / len(figma_spec.anatomy)) * 20)
            else:
                validation["warnings"].append("Component anatomy from Figma not fully implemented")

        # Synapse / Base UI validation (bonus checks when applicable)
        style_mode_str = generated.get("style_mode", "")
        if style_mode_str == "base-ui-css":
            from validation.baseui_validator import BaseUIValidator
            baseui_result = BaseUIValidator().validate(all_code)
            validation["checks"]["base_ui_compliance"] = baseui_result.get("score", 0) >= 80
            validation["issues"].extend(baseui_result.get("issues", []))
            validation["warnings"].extend(baseui_result.get("warnings", []))

        # Validate score
        validation["score"] = min(100, validation["score"])

        return validation
    
    def batch_generate(
        self,
        figma_specs: List[ComponentSpec],
        framework: str = "React",
        style_mode: StyleMode = StyleMode.CSS_MODULE
    ) -> List[Dict[str, Any]]:
        """
        Generate multiple components in batch
        
        Args:
            figma_specs: List of component specifications
            framework: Target framework
            style_mode: Styling approach
            
        Returns:
            List of generation results
        """
        print(f"🚀 Starting batch generation for {len(figma_specs)} components")
        
        results = []
        
        for i, spec in enumerate(figma_specs):
            try:
                print(f"🔄 [{i+1}/{len(figma_specs)}] Generating {spec.name}")
                
                result = self.generate_with_figma_specs(
                    figma_spec=spec,
                    framework=framework,
                    style_mode=style_mode
                )
                
                results.append({
                    "component": spec.name,
                    "success": True,
                    "result": result
                })
                
                print(f"✅ Generated {spec.name}")
                
            except Exception as e:
                print(f"❌ Failed to generate {spec.name}: {e}")
                results.append({
                    "component": spec.name,
                    "success": False,
                    "error": str(e)
                })
        
        success_count = sum(1 for r in results if r["success"])
        print(f"🎉 Batch generation completed: {success_count}/{len(figma_specs)} successful")
        
        return results


# Utility functions
def create_figma_generator(model: str = "llama3") -> FigmaAwareGenerator:
    """Create a Figma-aware generator instance"""
    return FigmaAwareGenerator(model)


def validate_generation_quality(
    generated: Dict[str, Any],
    figma_spec: ComponentSpec
) -> bool:
    """
    Validate if generation meets quality standards
    
    Args:
        generated: Generated component
        figma_spec: Original Figma specification
        
    Returns:
        True if quality standards are met
    """
    validation = generated.get("metadata", {}).get("validation", {})
    score = validation.get("score", 0)
    
    # Require at least 80% score
    return score >= 80


def extract_component_metrics(generated: Dict[str, Any]) -> Dict[str, Any]:
    """
    Extract metrics from generated component
    
    Args:
        generated: Generated component
        
    Returns:
        Component metrics
    """
    metrics = {
        "lines_of_code": 0,
        "has_typescript": False,
        "has_css_modules": False,
        "has_styled_components": False,
        "accessibility_features": []
    }
    
    # Combine all code
    all_code = ""
    for key, value in generated.items():
        if key != "metadata" and isinstance(value, str):
            all_code += value + "\n"
            metrics["lines_of_code"] += len(value.split('\n'))
    
    # Check for TypeScript
    metrics["has_typescript"] = "interface " in all_code or "type " in all_code
    
    # Check for styling approach
    metrics["has_css_modules"] = "styles." in all_code or "CSS Module" in all_code
    metrics["has_styled_components"] = "styled." in all_code or "styled-components" in all_code
    
    # Check for accessibility features
    accessibility_keywords = ["aria-", "role=", "tabindex", "alt=", "for="]
    for keyword in accessibility_keywords:
        if keyword in all_code:
            metrics["accessibility_features"].append(keyword)
    
    return metrics
