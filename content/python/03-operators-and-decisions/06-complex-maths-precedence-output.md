---
type: predict
title: "Complex maths, precedence and associativity"
difficulty: medium
mostAsked: true
tags: [operators, precedence, associativity, predict]
related:
  [
    python.operators-and-decisions.operator-precedence,
    python.operators-and-decisions.operator-associativity,
  ]
revision:
  - "`*`, `/`, `//`, and `%` tie and run **left to right**"
  - "`**` runs **right to left** (`2 ** 3 ** 2 == 512`), and binds tighter than unary `-` on the left (`-3 ** 2 == -9`)"
options:
  - "14, 512, -9 9, 0.25"
  - "14, 64, 9 9, 0.25"
  - "20, 512, -9 9, 4.0"
  - "14, 512, -9 -9, 0.25"
answer: 0
---

Trace precedence and associativity on every single line before revealing the output.

```python
print(10 + 4 * 3 // 2 - 5 % 3)
print(2 ** 3 ** 2)
print(-3 ** 2, (-3) ** 2)
print(2 ** -2)
```

## Output

```text
14
512
-9 9
0.25
```

## Explanation

1. **Line 1 (`10 + 4 * 3 // 2 - 5 % 3`):**
   - Level 6 (`*`, `//`, `%`) beats `+` and `-`, running **left to right**:
     `4 * 3 = 12` -> `12 // 2 = 6` -> `5 % 3 = 2`.
   - Now Level 7 (`+`, `-`) runs **left to right**: `10 + 6 - 2` -> `16 - 2` -> **`14`**.
2. **Line 2 (`2 ** 3 ** 2`):** `**` is **right-associative**, so `3 ** 2` (`9`) runs first, then `2 ** 9` = **`512`**.
3. **Line 3 (`-3 ** 2, (-3) ** 2`):** Because `**` outranks unary `-`, `-3 ** 2` means `-(3 ** 2)` = **`-9`**. Parentheses in `(-3) ** 2` square `-3` to give **`9`**.
4. **Line 4 (`2 ** -2`):** Unary `-` applies to the right operand (`-2`), computing `1 / (2 ** 2)` = **`0.25`**.
