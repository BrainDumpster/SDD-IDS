from ingestion.github_loader import GithubLoader
from ingestion.markdown_parser import parse_markdown

from knowledge.knowledge_builder import KnowledgeBuilder
from knowledge.component_registry import ComponentRegistry


class KnowledgePipeline:

    def run(self, repo_path):

        loader = GithubLoader()

        builder = KnowledgeBuilder()

        registry = ComponentRegistry()

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
        print(f"Processing {len(all_doc_files)} .md/.mdx files")

        for f in all_doc_files:

            html = loader.fetch_file(f["download_url"])

            sections = parse_markdown(html)

            component = f["name"].rsplit(".", 1)[0]

            obj = builder.build_component(component, sections)

            registry.add(obj)

        registry.save()