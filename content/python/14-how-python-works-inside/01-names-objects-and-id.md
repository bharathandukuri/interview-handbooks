---
type: concept
title: "Names vs objects, identity (id()), and is vs =="
difficulty: easy
mostAsked: true
tags: [internals, references, memory, identity]
revision:
  - "Python variables are **names (labels)** pointing to objects on the heap — not fixed boxes holding raw bytes"
  - "Every Python object has an **identity (`id`)**, a **type (`type`)**, and a **value**"
  - "**`is`** compares memory identity (`id(a) == id(b)`); **`==`** compares value (`a.__eq__(b)`)"
---

In C, a variable `int x = 5` is a fixed box in memory where the number `5` lives. In Python, a variable is a **sticky-note label (name)** pointing to an **object** floating on the heap:

```python
a = [10, 20]
b = a                       # `b` sticks onto the SAME list object!
print("same object (is)?", a is b, "| equal values (==)?", a == b)

c = [10, 20]                # a brand-new list object with equal contents!
print("a is c?", a is c, "| a == c?", a == c)
print("id(a) == id(b)?", id(a) == id(b), "| id(a) == id(c)?", id(a) == id(c))
```

The screen shows:

```text
same object (is)? True | equal values (==)? True
a is c? False | a == c? True
id(a) == id(b)? True | id(a) == id(c)? False
```

**Three essential rules about identity & equality:**

1. **Identity never changes (`id()`):** In CPython, `id(obj)` returns the object's memory address while it stays alive. After an object is garbage-collected, a _new_ unrelated object may reuse that old address later — never compare saved `id()` integers across destroyed objects!
2. **Use `is` ONLY for singletons (`None`, `True`, `False`, sentinels):** Write `if user is None:`, never `if user == None:` (a custom class's `__eq__` could misbehave or crash on `== None`, whereas `is` checks identity directly in one pointer comparison!).
3. **Assignment (`b = a`) never copies objects:** It only attaches another name to the existing object, taking instant **`O(1)`** time whether the list has 2 items or 20 million.
