import dateparser
from datetime import datetime

def normalize_date(date_text):

    if not date_text:
        return None

    today = datetime.today()

    parsed = dateparser.parse(
        date_text,
        settings={
            "PREFER_DATES_FROM": "future",
            "RELATIVE_BASE": today,   # ✅ anchor to current date
        }
    )

    if not parsed:
        return None

    # -------------------------
    # 🔥 FORCE CURRENT YEAR LOGIC
    # -------------------------
    # If user DID NOT explicitly mention a year
    if not any(str(year) in date_text for year in range(1900, 2100)):

        parsed = parsed.replace(year=today.year)

        # if date already passed → move to next year
        if parsed.date() < today.date():
            parsed = parsed.replace(year=today.year + 1)

    return parsed.strftime("%Y-%m-%d")