---
type: problem
title: "Factorial: recursive vs iterative"
difficulty: easy
complexity:
  time: "O(n) multiplications"
  space: "O(n) call stack (recursive) / O(1) extra space (iterative)"
approach: "Multiply from 1 to n in a loop, or recurse n * factorial(n - 1) with base cases 0 and 1"
tags: [functions, recursion, math, practice]
related:
  [
    python.functions.recursion-basics,
    python.functions.fibonacci-and-memoization,
  ]
---

## Problem

Write a function `factorial(n)` that returns $n!$ (the product `1 * 2 * ... * n`) for any non-negative integer `n >= 0`. By mathematical definition, `0! == 1`. If `n < 0`, stop immediately with `ValueError`.

Write **both** a recursive version and an iterative (`for` loop) version.

```text
factorial(0)  -> 1
factorial(1)  -> 1
factorial(5)  -> 120    # 5 * 4 * 3 * 2 * 1
factorial(-2) -> raises ValueError
```

## Hint

- Handle edge cases at the top: `if n < 0: raise ValueError(...)` (`raise` reports invalid input immediately — we cover errors in Chapter 10) and `if n <= 1: return 1`.
- Recursive step: `return n * factorial_rec(n - 1)`.
- Iterative step: start `result = 1` and multiply by every integer from `2` up to `n` inclusive (`range(2, n + 1)`).

## Solution

```python
def factorial_rec(n):
    if n < 0:
        raise ValueError("n must be >= 0")
    if n <= 1:                        # base cases: 0! = 1 and 1! = 1
        return 1
    return n * factorial_rec(n - 1)   # recursive case

def factorial_iter(n):
    if n < 0:
        raise ValueError("n must be >= 0")
    result = 1
    for i in range(2, n + 1):         # handles n=0 and n=1 automatically (empty range!)
        result *= i
    return result

print("rec(0):", factorial_rec(0), "rec(5):", factorial_rec(5))
print("iter(0):", factorial_iter(0), "iter(6):", factorial_iter(6))
```

## Walkthrough

Both versions return `1` for `n == 0` and `n == 1`, and guard negative numbers before looping or recursing (without `if n < 0:`, `factorial_rec(-1)` would keep subtracting forever until crashing with `RecursionError`!).

Compare the two implementations:

- **`factorial_rec(n)`** matches the mathematical formula closely (`O(n)` time, `O(n)` call-stack space). However, calling `factorial_rec(1500)` crashes with `RecursionError` because Python keeps 1500 stack frames open.
- **`factorial_iter(n)`** runs in `O(n)` time and `O(1)` extra space, works easily for large `n` like `1500`, and takes advantage of Python's arbitrary-precision integers (integers never overflow!).
- Extra edge case to keep in mind: if callers might pass floats (`3.5`) or booleans (`True`), check `if isinstance(n, bool) or not isinstance(n, int):` (remember in Python `isinstance(True, int)` is `True` because `bool` inherits from `int`).
