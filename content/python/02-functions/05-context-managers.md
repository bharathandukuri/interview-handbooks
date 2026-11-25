---
type: concept
title: "Context managers and `with`"
difficulty: medium
mostAsked: true
tags: [context-managers, stdlib, exceptions]
revision:
  - "`__enter__` runs on entry; `__exit__(exc_type, exc_val, exc_tb)` always runs on exit, even on exceptions"
  - "`@contextmanager` turns a generator with one `yield` into a context manager"
  - "Return `True` from `__exit__` to suppress an exception; return `None`/`False` to propagate it"
---

A context manager is any object that implements `__enter__` and `__exit__`. The `with` statement calls `__enter__` on entry and guarantees `__exit__` runs on exit — whether cleanly or due to an exception.

```python
class Timer:
    def __enter__(self):
        import time; self._t = time.perf_counter()
        return self

    def __exit__(self, *exc):
        self.elapsed = time.perf_counter() - self._t
        return False   # don't suppress exceptions
```

The `contextlib.contextmanager` decorator lets you skip the class:

```python
from contextlib import contextmanager

@contextmanager
def managed_resource():
    resource = acquire()
    try:
        yield resource
    finally:
        release(resource)
```

Everything before `yield` is `__enter__`; everything after (in `finally`) is `__exit__`. Use `with` wherever you manage resources — files, locks, DB connections, temp directories — to prevent leaks even when exceptions occur.
