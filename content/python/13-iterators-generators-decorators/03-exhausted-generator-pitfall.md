---
type: pitfall
title: "Exhausted generators silently returning empty on second loop"
difficulty: easy
mostAsked: true
tags: [generators, iterators, gotchas, bugs]
related: [python.iterators-generators-decorators.generators-and-yield]
revision:
  - "Generators, `map()`, `filter()`, and `zip()` are **single-pass iterators** — they exhaust after one full loop or `len`/`list`/`sum` call"
  - "Calling `len(gen)` raises `TypeError`; inspecting a generator by printing `list(gen)` drains it before real work runs!"
---

## The trap

```python
nums = (x * 2 for x in [1, 2, 3, 4])

print("Count > 4:", sum(1 for x in nums if x > 4))   # consumes ALL of `nums`!
print("Total sum:", sum(nums))                       # 0! (silently empty!)
```

## The fix

```python
# Option 1: Materialize into a tuple/list if small and needed multiple times:
nums_tuple = tuple(x * 2 for x in [1, 2, 3, 4])
print("Count > 4:", sum(1 for x in nums_tuple if x > 4))
print("Total sum:", sum(nums_tuple))

# Option 2: Wrap creation in a generator function/iterable class for fresh passes:
def doubled(items):
    for x in items:
        yield x * 2

print("Fresh pass:", list(doubled([1, 2, 3])))
```

## Why it happens

A generator expression `(x * 2 for x in ...)` — just like `zip(...)`, `map(...)`, `filter(...)`, or an open file handle — does **not** store elements in memory; it moves a one-way cursor forward. Once the first consumer (`sum(...)`, `any(...)`, `list(...)`, or a `for` loop) reaches the end, the cursor stays at the end forever! Any second loop sees zero items and silently returns `0` or `[]` instead of raising an error.
