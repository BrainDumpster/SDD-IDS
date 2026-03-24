from generation.component_context_compiler import ComponentContextCompiler
from generation.component_generator import ComponentGenerator
from generation.auto_repair_engine import AutoRepairEngine


class GenerationPipeline:

    def __init__(self):
        self.compiler = ComponentContextCompiler()
        self.generator = ComponentGenerator()
        self.repair_engine = AutoRepairEngine()

    def run(self, component: str, request: str):

        context = self.compiler.compile(component, request)

        code = self.generator.generate(context)

        final_component, report = self.repair_engine.repair(
            component, code["component_code"], self.generator
        )

        return {"component": final_component, "css": code["css_code"], "validation": report}
