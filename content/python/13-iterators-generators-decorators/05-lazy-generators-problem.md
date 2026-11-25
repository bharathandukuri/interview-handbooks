---
type: problem
title: "Lazy infinite Fibonacci & chunked batch generators"
difficulty: medium
complexity:
  time: "O(1) per yielded item / O(n) total over n elements"
  space: "O(1) for infinite stream / O(k) buffer for chunk size k"
approach: "Yield values lazily with while True for infinite series, and slice/accumulate batches of size k cleanly without loading everything into RAM"
tags: [generators, yield, streaming, practice]
related:
  [
    python.iterators-generators-decorators.generators-and-yield,
    python.functions.fibonacci-and-memoization,
  ]
---

## Problem

1. Write a lazy infinite generator `fib_stream()` yielding Fibonacci numbers `0, 1, 1, 2, 3, 5, 8, ...` forever in **`O(1)` memory**, and inspect the first 8 using `itertools.islice`.
2. Write a generator `chunked(iterable, size)` that yields elements in fixed-size lists/tuples of length `size`, handling any leftover tail cleanly (for example `[1, 2, 3, 4, 5]` with `size=2` -> `[1, 2], [3, 4], [5]`), works with _any_ iterator (not just lists!), and rejects `size <= 0` with `ValueError` **immediately when called** (not only when iterated!).

## Hint

- **Subtle edge case on step 2:** If you put `if size <= 0: raise ValueError(...)` directly inside a generator function containing `yield`, the validation does **not** run until `next(...)` is called! Either wrap validation in an outer regular function returning an inner generator, OR check `itertools.batched` (introduced natively in Python 3.12!).
- Here let us build `chunked(iterable, size)` from scratch with eager argument validation and `O(size)` batch memory!

## Solution

```python
from itertools import islice

def fib_stream():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

def chunked(iterable, size):
    if isinstance(size, bool) or not isinstance(size, int) or size <= 0:
        raise ValueError("size must be a positive integer")
    def _gen():
        it = iter(iterable)
        while batch := tuple(islice(it, size)):
            yield batch
    return _gen()

print("First 8 fib:", list(islice(fib_stream(), 8)))
print("Chunks of 2:", list(chunked([1, 2, 3, 4, 5], 2)))
print("Empty input:", list(chunked([], 3)))
```

## Walkthrough

Notice a super important real-world generator nuance solved by `_gen()`:

- Normally, putting `if size <= 0: raise ValueError(...)` inside a function containing `yield` silently delays the error until someone iterates! Splitting the eager validation into the outer `chunked()` function and returning `_gen()` guarantees `chunked(data, 0)` fails **immediately** at the call site!
- Using `tuple(islice(it, size))` with the walrus operator works on files, other generators, sets, or lists in `O(size)` memory — **without** calling `len(iterable)`! (And in Python 3.12+, `itertools.batched(iterable, size)` provides this cleanly in C!)
