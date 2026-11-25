---
type: concept
title: "Reference counting, cyclic garbage collection (gc), and weakref"
difficulty: hard
mostAsked: true
tags: [internals, memory, gc, weakref]
related: [python.how-python-works-inside.names-objects-and-id]
revision:
  - "CPython frees most objects **immediately** when their **reference count** hits `0`"
  - "Reference counting cannot break **reference cycles** (`a -> b -> a`), so CPython also runs a **generational cyclic garbage collector (`gc`)**"
  - "**`weakref`** lets caches point to objects without bumping their reference count so unused objects can still be freed"
---

How does Python know when an object in memory is no longer needed and can be reclaimed? CPython uses a **two-layer memory manager**:

**1. Reference counting (primary, instant):**
Every object keeps an integer counter (`ob_refcnt`) tracking how many names, list slots, or attributes currently point to it:

- Assigning `b = a` or putting `a` inside a list **increments** the counter by `1`.
- Deleting a name (`del a`), reassigning it (`a = None`), or exiting a function scope **decrements** the counter by `1`.
- The instant the counter drops to **`0`**, CPython immediately destroys the object!

**2. Generational cyclic garbage collector (`gc`):**
If two objects point to each other (`a.friend = b; b.friend = a`) and you run `del a, b`, neither object's reference count drops to `0` (both stay at `1`!). CPython's periodic **cycle detector** scans container objects (`list`, `dict`, custom class instances) across three age generations (**Gen 0, Gen 1, Gen 2**) to find unreachable islands and free them!

```python
import gc, sys, weakref

class Node:
    def __init__(self, label):
        self.label = label
        self.peer = None

# 1. Inspect refcount (getrefcount adds +1 temporarily for its own argument!)
obj = Node("solo")
ref = obj
print("refcount (expected 2 + 1 temporary arg):", sys.getrefcount(obj))
del ref
print("after del ref (expected 1 + 1 arg):", sys.getrefcount(obj))

# 2. Weak reference: cache without forcing object to stay alive!
weak_ptr = weakref.ref(obj)
print("alive before del:", weak_ptr().label)
del obj
gc.collect()
print("after del obj -> weak_ptr():", weak_ptr())
```

The screen shows:

```text
refcount (expected 2 + 1 temporary arg): 3
after del ref (expected 1 + 1 arg): 2
alive before del: solo
after del obj -> weak_ptr(): None
```

**Practical edge cases to know:**

- **Why `sys.getrefcount(obj)` is always 1 higher than you expect:** passing `obj` into `getrefcount(...)` creates a temporary parameter reference during that call!
- **`weakref` types limit:** Custom class instances and functions support weak references by default, **but** built-in `int`, `str`, `list`, and `dict` do **not** (`TypeError: cannot create weak reference to 'list' object`). Use `weakref.WeakValueDictionary` for object caches that automatically evict entries once callers stop holding strong references!
- **Avoid `__del__` finalizers in cycles unless careful:** Context managers (`with`) are deterministic and far cleaner than relying on `__del__` timing!
