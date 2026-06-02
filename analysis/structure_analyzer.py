from collections import defaultdict
from ingestion.github_loader import GithubLoader
from ingestion.markdown_parser import parse_markdown


class StructureAnalyzer:

    def analyze(self, repo_path):

        loader = GithubLoader()

        sections = defaultdict(int)

        # Recursively get all .md/.mdx files
        def get_doc_files(path):
            files = loader.list_files(path)
            doc_files = []
            
            for f in files:
                if f.get("type") == "dir":
                    # Recursively explore subdirectories
                    doc_files.extend(get_doc_files(f["path"]))
                elif f.get("name", "").endswith(".md") or f.get("name", "").endswith(".mdx"):
                    doc_files.append(f)
            
            return doc_files

        all_doc_files = get_doc_files(repo_path)
        print(f"Found {len(all_doc_files)} .md/.mdx files")

        for f in all_doc_files:

            html = loader.fetch_file(f["download_url"])

            parsed = parse_markdown(html)

            for s in parsed:

                section = (s["section"] or "unknown").strip()

                sections[section] += 1

        return sections