def normalize_section(section):

    if not section:
        return "unknown"

    section = section.lower().strip()

    section = section.replace("’","'")
    section = section.replace("’","'")

    return section