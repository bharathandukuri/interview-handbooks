---
type: question
title: 'What does "dynamically typed" (and "strongly typed") mean in Python?'
difficulty: easy
mostAsked: true
tags: [interview, types, variables]
related:
  [
    python.variables-and-types.type-and-basic-types,
    python.variables-and-types.dynamic-vs-static-and-strong-vs-weak-compare,
  ]
revision:
  - "**Dynamic typing:** types live on the **value object** in memory, not on the variable name — the same name can later point to a new type"
  - "**Strong typing:** Python will NOT silently coerce mismatched types (`'5' + 3` raises `TypeError` cleanly)"
---

## Answer

Python is **both dynamically typed AND strongly typed** — two ideas that interviewers love hearing separated clearly:

1. **Dynamically typed (types belong to objects, checked at runtime):**
   - You never lock a variable name like `int x = 10`. Every name is just a reference label, and the object it points to knows its own type (`<class 'int'>`, `<class 'str'>`). You can rebind the same name later:

```python
x = 10        # `x` points to an int object
print(type(x).__name__)
x = "ten"     # now `x` points to a str object
print(type(x).__name__)
```

The screen shows:

```text
int
str
```

2. **Strongly typed (no silent unsafe conversions):**
   - Dynamic does **not** mean "anything mixes automatically"! Running `"5" + 3` raises **`TypeError: can only concatenate str (not "int") to str`** instead of silently turning it into `"53"` (like JavaScript) or `8`. You must explicitly choose `int("5") + 3` or `"5" + str(3)`!
   - _(Note one narrow numeric widening exception: mixing `int` and `float` cleanly promotes to `float`, e.g., `5 + 2.0 -> 7.0`, and `bool` subclasses `int`, e.g., `True + 1 -> 2`.)_

**A short answer for an interview:** Python is dynamically typed because type tags belong to runtime objects rather than variable names (so a name can be rebound to any type), and strongly typed because incompatible types like `"5" + 3` raise `TypeError` instead of silently coercing.

## Why interviewers ask

Candidates coming from C/Java sometimes say "Python has no types", while people thinking of JavaScript confuse "dynamic" with "weak coercion". Distinguishing where types live and why `"5" + 3` fails clears up both misconceptions immediately.

## Follow-ups

- **"Does adding type hints like `x: int = 10` turn Python into a statically typed language?"** No — type hints (covered in Chapter 16) are ignored at runtime by Python unless checked externally by `mypy`/`pyright` or validated manually!
- **"What is the difference between `type(x) is int` and `isinstance(x, int)`?"** Both match `42`, **but** `isinstance(True, int)` returns `True` because `bool` subclasses `int`, whereas `type(True) is int` returns `False`.
