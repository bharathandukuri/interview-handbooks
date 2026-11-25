---
type: pitfall
title: "Why 0.1 + 0.2 != 0.3 (IEEE 754 floats & round() edge cases)"
difficulty: easy
mostAsked: true
tags: [float, gotchas, numbers, precision]
related: [python.variables-and-types.numbers-int-and-float]
revision:
  - "Floats use binary base-2 fractions (**IEEE 754**), where `0.1` repeats endlessly — making `0.1 + 0.2 == 0.30000000000000004`"
  - "Check tolerances (`math.isclose`) or format cleanly with `round()` — use **`decimal.Decimal`** or integer **cents** for money!"
  - "Remember Python's `round()` uses **round-half-to-even (banker's rounding)**: `round(2.5)` gives `2`, while `round(3.5)` gives `4`!"
---

## The trap

```python
print(0.1 + 0.2)
print(0.1 + 0.2 == 0.3)
# Outputs: 0.30000000000000004  then  False!!
```

## The fix

```python
from decimal import Decimal
import math

print("Display rounded:", round(0.1 + 0.2, 2))
print("Safe tolerance check (Ch 11):", math.isclose(0.1 + 0.2, 0.3))

# For finance/exact base-10 decimals, pass STRINGS to Decimal (or track integer cents!):
print("Exact Decimal:", Decimal("0.1") + Decimal("0.2") == Decimal("0.3"))
print("Banker's rounding edge case:", round(2.5), round(3.5))
```

## Why it happens

1. **Binary fractions cannot store `0.1` cleanly:** Just as `1/3` cannot be written cleanly in base 10 (`0.333333...`), numbers like `0.1` and `0.2` are infinite repeating fractions in base 2 (**IEEE 754 floating-point**). When rounded to 53 binary bits and added back, `0.1 + 0.2` lands tiny hair above `0.3` (`0.30000000000000004`), making exact `== 0.3` return `False`. This happens identically in JavaScript, Java, C++, and Go!
2. **Watch `round()`'s two surprises:**
   - Python uses **banker's rounding (round half to nearest EVEN digit)** to prevent upward statistical bias: `round(2.5)` rounds to **`2`**, while `round(3.5)` rounds to **`4`**!
   - Never pass a bare float to `Decimal(0.1)` — `0.1` is _already_ inaccurate before `Decimal` sees it; always wrap strings **`Decimal("0.1")`** or count money in exact integer **cents**!
