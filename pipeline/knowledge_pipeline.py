from ingestion.github_loader import GithubLoader
from ingestion.mdx_parser import parse_mdx

from knowledge.knowledge_builder import KnowledgeBuilder
from knowledge.component_registry import ComponentRegistry


class KnowledgePipeline:

    def run(self, repo_path):

        loader = GithubLoader()

        builder = KnowledgeBuilder()

        registry = ComponentRegistry()

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
        print(f"Processing {len(all_mdx_files)} .mdx files")

        for f in all_mdx_files:

            html = loader.fetch_file(f["download_url"])

            sections = parse_mdx(html)

            component = f["name"].replace(".mdx", "")

            obj = builder.build_component(component, sections)

            registry.add(obj)

        registry.save()