---
type: concept
title: "Type annotations basics (`list[int]`, `X | Y`, `Callable`)"
difficulty: easy
tags: [typing, syntax, mypy]
---

Type hints document interfaces and catch bugs statically with `mypy` or `pyright` — without changing runtime execution speed.

```python
from collections.abc import Callable

def apply_all(
    items: list[int],                    # built-in generic (Python 3.9+)
    fn: Callable[[int], int],
    fallback: int | None = None,         # union syntax (Python 3.10+)
) -> dict[str, int]:
    return {str(x): fn(x) for x in items}
```

**Important distinctions:**

- **`Any` vs `object`:** `Any` disables type checking (escape hatch); `object` accepts anything safely and requires narrowing (`isinstance`) before calling methods.
- **Abstract collection types (`collections.abc`):** Prefer `Sequence[int]` or `Mapping[str, int]` for **inputs** (accepts `list`, `tuple`, etc.) and concrete `list[int]` / `dict[str, int]` for **return types**.
- Run `mypy src/` or `pyright` in CI to enforce annotations.
