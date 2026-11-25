---
type: concept
title: "Tuples: fixed sequences that cannot change size"
difficulty: easy
tags: [tuples, immutability, edge-cases]
related:
  [python.lists-and-tuples.what-is-a-list, python.strings.strings-never-change]
revision:
  - "A **tuple** (`(1, 2)`) is an ordered, **immutable** sequence — you cannot append, pop, or reassign slots"
  - "The **comma**, not parentheses, creates a tuple: `(5,)` is a 1-item tuple, whereas `(5)` is just `int 5`"
  - "**Edge case:** if a tuple holds a mutable list `t = ([1], 'a')`, you can mutate `t[0].append(2)` even though `t[0] = ...` raises `TypeError`"
---

A **tuple** is like a locked-in list: it keeps items in order (`point[0]`, slicing `t[1:]`, `len(t)`, `in`), **but** once created you cannot add, remove, or replace elements (**immutable**).

```python
point = (10, 20)
coords = 3, 4              # parentheses are optional when commas are present!
empty = ()                 # empty tuple (0 items)
single = (5,)              # trailing comma REQUIRED for a 1-element tuple!
not_tuple = (5)            # just integer 5!

print(point[0], len(point))
print(type(single), type(not_tuple))
```

The screen shows:

```text
10 2
<class 'tuple'> <class 'int'>
```

**Two subtle tuple edge cases:**

1. **Single-element comma trap:** `(5)` is just math grouping around `5` (`int`). You **must** include a trailing comma `(5,)` (or `5,`) to create a 1-item tuple!
2. **Tuple holding a mutable list:** A tuple locks only its **references**, not the contents inside mutable items! If `box = ([1, 2], "ok")`, then `box[0] = []` fails with `TypeError`, **but** `box[0].append(3)` succeeds (`([1, 2, 3], 'ok')`)!
