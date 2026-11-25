---
type: concept
title: "Dunder methods, data model, and `__slots__`"
difficulty: medium
mostAsked: true
tags: [dunder, oop, memory]
revision:
  - "`__repr__` is for developers (unambiguous); `__str__` is for end-users"
  - "If a class defines `__eq__` without `__hash__`, Python sets `__hash__ = None` (unhashable)"
  - "`__slots__` replaces per-instance `__dict__` with a fixed layout, saving ~40% memory"
---

**Dunder methods** hook custom classes into Python's built-in syntax (`+`, `len()`, `[]`, `==`, `in`):

```python
class Vector:
    __slots__ = ("x", "y")     # skip per-instance __dict__

    def __init__(self, x: float, y: float) -> None:
        self.x, self.y = x, y

    def __repr__(self) -> str:
        return f"Vector({self.x!r}, {self.y!r})"

    def __add__(self, other: "Vector") -> "Vector":
        return Vector(self.x + other.x, self.y + other.y)

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Vector):
            return NotImplemented
        return (self.x, self.y) == (other.x, other.y)
```

**Core dunders to know:** `__repr__`/`__str__`, `__eq__`/`__hash__` (equal objects **must** have equal hashes!), `__lt__` (enables `sorted()`, or use `@functools.total_ordering`), `__len__`, `__getitem__`, `__contains__`, `__bool__`, and `__call__` (makes instances callable like functions).
