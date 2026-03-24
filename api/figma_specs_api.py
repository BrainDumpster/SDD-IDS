"""
Figma Specification API
API endpoints for Figma specification generation and management
"""

import asyncio
import json
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field

from tokens.figma_spec_extractor import FigmaSpecExtractor, ComponentSpec
from scripts.enhanced_figma_specs_pipeline import EnhancedSpecPipeline


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Pydantic Models
class ComponentMapping(BaseModel):
    component: str = Field(..., description="Component name")
    figma_url: str = Field(..., description="Figma design URL")
    node_id: str = Field(..., description="Figma node ID")
    category: str = Field(default="Unknown", description="Component category")


class SpecGenerationRequest(BaseModel):
    component: str = Field(..., description="Component name")
    figma_url: str = Field(..., description="Figma design URL")
    node_id: str = Field(..., description="Figma node ID")
    category: str = Field(default="Unknown", description="Component category")
    save_to_file: bool = Field(default=True, description="Save spec to file")
    index_in_vectorstore: bool = Field(default=True, description="Index in vector store")


class BatchSpecRequest(BaseModel):
    components: List[ComponentMapping] = Field(..., description="List of component mappings")
    batch_size: int = Field(default=10, description="Batch size for processing")
    skip_existing: bool = Field(default=True, description="Skip existing specifications")


class SpecResponse(BaseModel):
    success: bool
    component: str
    message: str
    spec_data: Optional[Dict[str, Any]] = None
    file_path: Optional[str] = None
    generated_at: str


class BatchSpecResponse(BaseModel):
    success: bool
    total_components: int
    processed: int
    failed: int
    results: List[Dict[str, Any]]
    generated_at: str


# FastAPI App
app = FastAPI(
    title="Figma Specification API",
    description="API for generating and managing Figma component specifications",
    version="1.0.0"
)

# Initialize services
extractor = FigmaSpecExtractor()
pipeline = EnhancedSpecPipeline()


# Background task storage
background_tasks = {}


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Figma Specification API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "generate": "/figma/specs/generate",
            "batch": "/figma/specs/batch",
            "get": "/figma/specs/{component}",
            "list": "/figma/specs/",
            "sync": "/figma/specs/sync-all",
            "status": "/figma/specs/status/{task_id}"
        }
    }


@app.post("/figma/specs/generate", response_model=SpecResponse)
async def generate_specification(request: SpecGenerationRequest):
    """
    Generate specification for a single component
    
    Args:
        request: Specification generation request
        
    Returns:
        Generated specification
    """
    logger.info(f"🎨 Generating spec for {request.component}")
    
    try:
        # Extract specification
        spec = await extractor.extract_component_spec(
            component_name=request.component,
            figma_url=request.figma_url,
            node_id=request.node_id,
            category=request.category
        )
        
        # Convert to dictionary
        spec_dict = {
            "name": spec.name,
            "category": spec.category,
            "figma_url": spec.figma_url,
            "node_id": spec.node_id,
            "width": spec.width,
            "height": spec.height,
            "padding": spec.padding,
            "border_radius": spec.border_radius,
            "font_family": spec.font_family,
            "font_size": spec.font_size,
            "font_weight": spec.font_weight,
            "line_height": spec.line_height,
            "background_color": spec.background_color,
            "text_color": spec.text_color,
            "border_color": spec.border_color,
            "states": spec.states,
            "anatomy": spec.anatomy,
            "design_tokens": spec.design_tokens,
            "usage_guidelines": spec.usage_guidelines
        }
        
        file_path = None
        
        # Save to file if requested
        if request.save_to_file:
            output_dir = Path("/home/muthu/projects/ids_design_knowledge/design-system-knowledge")
            output_dir.mkdir(exist_ok=True)
            
            mdx_content = extractor.spec_to_mdx(spec)
            filename = f"{spec.name.lower().replace(' ', '-').replace('/', '-')}-spec.mdx"
            file_path = str(output_dir / filename)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(mdx_content)
            
            logger.info(f"💾 Saved spec to {file_path}")
        
        # Index in vector store if requested
        if request.index_in_vectorstore:
            # TODO: Implement vector store indexing
            logger.info("🔍 Vector store indexing not yet implemented")
        
        return SpecResponse(
            success=True,
            component=request.component,
            message="Specification generated successfully",
            spec_data=spec_dict,
            file_path=file_path,
            generated_at=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"❌ Error generating spec for {request.component}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/figma/specs/batch", response_model=BatchSpecResponse)
