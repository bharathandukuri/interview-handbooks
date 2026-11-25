---
type: concept
title: "Recursion and `@functools.cache` memoization"
difficulty: medium
tags: [functions, recursion, memoization]
---

A recursive function calls itself on a smaller subproblem until it hits a **base case**. Python enforces a default call stack limit (~1000 frames via `sys.getrecursionlimit()`) and does **not** perform tail-call optimization — convert deep linear recursion to an iterative loop.

```python
from functools import cache

@cache   # memoizes results by arguments (Python 3.9+)
def fib(n: int) -> int:
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(50))   # instant O(n) instead of exponential O(2^n)!
```

**When to use `@cache` vs `@lru_cache(maxsize=128)`:**

- `@cache` is unbounded (great for finite DP / recursion trees).
- `@lru_cache(maxsize=128)` evicts old entries when full (safer for long-running services).
- Arguments must be **hashable**; call `fn.cache_clear()` in tests if needed.
