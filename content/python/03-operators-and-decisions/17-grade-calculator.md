---
type: problem
title: "Grade calculator"
difficulty: easy
complexity:
  time: "Instant"
  space: "Tiny"
approach: "Guard invalid inputs first, then grade top-down with elif"
tags: [decisions, elif, edge-cases, practice]
related:
  [
    python.operators-and-decisions.elif-many-choices,
    python.operators-and-decisions.comparing-values,
  ]
---

## Problem

Ask for a test score from `0` to `100` and show the grade (`A`: `90–100`, `B`: `80–89`, `C`: `70–79`, `D`: `60–69`, `F`: `0–59`). For any score below `0` or above `100`, print `Invalid score`.

```text
Score: 82
Grade: B
```

```text
Score: 105
Invalid score
```

## Hint

- Check `score < 0 or score > 100` (a **guard clause**) **first** so invalid inputs like `-5` or `120` never match a grade.
- Test exact **boundary values** mentally: what should `90`, `80`, `60`, `0`, and `100` print?
- Use `>=` from `90` down to `60` in an `if / elif / else` chain.

## Solution

```python
score = int(input("Score: "))

if score < 0 or score > 100:
    print("Invalid score")
elif score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
elif score >= 60:
    print("Grade: D")
else:
    print("Grade: F")
```

## Walkthrough

Putting `score < 0 or score > 100` first catches edge cases like `-1` and `101` before any grade branch is checked. Otherwise `105` would match `score >= 90` and wrongly receive an `"A"`!

Look at boundary values (`60`, `70`, `80`, `90`, `100`): because we use `>=` (greater than or equal), exact cutoffs stay inside the higher band (`90` -> `A`, `89` -> `B`). And valid low scores (`0` to `59`) reach `else` and print `Grade: F`.
