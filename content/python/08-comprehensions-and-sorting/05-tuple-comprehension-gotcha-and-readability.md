---
type: pitfall
title: "(x for x in items) is NOT a tuple, and [print(x) for x in items] wastes memory"
difficulty: medium
mostAsked: true
tags: [comprehensions, tuples, generators, gotchas]
related: [python.comprehensions-and-sorting.list-comprehensions]
revision:
  - "There is **no tuple comprehension**: `(x for x in items)` creates a lazy **generator object**!"
  - "Wrap with `tuple(...)` if you truly want a tuple: `tuple(x * 2 for x in nums)`"
  - "Never write `[print(x) for x in items]` for side effects — it creates a useless list of `None`s"
---

## The trap

```python
# Trap 1: expecting `(x * 2 for x in nums)` to build a tuple
t = (x * 2 for x in [1, 2, 3])
print(t)               # <generator object ...> NOT (2, 4, 6)!

# Trap 2: using a list comprehension purely for side effects
res = [print("Hi", name) for name in ["Ada", "Bob"]]
print(res)             # [None, None] wasted in memory!
```

## The fix

```python
# Fix 1: pass the expression straight to tuple(...)
t = tuple(x * 2 for x in [1, 2, 3])
print(t)               # (2, 4, 6)

# Fix 2: use a plain for loop when you only want an action (like print)
for name in ["Ada", "Bob"]:
    print("Hi", name)
```

## Why it happens

1. Python uses round parentheses `(x for x in ...)` for **generator expressions** (covered fully in Chapter 13!), which compute items lazily one by one instead of storing a tuple. Passing a generator to `tuple(...)` materializes all values into `(2, 4, 6)`.
2. A list comprehension _always_ builds a `list` of return values. Since `print()` returns `None`, `[print(x) ...]` allocates a list filled with `[None, None, ...]` and immediately throws it away — harder to read and wasteful!
