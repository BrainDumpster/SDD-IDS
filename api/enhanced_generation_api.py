"""
Enhanced Component Generation API
API endpoints for Figma-aware component generation
"""

import asyncio
import json
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field

from generation.figma_aware_generator import FigmaAwareGenerator, validate_generation_quality
from generation.style_modes import StyleMode
from tokens.figma_spec_extractor import ComponentSpec, FigmaSpecExtractor


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Pydantic Models
class ComponentGenerationRequest(BaseModel):
    component: str = Field(..., description="Component name")
    figma_url: str = Field(..., description="Figma design URL")
    node_id: str = Field(..., description="Figma node ID")
    category: str = Field(default="Unknown", description="Component category")
    framework: str = Field(default="React", description="Target framework (React, Angular)")
    style_mode: str = Field(default="css-module", description="Styling approach")
    additional_requirements: str = Field(default="", description="Additional requirements")
    include_documentation: bool = Field(default=True, description="Include documentation from RAG")
    generate_states: bool = Field(default=True, description="Generate state variations")
    responsive: bool = Field(default=True, description="Generate responsive design")


class BatchGenerationRequest(BaseModel):
    components: List[Dict[str, str]] = Field(..., description="List of component specifications")
    framework: str = Field(default="React", description="Target framework")
    style_mode: str = Field(default="css-module", description="Styling approach")
    batch_size: int = Field(default=5, description="Batch size for processing")


class GenerationResponse(BaseModel):
    success: bool
    component: str
    framework: str
    style_mode: str
    message: str
    generated_code: Optional[Dict[str, str]] = None
    metadata: Optional[Dict[str, Any]] = None
    file_paths: Optional[Dict[str, str]] = None
    validation_score: Optional[int] = None
    generated_at: str


class BatchGenerationResponse(BaseModel):
    success: bool
    total_components: int
    processed: int
    failed: int
    results: List[Dict[str, Any]]
    generated_at: str


# FastAPI App
app = FastAPI(
    title="Enhanced Component Generation API",
    description="API for Figma-aware component generation",
    version="1.0.0"
)

# Initialize services
generator = FigmaAwareGenerator()
extractor = FigmaSpecExtractor()

# Background task storage
background_tasks = {}


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Enhanced Component Generation API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "generate": "/design/generate/figma-aware",
            "batch": "/design/generate/batch",
            "states": "/design/generate/with-states",
            "responsive": "/design/generate/responsive",
            "status": "/design/generate/status/{task_id}",
            "validate": "/design/generate/validate"
        }
    }


@app.post("/design/generate/figma-aware", response_model=GenerationResponse)
async def generate_figma_aware_component(request: ComponentGenerationRequest):
    """
    Generate component using Figma specifications and RAG knowledge
    
    Args:
        request: Component generation request
        
    Returns:
        Generated component with validation
    """
    logger.info(f"🎨 Generating {request.component} for {request.framework}")
    
    try:
        # Extract Figma specification
        figma_spec = await extractor.extract_component_spec(
            component_name=request.component,
            figma_url=request.figma_url,
            node_id=request.node_id,
            category=request.category
        )
        
        # Parse style mode
        style_mode = StyleMode.CSS_MODULE
        if request.style_mode.lower() == "css-in-js":
            style_mode = StyleMode.CSS_IN_JS
        elif request.style_mode.lower() == "angular-scss":
            style_mode = StyleMode.ANGULAR_SCSS
        
        # Generate component
        result = generator.generate_with_figma_specs(
            figma_spec=figma_spec,
            framework=request.framework,
            style_mode=style_mode,
            additional_query=request.additional_requirements,
            include_documentation=request.include_documentation
        )
        
        # Save generated files
        file_paths = await save_generated_files(result, request.component, request.framework)
        
        # Extract validation score
        validation_score = result.get("metadata", {}).get("validation", {}).get("score", 0)
        
        return GenerationResponse(
            success=True,
            component=request.component,
            framework=request.framework,
            style_mode=request.style_mode,
            message="Component generated successfully",
            generated_code=result,
            metadata=result.get("metadata"),
            file_paths=file_paths,
            validation_score=validation_score,
            generated_at=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"❌ Error generating {request.component}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/design/generate/with-states", response_model=GenerationResponse)
