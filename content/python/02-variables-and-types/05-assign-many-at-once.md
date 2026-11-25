---
type: concept
title: "Multiple assignment, swapping, and unpacking edge cases"
difficulty: easy
tags: [variables, assignment, unpacking, basics]
revision:
  - "`x, y = 1, 2` unpacks multiple values in one statement cleanly"
  - "`x, y = y, x` swaps two variables without a temporary helper variable because Python evaluates the whole right side first"
  - "Counts on left and right MUST match (`ValueError` otherwise), and avoid chaining `a = b = []` on changeable collections!"
---

Python lets you assign or update several variables at once cleanly on a single line:

```python
x, y = 1, 2                  # tuple unpacking: x gets 1, y gets 2
a = b = 0                    # chained assignment: both `a` and `b` point to 0
print("Start:", x, y, a, b)

x, y = y, x                  # swap without a temporary helper!
print("Swapped:", x, y)
```

The screen shows:

```text
Start: 1 2 0 0
Swapped: 2 1
```

**Why `x, y = y, x` works without overwriting `x`:**
Python completely evaluates the entire right-hand side (`y, x` -> the pair `(2, 1)`) **before** assigning anything on the left! Only after `(2, 1)` exists in memory does Python bind `x = 2` and `y = 1`.

**Two important edge cases to watch:**

1. **Count mismatch (`ValueError`):** Both sides of `x, y = ...` must have the exact same count of items! Writing `x, y = 1, 2, 3` raises `ValueError: too many values to unpack (expected 2)`, and `x, y, z = 1, 2` raises `ValueError: not enough values to unpack`. (In Chapter 06, you will also learn starred unpacking like `first, *rest = 1, 2, 3, 4`!)
2. **Chained assignment nuance (`a = b = ...`):** Chained assignment like `a = b = 0` or `a = b = "ok"` is completely safe for numbers, booleans, strings, and `None` because those values cannot change. **Never** chain mutable containers (`a = b = []` in Chapter 06) unless you actually want both names modifying the exact same container!
