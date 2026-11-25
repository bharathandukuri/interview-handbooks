---
type: concept
title: "Memory optimization with __slots__"
difficulty: medium
mostAsked: true
tags: [internals, memory, slots, oop, performance]
related:
  [
    python.oop.dataclasses-and-enums,
    python.how-python-works-inside.reference-counting-gc-and-weakref,
  ]
revision:
  - "Normally each instance creates a full **`__dict__`** hash table (~100–200+ bytes overhead per object)"
  - "Defining **`__slots__ = ('x', 'y')`** replaces `__dict__` with fixed pointer slots — cutting memory use dramatically and blocking unknown attribute typos"
  - "Subclasses MUST also define `__slots__` (or `__slots__ = ()`), otherwise they get a `__dict__` again"
---

By default, every instance of a custom Python class carries its own hidden dictionary **`obj.__dict__`**. That lets you attach arbitrary new attributes at runtime (`user.anything = 123`), **but** every Python `dict` reserves empty hash buckets and key strings! If you create **5 million `Point` objects**, those millions of empty-ish dicts eat hundreds of megabytes of RAM.

Declaring **`__slots__`** (or `@dataclass(slots=True)`) tells Python: _"This class only has these exact attributes — allocate fixed slots right inside the object struct and skip creating `__dict__`!"_

```python
import sys

class RegularPoint:
    def __init__(self, x, y):
        self.x = x
        self.y = y

class SlottedPoint:
    __slots__ = ("x", "y")
    def __init__(self, x, y):
        self.x = x
        self.y = y

r = RegularPoint(1, 2)
s = SlottedPoint(1, 2)
print("Regular has __dict__?", hasattr(r, "__dict__"), "| size + dict:", sys.getsizeof(r) + sys.getsizeof(r.__dict__))
print("Slotted has __dict__?", hasattr(s, "__dict__"), "| size:", sys.getsizeof(s))

try:
    s.z = 3                       # typos fail fast instead of silently adding a new attribute!
except AttributeError as err:
    print("Blocked dynamic attr:", err)
```

The screen shows:

```text
Regular has __dict__? True | size + dict: 344
Slotted has __dict__? False | size: 48
Blocked dynamic attr: 'SlottedPoint' object has no attribute 'z' and no __dict__ for setting new attributes
```

_(Exact `sys.getsizeof` byte counts vary slightly across operating systems and Python versions, yet `__slots__` consistently eliminates the large per-instance `__dict__`.)_

**Important edge cases when using `__slots__`:**

1. **Inheritance trap:** If `class Child(SlottedPoint): pass` forgets `__slots__ = ()` (for no extra attributes) or `__slots__ = ("z",)`, Python creates a `__dict__` on `Child` instances again — losing the memory savings!
2. **Weak references:** Slotted classes disable weak references unless you explicitly include `"__weakref__"` inside `__slots__` (`__slots__ = ("x", "y", "__weakref__")`).
3. **Dataclass shortcut:** In Python 3.10+, **`@dataclass(slots=True)`** generates both your boilerplate methods _and_ `__slots__` automatically!
