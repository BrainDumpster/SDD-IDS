from bs4 import BeautifulSoup


def parse_markdown(html):

    soup = BeautifulSoup(html, "html.parser")

    sections = []

    current_section = None
    subsection = None

    for tag in soup.find_all(["h2", "h3", "p", "ul", "ol"]):

        if tag.name == "h2":
            current_section = tag.get_text().strip()
            subsection = None

        elif tag.name == "h3":
            subsection = tag.get_text().strip()

        elif tag.name in ["p", "ul", "ol"]:

            text = tag.get_text().strip()

            if text:
                sections.append(
                    {
                        "section": current_section,
                        "subsection": subsection,
                        "content": text,
                    }
                )

    return sections


def parse_mdx(html):
    """Legacy alias."""
    return parse_markdown(html)

