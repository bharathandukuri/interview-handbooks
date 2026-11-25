---
type: question
title: "How do decorators work?"
difficulty: medium
mostAsked: true
tags: [decorators, functions, functools]
revision:
  - "A decorator is a callable that accepts a function and returns a replacement callable"
  - "Use `@functools.wraps(fn)` to preserve `__name__`, `__doc__`, and `__annotations__`"
  - "Stacking: `@b` over `@a` evaluates bottom-up as `b(a(fn))`"
---

## Answer

`@decorator` is syntactic sugar for `fn = decorator(fn)`. The decorator receives the original function, wraps it with extra behavior (logging, auth, timing, caching), and returns a callable accepting the same arguments.

```python
import functools

def retry(times: int = 3):
    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return fn(*args, **kwargs)
                except Exception:
                    if attempt == times - 1:
                        raise
        return wrapper
    return decorator

@retry(times=2)
def fetch(url: str) -> str:
    return url
```

Without `@functools.wraps(fn)`, `fetch.__name__` becomes `"wrapper"` — breaking logging, Sphinx docs, and test introspection.

## Why interviewers ask

Decorators appear across Flask/FastAPI routes, `@pytest.fixture`, `@dataclass`, and caching. Interviewers check that you know both single-layer and parameterised 3-layer decorators.

## Follow-ups

- What is the order of execution when stacking `@dec1` on top of `@dec2`?
- Can a class (implementing `__call__`) act as a decorator?