async def generate_with_state_variations(request: ComponentGenerationRequest):
    """
    Generate component with all state variations
    
    Args:
        request: Component generation request
        
    Returns:
        Generated component with state variations
    """
    logger.info(f"🔄 Generating {request.component} with state variations")
    
    try:
        # Extract Figma specification
        figma_spec = await extractor.extract_component_spec(
            component_name=request.component,
            figma_url=request.figma_url,
            node_id=request.node_id,
            category=request.category
        )
        
        # Parse style mode
        style_mode = StyleMode.CSS_MODULE
        if request.style_mode.lower() == "css-in-js":
            style_mode = StyleMode.CSS_IN_JS
        elif request.style_mode.lower() == "angular-scss":
            style_mode = StyleMode.ANGULAR_SCSS
        
        # Generate with states
        result = generator.generate_with_state_variations(
            figma_spec=figma_spec,
            framework=request.framework,
            style_mode=style_mode
        )
        
        # Save generated files
        file_paths = await save_state_files(result, request.component, request.framework)
        
        # Extract validation score from base component
        base_validation = result.get("base_component", {}).get("metadata", {}).get("validation", {})
        validation_score = base_validation.get("score", 0)
        
        return GenerationResponse(
            success=True,
            component=request.component,
            framework=request.framework,
            style_mode=request.style_mode,
            message="Component with state variations generated successfully",
            generated_code=result,
            metadata=result.get("metadata"),
            file_paths=file_paths,
            validation_score=validation_score,
            generated_at=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"❌ Error generating {request.component} with states: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/design/generate/responsive", response_model=GenerationResponse)
async def generate_responsive_component(request: ComponentGenerationRequest):
    """
    Generate responsive component
    
    Args:
        request: Component generation request
        
    Returns:
        Generated responsive component
    """
    logger.info(f"📱 Generating responsive {request.component}")
    
    try:
        # Extract Figma specification
        figma_spec = await extractor.extract_component_spec(
            component_name=request.component,
            figma_url=request.figma_url,
            node_id=request.node_id,
            category=request.category
        )
        
        # Parse style mode
        style_mode = StyleMode.CSS_MODULE
        if request.style_mode.lower() == "css-in-js":
            style_mode = StyleMode.CSS_IN_JS
        elif request.style_mode.lower() == "angular-scss":
            style_mode = StyleMode.ANGULAR_SCSS
        
        # Generate responsive component
        result = generator.generate_responsive_component(
            figma_spec=figma_spec,
            framework=request.framework,
            style_mode=style_mode
        )
        
        # Save generated files
        file_paths = await save_generated_files(result, request.component, request.framework)
        
        # Extract validation score
        validation_score = result.get("metadata", {}).get("validation", {}).get("score", 0)
        
        return GenerationResponse(
            success=True,
            component=request.component,
            framework=request.framework,
            style_mode=request.style_mode,
            message="Responsive component generated successfully",
            generated_code=result,
            metadata=result.get("metadata"),
            file_paths=file_paths,
            validation_score=validation_score,
            generated_at=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"❌ Error generating responsive {request.component}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/design/generate/batch", response_model=BatchGenerationResponse)
async def generate_batch_components(
    request: BatchGenerationRequest,
    background_tasks: BackgroundTasks
):
    """
    Generate multiple components in batch
    
    Args:
        request: Batch generation request
        background_tasks: FastAPI background tasks
        
    Returns:
        Batch generation results
    """
    logger.info(f"🚀 Starting batch generation for {len(request.components)} components")
    
    # Generate task ID
    task_id = f"batch_gen_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    # Start background task
    background_tasks.add_task(
        run_batch_generation,
        task_id,
        request.components,
        request.framework,
        request.style_mode,
        request.batch_size
    )
    
    # Initialize task status
    background_tasks[task_id] = {
        "status": "started",
        "progress": 0,
        "total": len(request.components),
        "started_at": datetime.now().isoformat()
    }
    
    return BatchGenerationResponse(
        success=True,
        total_components=len(request.components),
        processed=0,
        failed=0,
        results=[],
        generated_at=datetime.now().isoformat()
    )


