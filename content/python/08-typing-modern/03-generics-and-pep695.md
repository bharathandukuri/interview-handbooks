---
type: concept
title: "Generics, `ParamSpec`, and PEP 695 (Python 3.12+)"
difficulty: hard
tags: [typing, generics, python312]
---

Python 3.12 (PEP 695) introduced clean bracket syntax for generic functions, classes, and type aliases — no more boilerplate `TypeVar` declarations:

```python
# Python 3.12+ generic function & class
def first[T](items: list[T]) -> T:
    return items[0]

class Box[T]:
    def __init__(self, value: T) -> None:
        self.value = value

# Lazy `type` alias statement (supports recursion cleanly)
type JsonValue = dict[str, "JsonValue"] | list["JsonValue"] | str | int | float | bool | None
```

**`ParamSpec` for decorators:** Preserves the exact parameter signature of a wrapped function instead of erasing it to `(*args: Any, **kwargs: Any)`:

```python
from collections.abc import Callable

def log_calls[**P, R](fn: Callable[P, R]) -> Callable[P, R]:
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        return fn(*args, **kwargs)
    return wrapper
```
