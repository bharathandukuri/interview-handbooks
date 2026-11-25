---
type: problem
title: "Lazy `chunked` Batch Generator"
difficulty: medium
complexity:
  time: "O(n)"
  space: "O(size)"
approach: "iter() + itertools.islice"
tags: [generators, itertools, streaming]
---

## Problem

Write a generator `chunked(iterable, size)` that yields tuples of up to `size` items at a time from **any** iterable (including infinite generators), without loading the whole iterable into memory.

```
Input:  list(chunked(range(7), 3))
Output: [(0, 1, 2), (3, 4, 5), (6,)]
```

## Hint

- Obtain a single iterator via `it = iter(iterable)` so each slice advances the same stream.
- `tuple(islice(it, size))` pulls at most `size` items per batch. (Note: Python 3.12 added `itertools.batched` for this!)

## Solution

```python
from collections.abc import Iterable, Iterator
from itertools import islice
from typing import TypeVar

T = TypeVar("T")

def chunked(iterable: Iterable[T], size: int) -> Iterator[tuple[T, ...]]:
    if size <= 0:
        raise ValueError("size must be positive")
    it = iter(iterable)
    while batch := tuple(islice(it, size)):
        yield batch
```

## Walkthrough

Calling `it = iter(iterable)` once ensures `islice(it, size)` consumes sequentially rather than restarting from the beginning. The walrus operator `:=` grabs the next tuple of up to `size` items and stops cleanly as soon as `islice` returns an empty tuple `()`.
