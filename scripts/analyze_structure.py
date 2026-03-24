import sys
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).parent.parent))

from analysis.structure_analyzer import StructureAnalyzer

if __name__ == "__main__":

    analyzer = StructureAnalyzer()

    result = analyzer.analyze("content")

    for section, count in sorted(result.items()):

        print(section, count)