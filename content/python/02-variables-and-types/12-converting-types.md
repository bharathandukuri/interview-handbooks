---
type: concept
title: "Type conversion (casting): int(), float(), str(), and bool()"
difficulty: easy
tags: [types, conversion, casting, edge-cases]
related:
  [
    python.getting-started.input-text-trap,
    python.variables-and-types.type-and-basic-types,
  ]
revision:
  - "`int()`, `float()`, `str()`, and `bool()` perform **explicit type conversion (casting)** into a new object"
  - "`int(3.9)` gives `3` and `int(-3.9)` gives `-3` (**truncates toward zero**, does NOT round)"
  - "`int('3.9')` raises `ValueError`; convert via `int(float('3.9'))` instead — and beware `bool('False')` is **`True`**!"
---

Python will not automatically glue numbers onto strings (`"Day " + 7` raises `TypeError`). When you need another type, convert explicitly (**type casting**) with **`int()`**, **`float()`**, **`str()`**, or **`bool()`**:

```python
print(int("  -12  ") + 3)         # `int()` ignores surrounding spaces safely!
print(float("2.5") + 1)           # turns text into decimal float -> 3.5
print(str(7) + " days")           # `str()` turns numbers/None into text
print(int(3.9), int(-3.9))        # cuts decimals toward zero -> 3 and -3 (no rounding!)
print(bool(0), bool(""), bool("False"))   # Watch `"False"` -> True!!
```

The screen shows:

```text
-9
3.5
7 days
3 -3
False False True
```

**Essential conversion rules and edge cases:**

- **`int(float_val)` truncates toward zero:** `int(3.9)` cuts off `.9` and returns `3` (**not** `4`); `int(-3.9)` gives `-3` (**not** `-4`). Use `round(...)` first if you want rounding!
- **`int("3.9")` fails with `ValueError`:** `int()` parses base-10 integer digits (optional `+/-`, surrounding whitespace, or underscores `"1_000"`). If text contains a decimal point (`"3.9"`), parse with **`float("3.9")`** first (or `int(float("3.9"))`)! Bad text like `int("abc")` or `int("")` also raises `ValueError`.
- **`int(True)` -> `1`, `int(False)` -> `0`**, while **`str(...)`** succeeds on nearly every object (`str(None)` gives `"None"`).
- **`bool("False")` is `True`!** When converting text with `bool(text)`, **every non-empty string** — including `"False"`, `"0"`, and `" "` (a space!) — converts to **`True`**! Only the empty string `""` (along with `0`, `0.0`, `None`, and empty containers) becomes `False`. Compare text explicitly (`text == "True"`) instead of calling `bool(text)`!
