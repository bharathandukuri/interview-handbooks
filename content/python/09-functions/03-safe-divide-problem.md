---
type: problem
title: "Safe division function"
difficulty: easy
complexity:
  time: "Instant (O(1))"
  space: "Tiny (O(1))"
approach: "Guard divisor == 0 early and return default fallback"
tags: [functions, edge-cases, practice]
related: [python.functions.return-early-and-multiple-values]
---

## Problem

Write a function `safe_divide(a, b, default=None)` that returns `a / b`, **or** returns `default` if dividing by `0` (whether `0` or `0.0`). Handle integer `0`, float `0.0`, and custom fallbacks cleanly.

```text
safe_divide(10, 2)             -> 5.0
safe_divide(10, 0)             -> None
safe_divide(10, 0.0, default=0)-> 0
```

## Hint

- Check `if b == 0:` right at the top of the function (**guard clause**) — remember `0 == 0.0` is `True`!
- Otherwise return `a / b`.

## Solution

```python
def safe_divide(a, b, default=None):
    if b == 0:
        return default
    return a / b

print(safe_divide(10, 2))
print(safe_divide(10, 0))
print(safe_divide(10, 0.0, default=0))
```

## Walkthrough

Checking `if b == 0:` catches both integer `0` and float `0.0` before `a / b` ever runs, preventing `ZeroDivisionError`.

Notice **not** to write `if not b:` if you plan to expand later without reading carefully — actually `not b` works for `0`, `0.0`, and `False`, **but** if someone accidentally passes `None` as `b`, `if not b:` would return `default` instead of surfacing the `TypeError` bug! Explicit `if b == 0:` is cleaner and safer.