@app.post("/design/generate/validate")
async def validate_generation(request: Dict[str, Any]):
    """
    Validate generated component against Figma specifications
    
    Args:
        request: Validation request with generated code and figma specs
        
    Returns:
        Validation results
    """
    logger.info("🔍 Validating generated component")
    
    try:
        generated_code = request.get("generated_code", {})
        figma_spec_data = request.get("figma_spec", {})
        
        # Create ComponentSpec object
        figma_spec = ComponentSpec(
            name=figma_spec_data.get("name", "Unknown"),
            category=figma_spec_data.get("category", "Unknown"),
            figma_url=figma_spec_data.get("figma_url", ""),
            node_id=figma_spec_data.get("node_id", ""),
            width=figma_spec_data.get("width"),
            height=figma_spec_data.get("height"),
            padding=figma_spec_data.get("padding"),
            border_radius=figma_spec_data.get("border_radius"),
            font_family=figma_spec_data.get("font_family"),
            font_size=figma_spec_data.get("font_size"),
            font_weight=figma_spec_data.get("font_weight"),
            line_height=figma_spec_data.get("line_height"),
            background_color=figma_spec_data.get("background_color"),
            text_color=figma_spec_data.get("text_color"),
            border_color=figma_spec_data.get("border_color"),
            states=figma_spec_data.get("states", []),
            anatomy=figma_spec_data.get("anatomy", []),
            design_tokens=figma_spec_data.get("design_tokens", [])
        )
        
        # Validate
        is_valid = validate_generation_quality(generated_code, figma_spec)
        
        return {
            "valid": is_valid,
            "validation_details": generated_code.get("metadata", {}).get("validation", {}),
            "recommendations": get_improvement_recommendations(generated_code, figma_spec)
        }
        
    except Exception as e:
        logger.error(f"❌ Error validating component: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/design/generate/status/{task_id}")
async def get_generation_status(task_id: str):
    """
    Get status of background generation task
    
    Args:
        task_id: Task identifier
        
    Returns:
        Task status
    """
    if task_id not in background_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return background_tasks[task_id]


@app.get("/design/generate/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "Enhanced Component Generation API",
        "version": "1.0.0"
    }


# Utility functions
async def save_generated_files(
    result: Dict[str, Any],
    component_name: str,
    framework: str
) -> Dict[str, str]:
    """Save generated component files"""
    
    output_dir = Path("/home/muthu/projects/ids_design_knowledge/generated-components") / framework.lower()
    output_dir.mkdir(parents=True, exist_ok=True)
    
    file_paths = {}
    
    # React files
    if framework.lower() == "react":
        component_dir = output_dir / component_name.lower().replace(" ", "-")
        component_dir.mkdir(exist_ok=True)
        
        # Component file
        if "component" in result:
            component_file = component_dir / f"{component_name}.tsx"
            with open(component_file, 'w', encoding='utf-8') as f:
                f.write(result["component"])
            file_paths["component"] = str(component_file)
        
        # CSS file
        if "css" in result and result["css"]:
            css_file = component_dir / f"{component_name}.module.css"
            with open(css_file, 'w', encoding='utf-8') as f:
                f.write(result["css"])
            file_paths["css"] = str(css_file)
    
    # Angular files
    elif framework.lower() == "angular":
        component_dir = output_dir / component_name.lower().replace(" ", "-")
        component_dir.mkdir(exist_ok=True)
        
        # TypeScript file
        if "component_ts" in result:
            ts_file = component_dir / f"{component_name}.component.ts"
            with open(ts_file, 'w', encoding='utf-8') as f:
                f.write(result["component_ts"])
            file_paths["component_ts"] = str(ts_file)
        
        # HTML file
        if "component_html" in result:
            html_file = component_dir / f"{component_name}.component.html"
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(result["component_html"])
            file_paths["component_html"] = str(html_file)
        
        # SCSS file
        if "component_scss" in result:
            scss_file = component_dir / f"{component_name}.component.scss"
            with open(scss_file, 'w', encoding='utf-8') as f:
                f.write(result["component_scss"])
            file_paths["component_scss"] = str(scss_file)
    
    return file_paths


async def save_state_files(
    result: Dict[str, Any],
    component_name: str,
    framework: str
) -> Dict[str, str]:
    """Save component files with state variations"""
    
    output_dir = Path("/home/muthu/projects/ids_design_knowledge/generated-components") / framework.lower()
    output_dir.mkdir(parents=True, exist_ok=True)
    
    file_paths = {}
    
    # Save base component
    base_component = result.get("base_component", {})
    base_paths = await save_generated_files(base_component, component_name, framework)
    file_paths["base"] = base_paths
    
    # Save state variations
    state_variations = result.get("state_variations", {})
    for state_name, state_data in state_variations.items():
        state_paths = await save_generated_files(state_data, f"{component_name}_{state_name}", framework)
        file_paths[f"state_{state_name}"] = state_paths
    
    return file_paths


def get_improvement_recommendations(
    generated: Dict[str, Any],
    figma_spec: ComponentSpec
) -> List[str]:
    """Get improvement recommendations for generated code"""
    
    recommendations = []
    validation = generated.get("metadata", {}).get("validation", {})
    issues = validation.get("issues", [])
    warnings = validation.get("warnings", [])
    
    # Analyze issues
    for issue in issues:
        if "dimensions" in issue.lower():
            recommendations.append("Add exact Figma dimensions to component styles")
        elif "font" in issue.lower():
            recommendations.append("Include font specifications from Figma")
        elif "token" in issue.lower():
            recommendations.append("Use design tokens instead of hardcoded values")
        elif "state" in issue.lower():
            recommendations.append("Implement all required component states")
        elif "anatomy" in issue.lower():
            recommendations.append("Follow Figma anatomy structure more closely")
    
    # Analyze warnings
    for warning in warnings:
        if "accessibility" in warning.lower():
            recommendations.append("Add more accessibility features")
        elif "responsive" in warning.lower():
            recommendations.append("Improve responsive design implementation")
    
    # General recommendations
    if validation.get("score", 0) < 80:
        recommendations.append("Review Figma specifications more carefully")
    
    if not recommendations:
        recommendations.append("Component generation looks good!")
    
    return recommendations


# Background task functions
async def run_batch_generation(
    task_id: str,
    components: List[Dict[str, str]],
    framework: str,
    style_mode: str,
    batch_size: int
):
    """Run batch generation in background"""
    try:
        # Update task status
        background_tasks[task_id]["status"] = "running"
        background_tasks[task_id]["total"] = len(components)
        
        results = []
        processed = 0
        failed = 0
        
        # Parse style mode
        sm = StyleMode.CSS_MODULE
        if style_mode.lower() == "css-in-js":
            sm = StyleMode.CSS_IN_JS
        elif style_mode.lower() == "angular-scss":
            sm = StyleMode.ANGULAR_SCSS
        
        for i, comp in enumerate(components):
            try:
                # Extract Figma spec
                figma_spec = await extractor.extract_component_spec(
                    component_name=comp["component"],
                    figma_url=comp["figmaUrl"],
                    node_id=comp["nodeId"],
                    category=comp.get("category", "Unknown")
                )
                
                # Generate component
                result = generator.generate_with_figma_specs(
                    figma_spec=figma_spec,
                    framework=framework,
                    style_mode=sm
                )
                
                # Save files
                file_paths = await save_generated_files(result, comp["component"], framework)
                
                results.append({
                    "component": comp["component"],
                    "success": True,
                    "result": result,
                    "file_paths": file_paths
                })
                
                processed += 1
                
            except Exception as e:
                logger.error(f"❌ Failed to generate {comp['component']}: {e}")
                results.append({
                    "component": comp["component"],
                    "success": False,
                    "error": str(e)
                })
                failed += 1
            
            # Update progress
            background_tasks[task_id]["progress"] = i + 1
        
        # Update final status
        background_tasks[task_id].update({
            "status": "completed",
            "processed": processed,
            "failed": failed,
            "results": results,
            "completed_at": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"❌ Batch generation failed: {e}")
        background_tasks[task_id].update({
            "status": "failed",
            "error": str(e),
            "completed_at": datetime.now().isoformat()
        })


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
