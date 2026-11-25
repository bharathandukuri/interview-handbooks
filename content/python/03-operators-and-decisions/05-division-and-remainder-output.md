---
type: predict
title: "Division, remainder and powers"
difficulty: easy
tags: [operators, maths, predict]
related: [python.operators-and-decisions.maths-operators]
revision:
  - "`/` always gives a `float`; `//` floors down toward negative infinity; `%` keeps divisor's sign"
options:
  - "4.5, 4, 1, -4, 1"
  - "4.5, 4, 1, -3, -1"
  - "4, 4, 1, -4, -1"
  - "4.5, 5, 1, -3, 1"
answer: 0
---

Read the code carefully — notice lines 4 and 5 use a negative number `-7`! Guess what the screen shows.

```python
print(9 / 2)
print(9 // 2)
print(9 % 2)
print(-7 // 2)
print(-7 % 2)
```

## Output

```text
4.5
4
1
-4
1
```

## Explanation

- **`9 / 2`:** True division keeps decimals, giving `4.5`.
- **`9 // 2`:** `4.5` rounded down is `4`.
- **`9 % 2`:** `2` fits `4` times (`8`), leaving remainder `1`.
- **`-7 // 2`:** `-3.5` rounded **down toward negative infinity** is **`-4`**, NOT `-3`!
- **`-7 % 2`:** Python keeps `(-4 * 2) + r == -7`, so the remainder `r` is **`1`** (matching the positive divisor `2`), NOT `-1`.
