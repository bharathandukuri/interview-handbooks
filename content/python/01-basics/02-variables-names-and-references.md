---
type: concept
title: "Variables, dynamic strong typing, and references"
difficulty: easy
tags: [basics, variables, typing]
---

In Python, variables are **labels bound to objects in memory**, not fixed typed boxes. An object has a **type**, a **value**, and a unique **identity** (`id()`).

```python
x = 42            # `x` binds to an int object
print(type(x))    # <class 'int'>
print(id(x))      # memory address / unique id in CPython

x = "forty-two"   # rebinding `x` to a str object is allowed (dynamic typing)
x, y = 1, 2       # tuple unpacking assigns multiple names at once
x, y = y, x       # clean swap with no temp variable
```

Python is **dynamically typed** (types live on objects, not variable declarations, so `x` can be rebound) AND **strongly typed** (Python refuses nonsensical implicit coercions like `"5" + 2`, raising `TypeError` instead of silently guessing).

:::tip[Checking types cleanly]
Prefer `isinstance(x, int)` over `type(x) == int` — `isinstance` properly respects subclasses (for example, `bool` is a subclass of `int`).
:::
