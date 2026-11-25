---
type: predict
title: "Mixing arithmetic, comparisons, not, and, and or"
difficulty: medium
mostAsked: true
tags: [operators, precedence, booleans, predict]
related:
  [
    python.operators-and-decisions.operator-precedence,
    python.operators-and-decisions.and-or-not,
  ]
revision:
  - "Arithmetic finishes before comparisons (`>`, `==`), which finish before `not`, `and`, `or`"
  - "Chained checks like `1 < x < 10 == True` expand into `(1 < x) and (x < 10) and (10 == True)`"
options:
  - "True, then True"
  - "True, then False"
  - "False, then True"
  - "False, then False"
answer: 1
---

Apply Python's complete precedence rules tier by tier and predict the output.

```python
x = 5
y = 10

print(x + 2 * 3 > y and not x == 5 or y // x == 2)
print(1 < x < 10 == True)
```

## Output

```text
True
False
```

## Explanation

1. **Line 1 (`x + 2 * 3 > y and not x == 5 or y // x == 2`):**
   - **Arithmetic first (`*`, `//`, `+`):** `2 * 3` -> `6`; `5 + 6` -> `11`; `10 // 5` -> `2`. Expression is now `11 > 10 and not 5 == 5 or 2 == 2`.
   - **Comparisons next (`>`, `==`):** `True and not True or True`.
   - **`not` next:** `True and False or True`.
   - **`and` before `or`:** `(True and False) or True` -> `False or True` -> **`True`**.
2. **Line 2 (`1 < x < 10 == True`):** Chained comparisons expand into `(1 < 5) and (5 < 10) and (10 == True)`. Because `10 == True` (`10 == 1`) is `False`, the whole expression evaluates to **`False`**.
