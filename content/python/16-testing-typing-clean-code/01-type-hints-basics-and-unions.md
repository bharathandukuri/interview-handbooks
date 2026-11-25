---
type: concept
title: "Type hints basics: modern unions, collections, Callable, Any vs object"
difficulty: easy
mostAsked: true
tags: [typing, python312, static-analysis, clean-code]
related: [python.variables-and-types.what-is-dynamic-typing]
revision:
  - "**Type hints** document expected types for editors and static checkers (`mypy` / `pyright`), **without enforcing types at runtime**"
  - "Modern Python uses **`list[int]`**, **`dict[str, float]`**, and **`str | None`** instead of older `typing.List` / `Optional`"
  - "**`Any`** disables type checking completely; **`object`** forces callers to prove type safety via `isinstance()` checks first"
---

Python stays dynamically typed at runtime, **but** adding optional **type hints** lets your editor autocomplete fields accurately and lets static type checkers (**`mypy`**, **`pyright`**) catch mismatched types across thousands of files _before_ you even execute tests!

Since Python 3.9–3.10+, built-in containers support bracket types natively without importing `List`, `Dict`, or `Optional`:

```python
from collections.abc import Callable

def scale_scores(
    scores: list[int],
    factor: float = 1.0,
    formatter: Callable[[float], str] | None = None,
) -> list[str]:
    results: list[str] = []
    for s in scores:
        scaled = s * factor
        results.append(formatter(scaled) if formatter is not None else f"{scaled:.1f}")
    return results

print(scale_scores([10, 20], factor=1.5))
print(scale_scores([5], formatter=lambda v: f"{int(v)}pts"))
print("runtime annotations:", scale_scores.__annotations__)
```

The screen shows:

```text
['15.0', '30.0']
['5pts']
runtime annotations: {'scores': list[int], 'factor': <class 'float'>, 'formatter': collections.abc.Callable[[float], str] | None, 'return': list[str]}
```

**Important edge cases in type annotations:**

- **`Any` vs `object`:**
  - `x: Any` turns off type checking for `x` — calling `x.anything()` succeeds statically (making `Any` risky unless wrapping untyped external data).
  - `x: object` accepts _any_ Python value safely (`42`, `"hi"`, `[1]`), **yet** forbids operations like `x + 1` until you narrow the type (`if isinstance(x, int): return x + 1`).
- **Fixed vs variable tuples:**
  - `tuple[int, str]` means an exact 2-element pair `(1, "a")`.
  - `tuple[int, ...]` means a variable-length tuple of integers `(1, 2, 3)`.
- **Remember: annotations are NOT runtime guards!** Passing `scale_scores(["bad"])` passes Python's syntax/call check and crashes only when `s * factor` runs (use explicit runtime validation or `pydantic` at untrusted API boundaries!).
