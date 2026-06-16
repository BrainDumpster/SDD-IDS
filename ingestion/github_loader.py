import base64
import binascii
import ssl
import warnings
from typing import Optional
from urllib.parse import quote

import requests
from urllib3.util.ssl_ import create_urllib3_context
from config.settings import settings

# Suppress SSL warnings for corporate/internal servers
urllib3_exceptions = warnings.filterwarnings('ignore', category=requests.packages.urllib3.exceptions.InsecureRequestWarning)

class GithubLoader:

    def __init__(self):
        self.headers = {
            "Authorization": f"token {settings.github_token}"
        }
        
        # Create a custom SSL context for self-signed certificates
        self.ssl_context = create_urllib3_context()
        self.ssl_context.check_hostname = False
        self.ssl_context.verify_mode = ssl.CERT_NONE
        
        # Set the SSL context for requests
        self.session = requests.Session()
        adapter = requests.adapters.HTTPAdapter()
        self.session.mount('https://', adapter)

    def _contents_params(self) -> dict:
        if getattr(settings, "github_ref", None):
            return {"ref": settings.github_ref}
        return {}

    def list_files(self, path):
        """List files recursively in the GitHub repository"""
        try:
            url = f"{settings.github_host}/api/v3/repos/{settings.github_repo}/contents/{path}"
            params = self._contents_params()

            print(f"Fetching files from: {url}" + (f" ref={params.get('ref')}" if params else ""))

            r = self.session.get(url, headers=self.headers, params=params, verify=False)
            
            if r.status_code == 200:
                items = r.json()
                all_files = []
                
                for item in items:
                    if item['type'] == 'file' and item['name'].endswith('.md'):
                        all_files.append(item)
                    elif item['type'] == 'dir':
                        # Recursively fetch files from subdirectory
                        sub_files = self.list_files(f"{path}/{item['name']}" if path else item['name'])
                        all_files.extend(sub_files)
                
                print(f"Found {len(all_files)} MDX files")
                return all_files
            else:
                print(f"Error fetching files: {r.status_code} - {r.text}")
                return []
                
        except Exception as e:
            print(f"Error listing files: {e}")
            return []

    def fetch_file(self, download_url):
        """Fetch file content from GitHub"""
        try:
            print(f"Fetching file from: {download_url}")
            r = self.session.get(download_url, headers=self.headers, verify=False)
            
            if r.status_code == 200:
                return r.text
            else:
                print(f"Error fetching file: {r.status_code} - {r.text}")
                return ""
                
        except Exception as e:
            print(f"Error fetching file: {e}")
            return ""

    def fetch_repo_path(self, repo_relative_path: str) -> Optional[bytes]:
        """Fetch a binary/text file from the repo (SVG, PNG, etc.) via Contents API."""
        repo_relative_path = repo_relative_path.strip().lstrip("/")
        if not repo_relative_path:
            return None
        encoded = "/".join(quote(seg, safe="") for seg in repo_relative_path.split("/"))
        url = f"{settings.github_host}/api/v3/repos/{settings.github_repo}/contents/{encoded}"
        try:
            r = self.session.get(
                url, headers=self.headers, params=self._contents_params(), verify=False
            )
            if r.status_code != 200:
                print(f"fetch_repo_path {repo_relative_path}: {r.status_code}")
                return None
            data = r.json()
            if not isinstance(data, dict) or data.get("type") != "file":
                return None
            raw = data.get("content", "")
            if data.get("encoding") == "base64" and raw:
                try:
                    return base64.b64decode(raw.replace("\n", ""))
                except (binascii.Error, ValueError) as e:
                    print(f"Base64 decode error for {repo_relative_path}: {e}")
                    return None
            return None
        except Exception as e:
            print(f"Error fetch_repo_path {repo_relative_path}: {e}")
            return None

    def list_mdx_under_prefix(self, path_prefix: str) -> list:
        """MDX files under a repo path (recursive)."""
        path_prefix = path_prefix.strip().strip("/")
        return self.list_files(path_prefix if path_prefix else "")