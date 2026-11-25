---
type: question
title: "How do decorators work?"
difficulty: medium
mostAsked: true
tags: [decorators, functions, functools]
revision:
  - "A decorator is a callable that accepts a function and returns a replacement callable"
  - "Use `@functools.wraps(fn)` to preserve `__name__`, `__doc__`, and `__annotations__`"
  - "Stacking: `@b\\n@a` applies as `b(a(fn))` — innermost decorator runs first"
---

## Answer

`@decorator` is syntactic sugar for `fn = decorator(fn)`. The decorator receives the original function, can wrap it in any logic, and must return a callable that takes the same arguments.

```python
import functools

def retry(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        for attempt in range(3):
            try:
                return fn(*args, **kwargs)
            except Exception:
                if attempt == 2:
                    raise
    return wrapper

@retry
def fetch(url: str) -> str:
    ...  # may raise
```

Without `@functools.wraps`, `fetch.__name__` becomes `"wrapper"` — breaking logging, profiling, and test introspection.

Parameterised decorators add one more layer: `@retry(times=3)` means `retry(times=3)` returns the actual decorator, which is then called with `fn`.

## Why interviewers ask

Decorators appear everywhere in real codebases (caching, auth, rate-limiting). Interviewers want to see that you understand the wrapping mechanics, not just the `@` syntax.

## Follow-ups

- How do you write a decorator that accepts parameters?
- What does `functools.lru_cache` do under the hood?
