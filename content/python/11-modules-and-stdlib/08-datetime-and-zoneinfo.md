---
type: concept
title: "Dates, times, timedelta arithmetic, and time zones (zoneinfo)"
difficulty: medium
mostAsked: true
tags: [datetime, timezones, stdlib]
related: [python.modules-and-stdlib.days-until-date-problem]
revision:
  - "Subtracting two `date` or `datetime` objects returns a **`timedelta`** (`.days`, `.total_seconds()`)"
  - "Prefer ISO 8601 (`.isoformat()` / `.fromisoformat()`) over custom format strings when exchanging dates"
  - "Always store **timezone-aware** UTC (`datetime.now(timezone.utc)`) and convert at display time using **`zoneinfo.ZoneInfo`** — never use deprecated `datetime.utcnow()`"
---

Working with dates and times involves four main classes inside `datetime`, plus timezone rules in **`zoneinfo`** (built into the standard library since Python 3.9):

```python
from datetime import date, datetime, timedelta, timezone
from zoneinfo import ZoneInfo

# 1. Dates and exact timedelta arithmetic
today = date(2026, 11, 25)
deadline = date.fromisoformat("2026-12-05")
print("days left:", (deadline - today).days)
print("one week later:", today + timedelta(weeks=1))

# 2. Timezone-aware UTC and conversion with ZoneInfo
utc_now = datetime(2026, 11, 25, 12, 30, tzinfo=timezone.utc)
ny_time = utc_now.astimezone(ZoneInfo("America/New_York"))
ist_time = utc_now.astimezone(ZoneInfo("Asia/Kolkata"))
print("UTC:", utc_now.strftime("%Y-%m-%d %H:%M %Z"))
print("NY: ", ny_time.strftime("%Y-%m-%d %H:%M %Z"))
print("IST:", ist_time.strftime("%Y-%m-%d %H:%M %Z"))
```

The screen shows:

```text
days left: 10
one week later: 2026-12-02
UTC: 2026-11-25 12:30 UTC
NY:  2026-11-25 07:30 EST
IST: 2026-11-25 18:00 IST
```

**Critical edge cases and formatting helpers:**

- **`.strftime()` vs `.strptime()` vs `.fromisoformat()`:**
  - `dt.strftime("%Y-%m-%d")` **f**ormats a `datetime` -> `str`.
  - `datetime.strptime(text, "%Y-%m-%d")` **p**arses a `str` -> `datetime`.
  - `date.fromisoformat("2026-11-25")` / `datetime.fromisoformat(...)` parses standard ISO 8601 strings much faster (and Python 3.11+ handles `"Z"` UTC suffixes like `"2026-11-25T12:30:00Z"` automatically!).
- **Naive vs aware `datetime` trap:** A **naive** `datetime` has `tzinfo=None`; an **aware** `datetime` knows its UTC offset. Subtracting or comparing a naive `datetime` with an aware one raises **`TypeError: can't compare offset-naive and offset-aware datetimes`**. Always replace deprecated `datetime.utcnow()` (which returned naive UTC!) with **`datetime.now(timezone.utc)`**. (Note on Windows: install `tzdata` if a minimal environment lacks OS timezone rules.)
- **Months vary (`timedelta` intentionally stops at `weeks`):** You cannot pass `months=1` to `timedelta` because months have 28–31 days; calculate calendar months explicitly or use a calendar helper cleanly.
