---
type: question
title: "Reference counting and cyclic garbage collection"
difficulty: hard
tags: [memory, gc, cpython]
---

## Answer

CPython tracks every object's **reference count** (`ob_refcnt`). Whenever a name, container, or closure binds to an object, its count increments; when unbound or out of scope, it decrements. At **0**, CPython deallocates the object immediately.

```python
import sys

a = [1, 2, 3]
print(sys.getrefcount(a))   # 2 (`a` + the temporary arg passed to getrefcount)
b = a                       # refcount -> 3
del b                       # refcount -> 2
```

**Why reference counting alone isn't enough:** Reference cycles (`a = []; a.append(a); del a`) never drop to zero!

CPython's **cyclic garbage collector (`gc`)** scans container objects across 3 generations (`0`, `1`, `2`) to detect and free unreachable cycles. You can inspect or trigger it via `gc.collect()`, or disable it briefly in latency-critical batch jobs.

## Why interviewers ask

It explains deterministic resource cleanup (`with` vs relying on `__del__`), `weakref`, and why long-lived services with reference cycles can spike memory.

## Follow-ups

- What happens to objects with `__del__` in a reference cycle (PEP 442)?
- How do you debug a memory leak in Python (`tracemalloc`, `gc.get_referrers`)?
