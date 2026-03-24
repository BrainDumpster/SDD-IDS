import sys
import os
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).parent.parent))

import uvicorn

if __name__ == "__main__":

    uvicorn.run(
        "api.rag_api:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )