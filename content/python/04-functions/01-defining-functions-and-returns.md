---
type: concept
title: "Defining functions, docstrings, and returns"
difficulty: easy
tags: [functions, syntax, basics]
---

Functions package reusable logic with `def`. A function without an explicit `return` (or with a bare `return`) implicitly returns `None`.

```python
def greet(name: str, excited: bool = False) -> str:
    """Return a formatted greeting for `name`."""
    suffix = "!" if excited else "."
    return f"Hello, {name}{suffix}"

print(greet("Ada"))                 # Hello, Ada.
print(greet("Ada", excited=True))   # Hello, Ada!
```

**Good function habits:**

- **Early return (guard clauses):** Handle edge cases first and `return` early instead of nesting deep `if/else` blocks.
- **Returning multiple values:** `return min_val, max_val` packs a tuple automatically so callers can unpack: `lo, hi = bounds(nums)`.
- **Pure vs mutating:** Prefer returning a new value over silently mutating an argument list/dict unless mutation is the function's explicit contract (like `list.sort()`).
