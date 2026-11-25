---
type: problem
title: "Safe Tip & Split Calculator"
difficulty: easy
complexity:
  time: "O(1)"
  space: "O(1)"
approach: "Decimal arithmetic + guarded division"
tags: [basics, decimal, problem]
---

## Problem

Write `split_bill(total_str, tip_percent, people)` that parses a string bill amount (e.g. `"42.50"`), adds `tip_percent`, divides evenly across `people`, and returns a string formatted to 2 decimal places. Raise `ValueError` if `people <= 0` or `total < 0`.

```
Input:  total_str="100.00", tip_percent=15, people=4
Output: "28.75"
```

## Hint

- Avoid binary `float` rounding drift on currency by using `decimal.Decimal`.
- Validate `people <= 0` before dividing.

## Solution

```python
from decimal import Decimal, ROUND_HALF_UP

def split_bill(total_str: str, tip_percent: int, people: int) -> str:
    total = Decimal(total_str)
    if total < 0 or people <= 0:
        raise ValueError("Total must be >= 0 and people > 0")
    multiplier = Decimal(1) + Decimal(tip_percent) / Decimal(100)
    per_person = (total * multiplier) / Decimal(people)
    rounded = per_person.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    return f"{rounded:.2f}"
```

## Walkthrough

Converting `total_str` directly into `Decimal` avoids float precision artifacts like `0.1 + 0.2`. Guarding `people <= 0` prevents `ZeroDivisionError` and gives callers a clear `ValueError`. Finally, `.quantize(Decimal("0.01"))` ensures standard currency rounding.
