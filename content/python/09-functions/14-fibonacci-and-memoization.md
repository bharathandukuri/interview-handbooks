---
type: problem
title: "Chapter challenge: Fibonacci sequence (slow recursion vs memoization vs loop)"
difficulty: medium
mostAsked: true
complexity:
  time: "O(2^n) naive recursion -> O(n) with memoization or loop"
  space: "O(n) with memo dict / O(1) extra space with loop"
approach: "Cache already-computed subproblems in a dict (memoization), or track only the last two values in a loop"
tags: [functions, recursion, memoization, interview]
related:
  [
    python.functions.recursion-basics,
    python.functions.mutable-default-argument-pitfall,
  ]
revision:
  - "Naive `fib(n-1) + fib(n-2)` repeats work exponentially in **`O(2^n)`** time"
  - "**Memoization** stores solved subproblems in a dict, dropping time to **`O(n)`**"
  - "An **iterative loop** tracking `(a, b)` reaches **`O(n)` time and `O(1)` space** with no stack limit"
---

## Problem

Write `fib(n)` to return the `n`-th **Fibonacci number**, where:

- `fib(0) == 0`
- `fib(1) == 1`
- Every number after that is the sum of the previous two (`0, 1, 1, 2, 3, 5, 8, 13, 21, ...`).
- Guard invalid `n < 0` with `ValueError`.

Show why naive recursion becomes slow around `n = 40`, and fix it using **both** memoization (`dict`) and an `O(1)`-space loop!

## Hint

- In naive recursion `fib(n - 1) + fib(n - 2)`, computing `fib(5)` computes `fib(3)` twice and `fib(2)` three times!
- Pass or wrap a **`memo` dictionary** (`{0: 0, 1: 1}`) — remember never to use `memo={}` directly as a default parameter!
- For the loop version, track two variables `prev, curr = 0, 1` and advance `prev, curr = curr, prev + curr` `n` times.

## Solution

```python
# 1. Slow naive recursion: O(2^n) time
def fib_slow(n):
    if n < 0:
        raise ValueError("n must be >= 0")
    if n <= 1:
        return n
    return fib_slow(n - 1) + fib_slow(n - 2)

# 2. Fast recursion with memoization: O(n) time, O(n) space
def fib_memo(n, memo=None):
    if n < 0:
        raise ValueError("n must be >= 0")
    if memo is None:
        memo = {0: 0, 1: 1}
    if n not in memo:
        memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]

# 3. Best for production: O(n) time, O(1) space, no stack limit
def fib_iter(n):
    if n < 0:
        raise ValueError("n must be >= 0")
    prev, curr = 0, 1
    for _ in range(n):
        prev, curr = curr, prev + curr
    return prev

print("fib_slow(8):", fib_slow(8))
print("fib_memo(50):", fib_memo(50))
print("fib_iter(0), fib_iter(1), fib_iter(50):", fib_iter(0), fib_iter(1), fib_iter(50))
```

## Walkthrough

Notice how `fib_slow(50)` would make over **2^50** (over a quadrillion!) calls and hang your computer, whereas `fib_memo(50)` computes each `k` from `2` to `50` **only once** and finishes instantly!

Look at two subtle Python details in the optimal versions:

1. **Why `memo=None`?** Using `memo={0: 0, 1: 1}` as a default parameter works by accident for pure math caches, **but** leaks memory globally across unrelated calls and confuses tests; using `memo=None` initializes a clean dictionary per top-level call (we will also see `@functools.cache` in Chapter 11!).
2. **Why `return prev` in `fib_iter`?** When `n = 0`, the loop runs `0` times and `prev` is `0`. When `n = 1`, one step turns `(0, 1)` into `(1, 1)` so `prev` is `1`. Simultaneous tuple unpacking (`prev, curr = curr, prev + curr`) uses the _old_ `curr` and `prev` on the right before rebinding either name, so you do not need a temporary variable.
