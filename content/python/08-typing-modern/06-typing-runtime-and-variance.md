---
type: question
title: "Runtime enforcement and container variance (`Sequence` vs `list`)"
difficulty: medium
tags: [typing, variance, interviews]
---

## Answer

**1. Runtime behavior:** Python **does not** enforce type hints at runtime — `def add(a: int, b: int) -> int:` will still happily concatenate strings if called with `"a", "b"`. Annotations are stored in `__annotations__` for static checkers (`mypy`, `pyright`) and runtime libraries (`pydantic`, `fastapi`, `dataclasses`).

**2. Why `list[Dog]` is NOT a `list[Animal]` (invariance):**

```python
def add_cat(animals: list[Animal]) -> None:
    animals.append(Cat())

dogs: list[Dog] = [Dog()]
# add_cat(dogs)  # Static error! Mutating `dogs` with a Cat would break list[Dog]
```

Mutable containers (`list`, `dict`, `set`) are **invariant** in their element type. Read-only containers like `Sequence[Animal]` or `Iterable[Animal]` are **covariant** — passing `list[Dog]` to `Sequence[Animal]` is completely safe!

## Why interviewers ask

It tests whether you understand why static typing works the way it does in Python and why `Sequence[T]` is preferred over `list[T]` for read-only function parameters.

## Follow-ups

- What is `from __future__ import annotations` and why did Python 3.7 add it?
- What is contravariance (e.g. `Callable[[Animal], None]` vs `Callable[[Dog], None]`)?
