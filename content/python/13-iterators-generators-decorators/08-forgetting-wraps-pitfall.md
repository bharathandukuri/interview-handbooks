---
type: pitfall
title: "Decorators without @functools.wraps erase __name__, __doc__, and return values"
difficulty: easy
tags: [decorators, functools, debugging, gotchas]
related: [python.iterators-generators-decorators.decorators-and-functools-wraps]
---

## The trap

```python
def log_call(fn):
    def wrapper(*args, **kwargs):
        fn(*args, **kwargs)              # Oops 1: forgot `return`!
    return wrapper                       # Oops 2: forgot `@wraps(fn)`!

@log_call
def double(x):
    """Double a number."""
    return x * 2

print("name:", double.__name__, "| doc:", double.__doc__, "| out:", double(5))
```

## The fix

```python
from functools import wraps

def log_call(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)       # forwards return value cleanly!
    return wrapper

@log_call
def double(x):
    """Double a number."""
    return x * 2

print("name:", double.__name__, "| doc:", double.__doc__, "| out:", double(5))
```

## Why it happens

Writing `@log_call` replaces `double` in module scope with the new `wrapper` function returned by `log_call`. Without `@wraps(fn)`:

1. Python sets `double.__name__ = "wrapper"` and `double.__doc__ = None`, breaking tracebacks, stack profilers, `help()`, and frameworks like Flask/FastAPI/pytest that inspect function metadata or register routes by name!
2. Calling `fn(*args, **kwargs)` without `return` silently drops the return value and makes `double(5)` evaluate to `None`.
