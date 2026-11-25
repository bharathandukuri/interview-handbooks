---
type: predict
title: "Short-circuit values and avoiding errors"
difficulty: hard
mostAsked: true
tags: [operators, truthiness, short-circuit, predict]
related:
  [
    python.operators-and-decisions.and-or-not,
    python.operators-and-decisions.truthy-and-falsy,
  ]
revision:
  - "`and` and `or` return the **last evaluated operand**, not always `True` or `False`"
  - "`and` binds tighter than `or`, and short-circuiting skips the right operand when already decided"
options:
  - "True, then False, then ZeroDivisionError"
  - "8, then bye, then ZeroDivisionError"
  - "8, then bye, then 10"
  - "5, then hi, then 10"
answer: 2
---

Trace both operator precedence (`and` before `or`) and short-circuiting carefully. Does line 3 raise an error?

```python
print(0 or 5 and 8)
print("hi" and "" or "bye")
print(10 or 5 // 0)
```

## Output

```text
8
bye
10
```

## Explanation

1. **Line 1 (`0 or 5 and 8`):** `and` runs **before** `or`, so Python groups this as `0 or (5 and 8)`. Since `5` is truthy, `5 and 8` must check the second side and returns **`8`**. Then `0 or 8` skips falsy `0` and returns **`8`**.
2. **Line 2 (`"hi" and "" or "bye"`):** Grouped as `("hi" and "") or "bye"`. `"hi"` is truthy so `and` moves to `""`, which is falsy — so `"hi" and ""` returns `""`. Next `"" or "bye"` skips falsy `""` and returns **`"bye"`**.
3. **Line 3 (`10 or 5 // 0`):** Because `10` is already truthy, `or` **short-circuits** immediately and returns **`10`** without ever running `5 // 0` — so **no `ZeroDivisionError` happens**!
