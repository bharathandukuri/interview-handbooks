---
type: concept
title: "Dunder methods (__repr__, __str__, __eq__, __hash__, operators)"
difficulty: medium
mostAsked: true
tags: [oop, dunder, magic-methods, hashability]
related:
  [python.oop.classes-objects-self-and-init, python.oop.money-class-problem]
revision:
  - "**`__repr__`** is for developers/debugging (`!r`); **`__str__`** is friendly text for users (`print()`) and falls back to `__repr__`"
  - "Defining custom **`__eq__`** automatically sets **`__hash__ = None`** (unhashable!) unless you also implement **`__hash__`** consistently"
  - "Return **`NotImplemented`** (do not raise `TypeError`) from `__eq__`, `__lt__`, and `__add__` when given an unsupported type"
---

Methods whose names start and end with double underscores (**dunder** / **special methods**) plug your custom classes seamlessly into Python's built-in syntax (`print()`, `==`, `+`, `len()`, `for x in obj:`, `obj()`).

```python
class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):                  # unambiguous developer string; fallback for str()
        return f"Vector({self.x!r}, {self.y!r})"

    def __str__(self):                   # user-friendly display string for print(v)
        return f"({self.x}, {self.y})"

    def __eq__(self, other):
        if not isinstance(other, Vector):
            return NotImplemented        # lets Python try `other.__eq__(self)` cleanly!
        return (self.x, self.y) == (other.x, other.y)

    def __hash__(self):                  # required if __eq__ is defined & used in set/dict!
        return hash((self.x, self.y))

    def __add__(self, other):
        if not isinstance(other, Vector):
            return NotImplemented
        return Vector(self.x + other.x, self.y + other.y)

    def __bool__(self):                  # `if vec:` is False only for Vector(0, 0)
        return self.x != 0 or self.y != 0

v1 = Vector(2, 3)
v2 = Vector(2, 3)
print("str:", str(v1), "| repr:", repr(v1))
print("equal?", v1 == v2, "| set len:", len({v1, v2}), "| sum:", repr(v1 + Vector(1, 4)))
```

The screen shows:

```text
str: (2, 3) | repr: Vector(2, 3)
equal? True | set len: 1 | sum: Vector(3, 7)
```

**Essential dunder rules & edge cases:**

- **`__repr__` vs `__str__`:** If you only implement **one**, always implement **`__repr__`** — because `str(obj)` and `print(obj)` fall back to `__repr__` automatically when `__str__` is missing!
- **The `__eq__` / `__hash__` contract:** Whenever two objects compare equal (`a == b`), they **must** return the exact same `hash(a) == hash(b)`. To protect sets and dictionaries from silent corruption, Python automatically disables hashing (`__hash__ = None`) the moment you write a custom `__eq__`! Only define `__hash__` on **immutable** fields — mutating a key _after_ inserting it into a `set`/`dict` breaks lookups!
- **Why return `NotImplemented` instead of raising `TypeError`:** If `a + b` returns `NotImplemented`, Python gives `b.__radd__(a)` a chance to handle the operation (`__radd__` = reversed addition, e.g., `3 * money`), and raises `TypeError` itself only if both sides decline!
- **Other handy dunders:** `__len__` + `__getitem__` make a sequence indexable and iterable, `@functools.total_ordering` fills in `<=`, `>`, `>=` from `__eq__` and `__lt__`, and `__call__` makes an instance callable like a function (`obj(arg)`).
