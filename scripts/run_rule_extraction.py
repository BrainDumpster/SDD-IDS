import sys
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).parent.parent))

from pipeline.rule_pipeline import RulePipeline


if __name__ == "__main__":

    pipeline = RulePipeline()

    pipeline.run()

    print("Rule extraction completed.")