---
type: problem
title: "Chapter challenge: Days until a target date (with Feb 29 leap-year edge cases)"
difficulty: medium
complexity:
  time: "O(1)"
  space: "O(1)"
approach: "Parse ISO dates cleanly with date.fromisoformat, inject `today` for determinism, and handle leap-year Feb 29 explicitly"
tags: [datetime, edge-cases, stdlib, practice]
related: [python.modules-and-stdlib.datetime-and-zoneinfo]
---

## Problem

1. Write `days_until(target_iso, today=None)` that parses an ISO date `"YYYY-MM-DD"` and returns the signed number of days from `today` until `target_iso` (positive = upcoming, `0` = today, negative = already passed). Allow injecting `today` (defaulting to `date.today()`) so unit tests are deterministic, and fail cleanly with `ValueError` on invalid dates like `"2026-02-30"`.
2. Also write `next_annual_event(month, day, today=None)` that finds how many days remain until the next occurrence of an annual date `(month, day)` — handling **Feb 29** leap-year birthdays gracefully (either advancing to the next leap year or picking March 1/Feb 28 explicitly). Let us handle Feb 29 by finding the **next real Feb 29**!

```text
days_until("2026-12-01", today=date(2026, 11, 25)) -> 6
next_annual_event(2, 29, today=date(2025, 3, 1))   -> 1095  # waits for 2028-02-29!
```

## Hint

- `date.fromisoformat(target_iso)` rejects malformed dates (`"2026-02-30"` raises `ValueError` automatically!).
- Accepting `today=None` (defaulting `if today is None: today = date.today()`) follows the same safe non-mutable-default rule from Chapter 09 (calling `date.today()` _inside_ the function avoids freezing yesterday's date in a long-running server!).
- For `next_annual_event(2, 29, ...)`, building `date(year, 2, 29)` raises `ValueError` in non-leap years — wrap it or advance `year += 1` until `date(year, month, day)` succeeds and is `>= today`!

## Solution

```python
from datetime import date

def days_until(target_iso, today=None):
    if today is None:
        today = date.today()
    target = date.fromisoformat(target_iso)    # validates YYYY-MM-DD & real calendar dates
    return (target - today).days

def next_annual_event(month, day, today=None):
    if today is None:
        today = date.today()
    year = today.year
    while True:
        try:
            candidate = date(year, month, day)
        except ValueError:
            # Feb 29 in a non-leap year: skip forward (guard impossible inputs too)
            if not (month == 2 and day == 29):
                raise
            year += 1
            continue
        if candidate >= today:
            return (candidate - today).days
        year += 1

ref = date(2026, 11, 25)
print("until Dec 1:", days_until("2026-12-01", today=ref))
print("same day:   ", days_until("2026-11-25", today=ref))
print("past date:  ", days_until("2026-11-20", today=ref))
print("next Feb 29 (from 2025-03-01):", next_annual_event(2, 29, today=date(2025, 3, 1)))
print("next Dec 25 (from 2026-12-26):", next_annual_event(12, 25, today=date(2026, 12, 26)))
```

## Walkthrough

Notice why injecting **`today=None`** instead of **`today=date.today()`** in the function signature is an important real-world practice:

1. Remember Chapter 09: default arguments are evaluated **once** when `def` executes! A web server started on Monday would otherwise freeze `today = Monday` forever until restarted!
2. Injecting `today` makes your function completely testable — tests can check Dec 31 -> Jan 1 rollovers and Feb 29 leap-year rules (`2028` is a leap year; `1900` is not; `2000` is) without waiting years for the system clock!
3. Also notice why `if not (month == 2 and day == 29): raise` inside `except ValueError:` prevents an infinite loop if someone passes invalid `(month=13, day=1)` or `(month=4, day=31)`.
