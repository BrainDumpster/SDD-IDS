from config.schema_mapping import SECTION_SCHEMA_MAP
from utils.section_normalizer import normalize_section


class SchemaBuilder:

    def map_section(self, section):

        normalized = normalize_section(section)
        if normalized not in SECTION_SCHEMA_MAP:
            print("Unknown section:", normalized)

        return SECTION_SCHEMA_MAP.get(normalized, "other")