---
type: problem
title: "Safe integer parser"
difficulty: easy
complexity:
  time: "O(k) where k is string length"
  space: "O(k) or O(1)"
approach: "Guard booleans/floats cleanly, then try int(value.strip()) inside try/except ValueError"
tags: [errors, try-except, validation, practice]
related: [python.errors-and-files.try-except-else-finally]
---

## Problem

Write a function `parse_int(value, default=None)` that converts valid integer strings (including whitespace like `"  -42  "` or `"+7"`) or actual `int` values into an `int`, and returns `default` cleanly for anything else **without crashing**.

Watch out for subtle edge cases:

- `"3.14"` or `3.14` (not an exact integer -> return `default`)
- `True` / `False` (**careful:** `isinstance(True, int)` is `True` and `int(True)` is `1` in Python!)
- `None`, `""`, `"abc"`, `[]`

```text
parse_int("  -42 ") -> -42
parse_int(7)        -> 7
parse_int("12.5")   -> None
parse_int(True)     -> None
parse_int("abc", 0) -> 0
```

## Hint

- Check `isinstance(value, bool)` **first** because `bool` is a subclass of `int` in Python!
- If `isinstance(value, int)`, return `value` directly.
- If `isinstance(value, str)`, try `int(value.strip())` inside `try ... except ValueError:`. Notice `int("3.14")` automatically raises `ValueError`!
- Everything else (floats like `3.14`, `None`, lists) returns `default`.

## Solution

```python
def parse_int(value, default=None):
    if isinstance(value, bool):
        return default
    if isinstance(value, int):
        return value
    if not isinstance(value, str):
        return default
    try:
        return int(value.strip())
    except ValueError:
        return default

samples = ["  -42 ", 7, "+15", "12.5", 3.0, True, False, None, "", "abc"]
for item in samples:
    print(f"{item!r:>8} -> {parse_int(item)}")
print("fallback ->", parse_int("bad", default=0))
```

## Walkthrough

Notice three subtle details that make this solution production-safe:

1. **Why check `isinstance(value, bool)` first?** Because `bool` inherits from `int`, `isinstance(True, int)` is `True` and `int(True)` is `1`. Without that guard, `parse_int(True)` would silently return `1`!
2. **Why guard `not isinstance(value, str)` instead of calling `int(value)` directly?** Because calling `int(3.9)` **truncates** floats silently to `3` instead of raising an error! Checking type first guarantees `3.0` and `3.9` are not silently treated as exact integers.
3. **Note on underscores:** In Python, `int("1_000")` is valid and returns `1000`. If underscores should be forbidden in user input, also check `if "_" in value: return default`.
