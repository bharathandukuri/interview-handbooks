---
type: concept
title: "Context managers, `with`, and `contextlib`"
difficulty: medium
mostAsked: true
tags: [context-managers, stdlib, exceptions]
revision:
  - "`__enter__` runs on entry; `__exit__(exc_type, exc_val, exc_tb)` always runs on exit"
  - "Return `True` from `__exit__` to suppress an exception; `False`/`None` propagates it"
  - "Use `@contextmanager` for generator-based setup/teardown and `ExitStack` for dynamic counts"
---

Any object implementing `__enter__` and `__exit__` works with `with`, guaranteeing resource cleanup even if an exception occurs.

```python
from contextlib import contextmanager, suppress

@contextmanager
def managed_conn(dsn: str):
    conn = connect(dsn)          # __enter__
    try:
        yield conn
    finally:
        conn.close()             # __exit__ (always runs)
```

**Handy `contextlib` tools:**

- **Multiple resources (3.10+):** `with (open("a.txt") as a, open("b.txt") as b):`
- **`suppress(FileNotFoundError)`:** Cleaner than `try: os.remove(p) except FileNotFoundError: pass`.
- **`ExitStack`:** Manage a dynamic number of context managers determined at runtime (e.g., opening a list of N files).
