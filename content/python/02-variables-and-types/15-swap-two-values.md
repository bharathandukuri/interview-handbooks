---
type: problem
title: "Swap two variables cleanly"
difficulty: easy
complexity:
  time: "Instant (O(1))"
  space: "Tiny (O(1))"
approach: "Use Python tuple unpacking (a, b = b, a) instead of overwriting one value early"
tags: [variables, swap, practice]
related: [python.variables-and-types.assign-many-at-once]
---

## Problem

You start with two variables (test with both different values and edge cases like identical values):

```python
a = 5
b = 9
```

Swap their values so `a` holds `9` and `b` holds `5`, then print both on one line:

```text
9 5
```

## Hint

- Why does writing `a = b` followed by `b = a` fail? Because line 1 erases `a`'s old `5` before line 2 reads `a`, leaving both as `9`!
- In Python, unpack in one step: `a, b = b, a` (works equally well for strings, floats, or even two variables of different types!).

## Solution

```python
a = 5
b = 9

a, b = b, a
print(a, b)

# Edge case check: swapping mixed types or identical values works cleanly too!
x, y = "first", 42
x, y = y, x
print(x, y)
```

## Walkthrough

On `a, b = b, a`, Python evaluates the entire right side **`b, a`** first into a temporary 2-item pair `(9, 5)`, **before** assigning anything on the left. Only then does it bind `a = 9` and `b = 5`.

In C, Java, or older code, swapping needs a third temporary variable (`temp = a; a = b; b = temp`) to avoid losing `a` — knowing both shows why tuple unpacking makes Python swaps concise and bug-free!
