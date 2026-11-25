---
type: concept
title: "The iteration protocol (`__iter__` and `__next__`)"
difficulty: medium
mostAsked: true
tags: [iterators, protocol, oop]
revision:
  - "An **iterable** implements `__iter__()`; an **iterator** implements both `__iter__()` (returning `self`) and `__next__()`"
  - "Iterators are stateful and single-pass; raising `StopIteration` signals exhaustion"
  - "`for x in obj` simply calls `it = iter(obj)` and loops `next(it)` until `StopIteration`"
---

Every `for` loop in Python runs on two methods:

- **Iterable** (e.g., `list`, `str`, `dict`): has `__iter__()`, which returns a fresh **iterator**.
- **Iterator** (e.g., `iter(nums)`, file handle, generator): has `__next__()` returning the next value (or raising `StopIteration`) and `__iter__()` returning `self`.

```python
class Countdown:
    def __init__(self, start: int) -> None:
        self.curr = start

    def __iter__(self) -> "Countdown":
        return self

    def __next__(self) -> int:
        if self.curr <= 0:
            raise StopIteration
        val = self.curr
        self.curr -= 1
        return val
```

You can also create an iterator from any zero-arg callable + sentinel: `iter(lambda: f.read(4096), b"")` stops cleanly when `b""` is returned.
