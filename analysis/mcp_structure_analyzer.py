"""
Structure analyzer using GitHub MCP server
"""

import subprocess
import json
import sys
from pathlib import Path
from collections import defaultdict
from typing import List, Dict, Any

# Add project root to path
sys.path.append(str(Path(__file__).parent.parent))

class MCPStructureAnalyzer:
    """Analyze repository structure using GitHub MCP server"""

    def __init__(self):
        self.process = None
        self.request_id = 1

    def _start_mcp_server(self):
        """Start the GitHub MCP server"""
        cmd = [
            "docker", "run", "--rm", "-i",
            "-v", "/etc/ssl/certs:/etc/ssl/certs:ro",
            "-e", "GITHUB_PERSONAL_ACCESS_TOKEN=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",
            "-e", "GITHUB_HOST=https://eos2git.cec.lab.emc.com",
            "ghcr.io/github/github-mcp-server"
        ]
        
        self.process = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=0
        )
        
        # Initialize the server
        init_request = {
            "jsonrpc": "2.0",
            "id": self.request_id,
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "capabilities": {"tools": {}},
                "clientInfo": {"name": "structure-analyzer", "version": "1.0.0"}
            }
        }
        
        self._send_request(init_request)
        response = self._read_response()
        
        if response.get('result'):
            print("✅ MCP Server initialized successfully")
        else:
            raise Exception(f"Failed to initialize MCP server: {response}")

    def _send_request(self, request: Dict[str, Any]):
        """Send a request to the MCP server"""
        if self.process:
            self.process.stdin.write(json.dumps(request) + "\n")
            self.process.stdin.flush()
            self.request_id += 1

    def _read_response(self) -> Dict[str, Any]:
        """Read a response from the MCP server"""
        if self.process:
            response_line = self.process.stdout.readline()
            if response_line:
                return json.loads(response_line.strip())
        return {}

    def _get_tools(self) -> List[Dict[str, Any]]:
        """Get available tools from MCP server"""
        tools_request = {
            "jsonrpc": "2.0",
            "id": self.request_id,
            "method": "tools/list",
            "params": {}
        }
        
        self._send_request(tools_request)
        response = self._read_response()
        return response.get('result', {}).get('tools', [])

    def _call_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """Call a tool on the MCP server"""
        tool_request = {
            "jsonrpc": "2.0",
            "id": self.request_id,
            "method": "tools/call",
            "params": {
                "name": tool_name,
                "arguments": arguments
            }
        }
        
        self._send_request(tool_request)
        response = self._read_response()
        return response

    def _list_directory_contents(self, path: str) -> List[Dict[str, Any]]:
        """List contents of a directory using MCP"""
        # Try different tools that might list directory contents
        tools = self._get_tools()
        
        # Look for tools that can list repository contents
        content_tools = []
        for tool in tools:
            name = tool.get('name', '').lower()
            if any(keyword in name for keyword in ['content', 'file', 'directory', 'tree', 'list']):
                content_tools.append(tool)
        
        if not content_tools:
            # Fallback to common GitHub tools
            content_tools = [t for t in tools if 'get' in t.get('name', '').lower()]
        
        for tool in content_tools:
            try:
                result = self._call_tool(tool['name'], {
                    "repository": "data-manager/ids-content",
                    "path": path
                })
                
                if 'result' in result:
                    content = result['result'].get('content', [])
                    if isinstance(content, list):
                        return content
            except Exception as e:
                continue
        
        return []

    def _get_file_content(self, file_path: str) -> str:
        """Get content of a specific file"""
        tools = self._get_tools()
        
        # Look for tools that can get file content
        file_tools = []
        for tool in tools:
            name = tool.get('name', '').lower()
            if any(keyword in name for keyword in ['file', 'content', 'get', 'read']):
                file_tools.append(tool)
        
        for tool in file_tools:
            try:
                result = self._call_tool(tool['name'], {
                    "repository": "data-manager/ids-content",
                    "path": file_path
                })
                
                if 'result' in result:
                    content = result['result'].get('content', '')
                    if isinstance(content, str):
                        return content
            except Exception as e:
                continue
        
        return ""

    def analyze(self, repo_path: str) -> Dict[str, int]:
        """Analyze repository structure and count sections"""
        try:
            self._start_mcp_server()
            
            sections = defaultdict(int)
            mdx_files = []
            
            # Recursively find all .mdx files
            def find_mdx_files(path: str):
                contents = self._list_directory_contents(path)
                
                for item in contents:
                    if isinstance(item, dict):
                        name = item.get('name', '')
                        item_path = item.get('path', f"{path}/{name}" if path else name)
                        item_type = item.get('type', '').lower()
                        
                        if item_type == 'dir' or name.endswith('/'):
                            # Recursively explore subdirectory
                            find_mdx_files(item_path)
                        elif name.endswith('.mdx'):
                            mdx_files.append(item)
            
            find_mdx_files(repo_path)
            print(f"Found {len(mdx_files)} .mdx files using MCP")
            
            # Analyze each .mdx file
            for i, file_info in enumerate(mdx_files):
                if i % 10 == 0:
                    print(f"Processing file {i+1}/{len(mdx_files)}: {file_info.get('name', 'unknown')}")
                
                file_path = file_info.get('path', '')
                if file_path:
                    content = self._get_file_content(file_path)
                    
                    # Simple section extraction (basic H2/H3 parsing)
                    import re
                    h2_matches = re.findall(r'^##\s+(.+)$', content, re.MULTILINE)
                    h3_matches = re.findall(r'^###\s+(.+)$', content, re.MULTILINE)
                    
                    all_sections = h2_matches + h3_matches
                    for section in all_sections:
                        section_clean = section.strip()
                        if section_clean:
                            sections[section_clean] += 1
            
            return dict(sections)
            
        except Exception as e:
            print(f"❌ Error during analysis: {e}")
            return {}
        finally:
            if self.process:
                try:
                    self.process.terminate()
                    self.process.wait(timeout=5)
                except:
                    self.process.kill()

if __name__ == "__main__":
    analyzer = MCPStructureAnalyzer()
    result = analyzer.analyze("content")
    
    print(f"\n📊 Analysis Results:")
    print(f"Total sections found: {len(result)}")
    print("\nSections by frequency:")
    for section, count in sorted(result.items(), key=lambda x: x[1], reverse=True):
        print(f"  {section}: {count}")