async def generate_batch_specifications(
    request: BatchSpecRequest,
    background_tasks: BackgroundTasks
):
    """
    Generate specifications for multiple components
    
    Args:
        request: Batch specification request
        background_tasks: FastAPI background tasks
        
    Returns:
        Batch generation results
    """
    logger.info(f"🚀 Starting batch generation for {len(request.components)} components")
    
    # Generate task ID
    task_id = f"batch_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    # Start background task
    background_tasks.add_task(
        run_batch_generation,
        task_id,
        request.components,
        request.batch_size,
        request.skip_existing
    )
    
    # Initialize task status
    background_tasks[task_id] = {
        "status": "started",
        "progress": 0,
        "total": len(request.components),
        "started_at": datetime.now().isoformat()
    }
    
    return BatchSpecResponse(
        success=True,
        total_components=len(request.components),
        processed=0,
        failed=0,
        results=[],
        generated_at=datetime.now().isoformat()
    )


@app.get("/figma/specs/{component_name}")
async def get_specification(component_name: str):
    """
    Get specification for a specific component
    
    Args:
        component_name: Name of the component
        
    Returns:
        Component specification
    """
    logger.info(f"📋 Retrieving spec for {component_name}")
    
    try:
        # Look for existing spec file
        output_dir = Path("/home/muthu/projects/ids_design_knowledge/design-system-knowledge")
        filename = f"{component_name.lower().replace(' ', '-').replace('/', '-')}-spec.mdx"
        file_path = output_dir / filename
        
        if not file_path.exists():
            raise HTTPException(status_code=404, detail=f"Specification not found for {component_name}")
        
        # Read and parse MDX file
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract metadata from frontmatter
        metadata = {}
        if content.startswith('---'):
            try:
                end_metadata = content.find('---', 3)
                if end_metadata != -1:
                    metadata_str = content[3:end_metadata].strip()
                    metadata = json.loads(metadata_str) if metadata_str else {}
                    content = content[end_metadata + 3:].strip()
            except:
                pass
        
        return {
            "component": component_name,
            "metadata": metadata,
            "content": content,
            "file_path": str(file_path),
            "last_modified": datetime.fromtimestamp(file_path.stat().st_mtime).isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error retrieving spec for {component_name}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/figma/specs/")
async def list_specifications():
    """
    List all available specifications
    
    Returns:
        List of available specifications
    """
    logger.info("📋 Listing all specifications")
    
    try:
        output_dir = Path("/home/muthu/projects/ids_design_knowledge/design-system-knowledge")
        
        if not output_dir.exists():
            return {"specifications": []}
        
        specs = []
        for file in output_dir.glob("*-spec.mdx"):
            component_name = file.stem.replace("-spec", "").replace("-", " ").title()
            
            # Extract metadata if available
            metadata = {}
            try:
                with open(file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if content.startswith('---'):
                        end_metadata = content.find('---', 3)
                        if end_metadata != -1:
                            metadata_str = content[3:end_metadata].strip()
                            metadata = json.loads(metadata_str) if metadata_str else {}
            except:
                pass
            
            specs.append({
                "component": component_name,
                "file_name": file.name,
                "file_path": str(file),
                "metadata": metadata,
                "last_modified": datetime.fromtimestamp(file.stat().st_mtime).isoformat()
            })
        
        return {"specifications": sorted(specs, key=lambda x: x["component"])}
        
    except Exception as e:
        logger.error(f"❌ Error listing specifications: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/figma/specs/sync-all")
async def sync_all_specifications(background_tasks: BackgroundTasks):
    """
    Synchronize all specifications with latest Figma designs
    
    Args:
        background_tasks: FastAPI background tasks
        
    Returns:
        Sync operation details
    """
    logger.info("🔄 Starting full specification sync")
    
    # Generate task ID
    task_id = f"sync_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    # Start background task
    background_tasks.add_task(run_full_sync, task_id)
    
    # Initialize task status
    background_tasks[task_id] = {
        "status": "started",
        "progress": 0,
        "total": 0,  # Will be updated when task starts
        "started_at": datetime.now().isoformat()
    }
    
    return {
        "task_id": task_id,
        "message": "Full synchronization started",
        "status_url": f"/figma/specs/status/{task_id}"
    }


@app.get("/figma/specs/status/{task_id}")
async def get_task_status(task_id: str):
    """
    Get status of background task
    
    Args:
        task_id: Task identifier
        
    Returns:
        Task status
    """
    if task_id not in background_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return background_tasks[task_id]


@app.delete("/figma/specs/{component_name}")
async def delete_specification(component_name: str):
    """
    Delete specification for a specific component
    
    Args:
        component_name: Name of the component
        
    Returns:
        Deletion result
    """
    logger.info(f"🗑️ Deleting spec for {component_name}")
    
    try:
        output_dir = Path("/home/muthu/projects/ids_design_knowledge/design-system-knowledge")
        filename = f"{component_name.lower().replace(' ', '-').replace('/', '-')}-spec.mdx"
        file_path = output_dir / filename
        
        if not file_path.exists():
            raise HTTPException(status_code=404, detail=f"Specification not found for {component_name}")
        
        file_path.unlink()
        
        return {
            "success": True,
            "component": component_name,
            "message": "Specification deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error deleting spec for {component_name}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/figma/specs/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "Figma Specification API",
        "version": "1.0.0"
    }


# Background task functions
async def run_batch_generation(
    task_id: str,
    components: List[ComponentMapping],
    batch_size: int,
    skip_existing: bool
):
    """Run batch generation in background"""
    try:
        # Update task status
        background_tasks[task_id]["status"] = "running"
        background_tasks[task_id]["total"] = len(components)
        
        # Convert to component mappings format
        mappings = [
            {
                "component": comp.component,
                "figmaUrl": comp.figma_url,
                "nodeId": comp.node_id,
                "category": comp.category
            }
            for comp in components
        ]
        
        # Run pipeline
        results = await pipeline.run_pipeline(
            batch_size=batch_size,
            skip_existing=skip_existing
        )
        
        # Update final status
        background_tasks[task_id].update({
            "status": "completed",
            "progress": len(components),
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


async def run_full_sync(task_id: str):
    """Run full synchronization in background"""
    try:
        # Update task status
        background_tasks[task_id]["status"] = "running"
        
        # Run sync
        results = await pipeline.sync_all_specs()
        
        # Update final status
        background_tasks[task_id].update({
            "status": "completed",
            "progress": results["total_components"],
            "total": results["total_components"],
            "results": results,
            "completed_at": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"❌ Full sync failed: {e}")
        background_tasks[task_id].update({
            "status": "failed",
            "error": str(e),
            "completed_at": datetime.now().isoformat()
        })


# Cleanup old tasks
def cleanup_old_tasks():
    """Remove tasks older than 24 hours"""
    current_time = datetime.now()
    tasks_to_remove = []
    
    for task_id, task in background_tasks.items():
        if "started_at" in task:
            start_time = datetime.fromisoformat(task["started_at"])
            if (current_time - start_time).hours > 24:
                tasks_to_remove.append(task_id)
    
    for task_id in tasks_to_remove:
        del background_tasks[task_id]
    
    logger.info(f"🧹 Cleaned up {len(tasks_to_remove)} old tasks")


# Run cleanup periodically
import threading
import time

def periodic_cleanup():
    """Run cleanup every hour"""
    while True:
        time.sleep(3600)  # 1 hour
        cleanup_old_tasks()

cleanup_thread = threading.Thread(target=periodic_cleanup, daemon=True)
cleanup_thread.start()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
