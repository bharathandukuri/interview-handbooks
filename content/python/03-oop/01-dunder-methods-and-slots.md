---
type: concept
title: "Dunder methods and `__slots__`"
difficulty: medium
tags: [dunder, oop, memory]
---

**Dunder methods** (double-underscore) are Python's hooks into the data model. By implementing them, any class can behave like a built-in type.

```python
class Vector:
    __slots__ = ("x", "y")     # skip the per-instance __dict__

    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):         # readable repr
        return f"Vector({self.x}, {self.y})"

    def __add__(self, other):   # v1 + v2
        return Vector(self.x + other.x, self.y + other.y)

    def __len__(self):          # len(v)
        return 2

    def __eq__(self, other):    # v1 == v2
        return (self.x, self.y) == (other.x, other.y)
```

Key dunders to know: `__repr__`/`__str__`, `__eq__`/`__hash__`, `__lt__` (enables `sorted()`), `__getitem__`/`__setitem__`, `__enter__`/`__exit__`, `__call__`.

**`__slots__`** tells Python to store attributes in a fixed C array instead of a per-instance `dict`. Benefits: ~40–50 % less memory per instance and faster attribute access. Trade-off: you can't add arbitrary attributes at runtime and multiple inheritance with slots needs care.

:::tip[When to use slots]
Use `__slots__` when you're creating millions of small instances (points, events, nodes) and memory is a bottleneck. For normal classes, the overhead of `__dict__` is negligible.
:::
