---
type: pitfall
title: "Shadowing built-ins (str = 'hi') and the bool('False') trap"
difficulty: easy
mostAsked: true
tags: [variables, naming, types, gotchas]
related:
  [
    python.variables-and-types.naming-variables,
    python.variables-and-types.converting-types,
  ]
revision:
  - "Never name variables `str`, `int`, `float`, `print`, or `type` — overwriting them breaks future calls (`'str' object is not callable`)"
  - "`bool('False')` evaluates to **`True`** because ANY non-empty string is truthy!"
---

## The trap

```python
# Trap 1: Overwriting a built-in name (`str` / `int` / `print`) locally:
str = "Ada"
# msg = str(42)               # TypeError: 'str' object is not callable!

# Trap 2: Parsing `"False"` text with bool():
flag = bool("False")
print("flag:", flag)          # True! NOT False!
```

## The fix

```python
user_name = "Ada"             # descriptive variable name never hides built-in `str()`!
msg = str(42)

raw = "False"
flag = raw.strip().lower() == "true"   # compare explicitly -> False!
print("msg:", msg, "| flag:", flag)
```

## Why it happens

1. **Built-in shadowing:** `str`, `int`, `print`, and `len` live in Python's outermost **Built-in** lookup tier, **not** reserved keywords. Creating your own variable named `str = "Ada"` silently hides the real `str()` converter inside that scope until you `del str` or restart!
2. **`bool(non_empty_str)`:** `bool(...)` never reads English words inside strings — it only asks **"is this text non-empty (`len > 0`)?"**. Any non-empty string (`"False"`, `"0"`, `"no"`) is truthy and produces `True`.
