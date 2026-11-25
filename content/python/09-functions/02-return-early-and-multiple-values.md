---
type: concept
title: "Early returns, guard clauses, and returning multiple values"
difficulty: easy
tags: [functions, return, control-flow, patterns]
related:
  [
    python.functions.defining-and-calling-functions,
    python.lists-and-tuples.tuple-unpacking,
  ]
revision:
  - "`return` exits the function immediately — code below it in the same branch never runs"
  - "**Guard clauses** handle invalid/edge inputs at the top with early `return` to keep code flat"
  - "`return a, b` packs a **tuple** automatically so callers can unpack `lo, hi = min_max(nums)`"
---

As soon as Python executes a `return` line inside a function, the function finishes immediately and hands the result back to the caller.

**1. Returning multiple values (actually returns one tuple!):**

```python
def min_and_max(nums):
    if not nums:                      # guard clause for empty list edge case
        return None, None
    return min(nums), max(nums)       # Python packs a tuple (1, 9) automatically

lo, hi = min_and_max([4, 1, 9, 2])
print("lo:", lo, "hi:", hi)
print("empty:", min_and_max([]))
```

**2. Guard clauses (early returns):** Instead of wrapping your entire function in nested `if / else` blocks, validate bad inputs at the top and return early:

```python
def discount_price(price, percent):
    if price < 0 or percent < 0:
        return None                   # early exit!
    return round(price * (1 - percent / 100), 2)

print(discount_price(100, 20), discount_price(-5, 10))
```

The screen shows:

```text
lo: 1 hi: 9
empty: (None, None)
80.0 None
```

Notice that once `if not nums: return None, None` triggers, Python never executes `min([])` (which would crash with `ValueError`!).
