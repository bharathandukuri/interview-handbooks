---
type: question
title: "Reference counting and cyclic garbage collection"
difficulty: hard
tags: [memory, gc, cpython]
---

## Answer

CPython tracks every object's **reference count** — a number stored in the object's C header that records how many names, containers, or closures point to it. When the count reaches zero, CPython immediately deallocates the object. This is why `del x` often frees memory instantly.

```python
import sys

a = [1, 2, 3]
print(sys.getrefcount(a))  # 2: `a` + the getrefcount argument

b = a
print(sys.getrefcount(a))  # 3: `a`, `b`, + argument
del b
print(sys.getrefcount(a))  # 2 again
```

**The cycle problem:** Reference counting alone can't free cycles.

```python
a = []
a.append(a)   # a refers to itself; refcount never drops to 0
del a          # still not freed!
```

CPython's **cyclic garbage collector** (`gc` module) periodically scans for unreachable reference cycles and frees them. It runs automatically but can be tuned or triggered manually with `gc.collect()`.

Objects with `__del__` finalizers used to block cycle collection (Python 2); in Python 3.4+ they are handled safely via PEP 442.

## Why interviewers ask

Understanding reference counting helps explain `del`, `weakref`, finalizers, and why large graphs can silently leak memory in long-running processes.

## Follow-ups

- When would you use `weakref.ref` instead of a strong reference?
- How do you detect and debug reference cycle leaks in production?
