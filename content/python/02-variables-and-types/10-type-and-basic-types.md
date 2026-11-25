---
type: concept
title: "type() and isinstance(): checking what kind of value you have"
difficulty: easy
tags: [types, introspection, basics]
revision:
  - "`type(x)` tells you the exact **class/type** of an object (`int`, `float`, `str`, `bool`, `NoneType`)"
  - "Check multiple types cleanly with **`isinstance(x, (int, float))`** — watch the `isinstance(True, int) == True` quirk!"
  - "Quotes, decimal points, and capitalization completely change what type Python creates (`7` vs `7.0` vs `'7'`)"
---

Every object in Python carries its exact **type** alongside its value. You inspect an object's type using **`type(...)`**, or check whether it matches an expected type using **`isinstance(...)`**:

```python
print(type(42))
print(type("hi"))
print("42 is int?", isinstance(42, int))
print("3.5 is number?", isinstance(3.5, (int, float)))    # checks int OR float cleanly!
print("Quirk: isinstance(True, int)?", isinstance(True, int))
```

The screen shows:

```text
<class 'int'>
<class 'str'>
42 is int? True
3.5 is number? True
Quirk: isinstance(True, int)? True
```

**Python's five fundamental built-in types side by side:**

| Type       | Examples               | Meaning                      | Supports `+` with same type?          |
| ---------- | ---------------------- | ---------------------------- | ------------------------------------- |
| `int`      | `-5`, `0`, `1_000`     | Exact whole numbers          | Adds numerically (`2 + 3 -> 5`)       |
| `float`    | `3.14`, `-0.5`, `7.0`  | Decimal / scientific numbers | Adds numerically (`1.5 + 2.5 -> 4.0`) |
| `str`      | `""`, `"hello"`, `'7'` | Sequence of text characters  | Concatenates (`"a" + "b" -> "ab"`)    |
| `bool`     | `True`, `False`        | Logical truth (`bool < int`) | Numeric (`True + True -> 2`)          |
| `NoneType` | `None`                 | Absence of a value           | ❌ Raises `TypeError`                 |

**Important edge case (`type()` vs `isinstance()`):**

- Prefer **`isinstance(x, int)`** over `type(x) == int` in real programs because `isinstance` cleanly accepts tuples of types (`(int, float)`) and works naturally with inheritance (Chapter 12).
- **The `bool` exception:** Remember `bool` inherits from `int`, so `isinstance(True, int)` is **`True`** while `type(True) is int` is **`False`**! Whenever rejecting booleans matters (such as validating numeric inputs), guard `if isinstance(x, bool):` first!
