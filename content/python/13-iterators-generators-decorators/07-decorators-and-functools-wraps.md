---
type: concept
title: "Decorators, @functools.wraps, and parameterized decorators"
difficulty: medium
mostAsked: true
tags: [decorators, closures, functools, higher-order]
related:
  [
    python.iterators-generators-decorators.closures-and-nonlocal,
    python.functions.args-and-kwargs,
  ]
revision:
  - "A **decorator** is a function that takes a function and returns an enhanced wrapper function (`@dec` is shorthand for `fn = dec(fn)`)"
  - "Always decorate the inner wrapper with **`@functools.wraps(fn)`** so `__name__`, `__doc__`, and type/test metadata stay intact"
  - "A **decorator with arguments** (`@repeat(3)`) needs **3 levels**: `decorator_factory(args) -> decorator(fn) -> wrapper(*args, **kwargs)`"
---

Imagine adding logging, authentication checks, caching, or timing to 20 functions without duplicating setup/teardown boilerplate inside every function body. A **decorator** wraps a function cleanly using the **`@name`** syntax: writing `@trace` right above `def add(a, b):` is 100% equivalent to running `add = trace(add)` right after `def` finishes!

```python
from functools import wraps

def repeat(times=2):                        # Level 1: accepts decorator arguments
    def decorator(fn):                      # Level 2: receives original function `fn`
        @wraps(fn)                          # copies __name__, __doc__, __wrapped__!
        def wrapper(*args, **kwargs):       # Level 3: runs on every call
            result = None
            for _ in range(times):
                result = fn(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(times=3)
def announce(msg):
    """Print an announcement cleanly."""
    print("->", msg)
    return msg.upper()

out = announce("deploying")
print("returned:", out, "| preserved name:", announce.__name__)
```

The screen shows:

```text
-> deploying
-> deploying
-> deploying
returned: DEPLOYING | preserved name: announce
```

**Three critical decorator rules & traps:**

- **Always use `@functools.wraps(fn)` on `wrapper`:** Without `@wraps(fn)`, `announce.__name__` changes to `"wrapper"`, its docstring disappears, and `inspect` / `pytest` / debuggers lose track of the original function (`__wrapped__`)!
- **Forward `*args, **kwargs` and `return result`:** Wrapping any function generically requires accepting arbitrary positional + keyword arguments and returning `fn(...)`'s return value (forgetting `return` silently turns wrapped functions into `None`!).
- **Stacked decorators (`@dec_a` above `@dec_b`):** Remember `fn = dec_a(dec_b(fn))` — the **bottom** decorator (`@dec_b`) wraps `fn` first during definition, **and** `@dec_a`'s wrapper runs **outermost** (first) when calling `fn()`! (You can also write class-based decorators implementing `__call__` or decorate classes too!)
