import networkx as nx


class PatternGraph:

    def __init__(self):

        self.graph = nx.DiGraph()

    def add_component(self, component):

        comp = component["component"]

        self.graph.add_node(comp, type="component")

        for element in component["structure"]:

            self.graph.add_node(element, type="element")

            self.graph.add_edge(comp, element, relation="contains")

        for token in component["tokens"]:

            self.graph.add_node(token, type="token")

            self.graph.add_edge(comp, token, relation="uses")