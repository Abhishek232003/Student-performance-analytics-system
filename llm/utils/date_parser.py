import dateparser


def normalize_date(date_text):
    """
    Convert natural language date into YYYY-MM-DD format
    """

    if not date_text:
        return None

    parsed = dateparser.parse(date_text)

    if parsed:
        return parsed.strftime("%Y-%m-%d")

    return None