---
type: concept
title: "Booleans, None, and truthiness"
difficulty: easy
mostAsked: true
tags: [basics, booleans, truthiness]
revision:
  - 'Falsy values: `False`, `None`, `0`, `0.0`, `""`, `[]`, `{}`, `set()`, `()` — everything else is truthy'
  - "Always check `None` with `is None` / `is not None`, never `== None`"
  - "`bool` is a subclass of `int`: `True == 1` and `False == 0`"
---

`bool` has two values: `True` and `False`. In Python, `bool` subclasses `int` (`True + True == 2`).

`None` is Python's sole null singleton (`NoneType`), used to represent "no value" or a missing result. Because only one `None` object exists in memory, always test identity with `is None` or `is not None`.

**Truthiness in `if` conditions:** Python converts any object to a boolean via `__bool__()` (or `__len__()`).

```python
# Falsy values (all evaluate to False in `if`):
# False, None, 0, 0.0, "", b"", [], (), {}, set(), range(0)

items = []
if not items:               # Pythonic emptiness check (not `len(items) == 0`)
    print("Empty!")
```

:::pitfall[0 vs None]
Never write `if count:` when `0` is a valid value! `0` is falsy, so `if count is not None:` distinguishes "zero" from "missing".
:::
