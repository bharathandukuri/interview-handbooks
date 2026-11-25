---
type: concept
title: "None: representing 'no value' (NoneType singleton)"
difficulty: easy
tags: [none, types, basics]
revision:
  - "**`None`** (type `NoneType`) explicitly represents the absence of a value — an unassigned placeholder"
  - "`None` is **not** equal to `0`, `False`, or `''` (`None == 0` is `False`; math with `None` raises `TypeError`)"
  - "Always check for `None` using **`is None`** or **`is not None`** (never `== None`)"
---

Sometimes a program needs to say _"we do not have a value yet"_ — like a user who skipped typing a middle name, or a search that found nothing. Python uses the special value **`None`** (whose type is **`NoneType`**) for that empty slot.

```python
winner = None                         # placeholder before race finishes
print("winner:", winner, "| type:", type(winner))
print("is None?", winner is None)     # preferred check: `is None` / `is not None`
print("None == 0?", winner == 0, "| None == ''?", winner == "", "| None == False?", winner == False)
```

The screen shows:

```text
winner: None | type: <class 'NoneType'>
is None? True
None == 0? False | None == ''? False | None == False? False
```

**Key rules and edge cases:**

- **`None` != `0` != `""` != `False`:** Think of `0` as "a box holding the number zero" and `""` as "a box holding blank text", whereas **`None` means "no result/value exists at all"** (e.g., `temperature = 0` means freezing weather, whereas `temperature = None` means the sensor has not reported yet!).
- **No math on `None` (`TypeError`):** Writing `None + 1` or `len(None)` crashes immediately with **`TypeError`**. That is why checking `if result is not None:` before using an optional value prevents production crashes!
- **One shared object (**singleton**):** Every occurrence of `None` in your entire Python program points to the **exact same single `None` object** in memory — which is why Python programmers always write **`if x is None:`** (fast identity check, immune to weird custom `==` overrides!).
- **Where you see `None` next:** Chapter 09 shows functions without a `return` statement (and `list.sort()` / `print()` itself!) return **`None`** automatically!
