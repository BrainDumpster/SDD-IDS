import json

from rules.rule_extractor import RuleExtractor
from rules.rule_registry import RuleRegistry

from rules.rule_normalizer import RuleNormalizer
from rules.rule_confidence import RuleConfidence
from rules.rule_deduplicator import RuleDeduplicator
from rules.rule_filter import RuleFilter


class RulePipeline:

    def run(self):

        with open("component_registry.json") as f:

            components = json.load(f)

        extractor = RuleExtractor()

        normalizer = RuleNormalizer()

        scorer = RuleConfidence()

        dedup = RuleDeduplicator()

        filter_rules = RuleFilter()

        registry = RuleRegistry()

        all_rules = []

        for component in components.values():

            rules = extractor.extract_rules(component)

            for r in rules:

                r.normalized = normalizer.normalize(r.description)

                r.confidence = scorer.score(r)

            all_rules.extend(rules)

        unique_rules = dedup.deduplicate(all_rules)

        filtered_rules = filter_rules.filter(unique_rules)

        registry.add_rules(filtered_rules)

        registry.save()