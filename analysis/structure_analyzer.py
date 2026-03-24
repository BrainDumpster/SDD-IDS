from collections import defaultdict
from ingestion.github_loader import GithubLoader
from ingestion.mdx_parser import parse_mdx


class StructureAnalyzer:

    def analyze(self, repo_path):

        loader = GithubLoader()

        sections = defaultdict(int)

        # Recursively get all .mdx files
        def get_mdx_files(path):
            files = loader.list_files(path)
            mdx_files = []
            
            for f in files:
                if f.get("type") == "dir":
                    # Recursively explore subdirectories
                    mdx_files.extend(get_mdx_files(f["path"]))
                elif f.get("name", "").endswith(".mdx"):
                    mdx_files.append(f)
            
            return mdx_files

        all_mdx_files = get_mdx_files(repo_path)
        print(f"Found {len(all_mdx_files)} .mdx files")

        for f in all_mdx_files:

            html = loader.fetch_file(f["download_url"])

            parsed = parse_mdx(html)

            for s in parsed:

                section = (s["section"] or "unknown").strip()

                sections[section] += 1

        return sections