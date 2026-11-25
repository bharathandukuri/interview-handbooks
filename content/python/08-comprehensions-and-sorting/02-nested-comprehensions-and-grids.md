---
type: concept
title: "Nested comprehensions: flattening and safe 2D grids"
difficulty: medium
tags: [comprehensions, lists, edge-cases]
related:
  [
    python.comprehensions-and-sorting.list-comprehensions,
    python.lists-and-tuples.aliasing-and-copying-lists,
  ]
revision:
  - "Multi-loop comprehensions read **left to right** in the exact same order as nested `for` loops"
  - "Use `[[0] * cols for _ in range(rows)]` to create an independent 2D grid without shared rows"
---

Comprehensions can include two `for` clauses — and they solve the famous `[[0] * 3] * 3` shared-row bug cleanly!

**1. Safe 2D grid creation:** Writing an inner expression `[0] * 3` **before** `for` creates a **brand-new independent list** on each iteration:

```python
grid = [[0] * 3 for _ in range(3)]
grid[0][1] = 9
print(grid)       # only row 0 changes!
```

**2. Flattening a 2D list:** When chaining `for` clauses, write them in the **exact same outer-to-inner order** as regular nested loops:

```python
matrix = [[1, 2], [3, 4], [5, 6]]
flat = [val for row in matrix for val in row if val % 2 == 0]
print(flat)
```

The screen shows:

```text
[[0, 9, 0], [0, 0, 0], [0, 0, 0]]
[2, 4, 6]
```

**Readability edge case:** Stop at 2 `for` clauses. Anything deeper (3 nested loops or multiple complex conditions) is much easier for teammates to read and debug as a regular indented `for` loop!
