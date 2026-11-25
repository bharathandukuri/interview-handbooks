---
type: concept
title: "`__slots__`, `weakref`, and object memory layout"
difficulty: medium
mostAsked: true
tags: [memory, slots, weakref]
revision:
  - "Normal instances store attributes in a per-instance `__dict__` hash table"
  - "`__slots__` allocates fixed C-struct slots on the instance, saving ~40-50% memory"
  - "`weakref.ref` / `WeakValueDictionary` lets caches reference objects without blocking GC"
---

By default, every Python instance carries a `__dict__` dictionary so you can add attributes dynamically. For millions of small objects (AST nodes, coordinates, records), that dict wastes memory.

```python
class Point:
    __slots__ = ("x", "y")     # no per-instance __dict__!
    def __init__(self, x: float, y: float) -> None:
        self.x, self.y = x, y
```

**Trade-offs of `__slots__`:**

- Saves ~40–50% RAM and speeds up attribute access.
- Prevents adding unlisted attributes (`p.z = 1` raises `AttributeError`).
- Subclasses must also define `__slots__` (even empty `()`) or they gain a `__dict__` again.
- Disables weak references unless `"__weakref__"` is included in `__slots__`.

**`weakref` & `sys.getsizeof`:** `sys.getsizeof(obj)` returns only the **shallow** byte size of `obj` (excluding referenced children). Use `weakref.WeakValueDictionary` for caches that auto-drop entries once callers release strong references.
