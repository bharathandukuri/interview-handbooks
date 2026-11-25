---
type: pitfall
title: "Exhausted generator on second pass"
difficulty: easy
mostAsked: true
tags: [generators, pitfalls, iteration]
revision:
  - "A generator can be iterated **only once** — a second loop silently yields zero items"
  - "Convert to a `list`/`tuple` if you need multiple passes, or return a fresh generator from a function"
---

## The trap

```python
nums = (x * 2 for x in range(4))
print("Sum:", sum(nums))    # Sum: 12
print("Max:", max(nums))    # ValueError: max() iterable argument is empty!
```

## The fix

```python
# Option 1: Materialize once if it fits in memory and you need multiple passes
nums = [x * 2 for x in range(4)]
print("Sum:", sum(nums), "Max:", max(nums))

# Option 2: Compute both in a single pass, or wrap in a reusable iterable class
```

## Why it happens

Generators are **one-shot iterators**. `sum(nums)` consumes the generator all the way to `StopIteration`. Any later `for`, `list()`, or `max()` sees an already-exhausted iterator and stops immediately with no items.
