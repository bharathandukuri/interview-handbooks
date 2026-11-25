---
type: concept
title: "Logical operators: and, or, not and short-circuiting"
difficulty: easy
mostAsked: true
tags: [booleans, logic, operators, short-circuit]
related:
  [
    python.variables-and-types.booleans,
    python.operators-and-decisions.operator-precedence,
  ]
revision:
  - "The **logical operators** `and`, `or`, and `not` combine or flip conditions (`not` -> `and` -> `or`)"
  - "**Short-circuit evaluation:** Python stops evaluating as soon as the final answer is already guaranteed"
  - "Put cheap or safety checks (like `b != 0`) on the **left** of `and` so the right side safely skips invalid math"
---

Python combines multiple checks using the three **logical operators** (**boolean operators**): `and`, `or`, and `not`.

| Expression | Meaning             | True when                            |
| ---------- | ------------------- | ------------------------------------ |
| `A and B`  | Both checks pass    | Both `A` and `B` are truthy          |
| `A or B`   | Either check passes | At least one of `A` or `B` is truthy |
| `not A`    | Flips the check     | `A` is falsy                         |

```python
age = 22
has_id = True
print(age >= 18 and has_id)     # True
print(age < 12 or age >= 65)    # False
print(not has_id)               # False

# Short-circuit safety check:
a, b = 10, 0
if b != 0 and a / b > 2:        # `b != 0` is False, so Python NEVER runs `a / b`!
    print("More than double")
```

The screen shows:

```text
True
False
False
```

**How short-circuit evaluation works (and why it protects your code):**

- In `A and B`: if `A` is `False`, `A and B` can never be `True`, so Python **skips `B` completely**. Putting `b != 0` on the left stops `10 / 0` (`ZeroDivisionError`) from ever running!
- In `A or B`: if `A` is `True`, `A or B` is already guaranteed `True`, so Python **skips `B` completely**.
- **Order of precedence:** `not` binds tightest, then `and`, then `or`. Always add brackets like `(is_admin or is_owner) and is_active` when mixing `and` with `or`.
