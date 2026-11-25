---
type: concept
title: "Iterables vs Iterators (__iter__, __next__, and StopIteration)"
difficulty: medium
mostAsked: true
tags: [iterators, protocol, dunder, internals]
related: [python.oop.dunder-methods-and-hashability]
revision:
  - "An **iterable** implements `__iter__()` and returns an iterator (examples: `list`, `str`, `dict`, `range`)"
  - "An **iterator** implements **both** `__iter__()` (returning `self`) and `__next__()` (returning the next value or raising `StopIteration`)"
  - "Every iterator is an iterable, **but** iterators are **single-use** — once exhausted, `next()` keeps raising `StopIteration`"
---

Whenever Python runs `for item in collection:`, it does **not** use indexing (`collection[i]`) — that is why `for` loops work cleanly on unordered `set`s, files, and infinite streams! Instead, Python follows the **iterator protocol**:

1. Calls **`iter(collection)`** (which calls `collection.__iter__()`) to obtain an **iterator** object.
2. Repeatedly calls **`next(iterator)`** (which calls `iterator.__next__()`) to get the next element.
3. Stops cleanly when `__next__()` raises **`StopIteration`**.

```python
class CountDown:
    """Custom iterator counting down from `start` to 1."""
    def __init__(self, start):
        self.current = start

    def __iter__(self):                 # iterators MUST return self from __iter__!
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value

it = iter([10, 20])
print("manual next:", next(it), next(it), next(it, "DONE"))   # default fallback avoids StopIteration!
print("countdown:", list(CountDown(4)))
print("range is iterable, NOT an iterator:", iter(range(3)) is range(3))
print("an iterator returns self:", iter(it) is it)
```

The screen shows:

```text
manual next: 10 20 DONE
countdown: [4, 3, 2, 1]
range is iterable, NOT an iterator: False
an iterator returns self: True
```

**Why this distinction matters:**

- **`range(1_000_000)` is a reusable iterable:** Calling `iter(r)` produces a _brand-new_ iterator cursor every time, so you can loop over a `list`, `tuple`, or `range` ten times in a row!
- **Iterators (`iter(...)`, open files, `zip(...)`, `map(...)`, generators) are one-shot cursors:** Once drained, calling `list(it)` a second time returns `[]`! (To let a custom collection be looped repeatedly, keep `__iter__` returning a _fresh_ iterator object instead of mixing state into the container itself.)
- **Tip (`next(it, default)`):** Passing a second fallback argument like `next(it, None)` returns `None` instead of crashing with `StopIteration` when an iterator is empty!
