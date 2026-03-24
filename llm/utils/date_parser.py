import dateparser
from datetime import datetime

def normalize_date(date_text):

    if not date_text:
        return None

    parsed = dateparser.parse(
        date_text,
        settings={
            "PREFER_DATES_FROM": "future"   # 🔥 THIS FIXES EVERYTHING
        }
    )

    if parsed:
        return parsed.strftime("%Y-%m-%d")

    return None