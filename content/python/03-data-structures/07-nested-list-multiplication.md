---
type: pitfall
title: "Nested list multiplication (`[[]] * 3`)"
difficulty: medium
tags: [lists, aliasing, pitfalls]
---

## The trap

```python
grid = [[0] * 3] * 3
grid[0][1] = 9
print(grid)
# [[0, 9, 0], [0, 9, 0], [0, 9, 0]]  ← all 3 rows changed!
```

## The fix

```python
grid = [[0] * 3 for _ in range(3)]
grid[0][1] = 9
print(grid)
# [[0, 9, 0], [0, 0, 0], [0, 0, 0]]
```

## Why it happens

Sequence multiplication (`seq * 3`) repeats **references** to the exact same object — it does not copy nested mutable objects. `[0] * 3` is safe only because `0` (an `int`) is immutable. When you multiply `[[0, 0, 0]] * 3`, all three outer slots point to the same single inner list in memory. A list comprehension evaluates `[0] * 3` freshly on every iteration.
