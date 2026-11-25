---
type: problem
title: "Chapter challenge: leap year"
difficulty: medium
complexity:
  time: "Instant"
  space: "Tiny"
approach: "Combine % checks with and / or and guard non-positive years"
tags: [operators, logic, edge-cases, practice]
related:
  [
    python.operators-and-decisions.and-or-not,
    python.operators-and-decisions.even-or-odd,
  ]
---

## Problem

Ask the user for a positive year and print `Leap year` or `Not a leap year`. If the year is `0` or negative, print `Invalid year`.

A year is a leap year if:

- It divides evenly by `4`, **except** century years divisible by `100` (like `1900`),
- **Unless** it also divides evenly by `400` (like `2000`).

```text
Year: 2024
Leap year
```

```text
Year: 1900
Not a leap year
```

## Hint

- Handle the edge case `year <= 0` first.
- A year passes if `(year % 400 == 0)` **or** `(year % 4 == 0 and year % 100 != 0)`.

## Solution

```python
year = int(input("Year: "))

if year <= 0:
    print("Invalid year")
elif (year % 400 == 0) or (year % 4 == 0 and year % 100 != 0):
    print("Leap year")
else:
    print("Not a leap year")
```

## Walkthrough

Trace the important edge cases:

- `0` or `-400`: caught right at the top (`Invalid year`).
- `2000`: `2000 % 400 == 0` is `True` -> `Leap year`.
- `1900`: `1900 % 400 == 0` is `False`; on the right side, `1900 % 4 == 0` is `True`, **but** `1900 % 100 != 0` is `False` -> `Not a leap year`.
- `2024`: `2024 % 4 == 0` is `True` and `2024 % 100 != 0` is `True` -> `Leap year`.
- `2023`: `2023 % 4 == 0` is `False` -> `Not a leap year`.
