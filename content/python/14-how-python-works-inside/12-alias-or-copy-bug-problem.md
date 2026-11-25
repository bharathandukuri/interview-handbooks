---
type: problem
title: "Chapter challenge: Detect aliasing and clone 2D grids safely"
difficulty: medium
complexity:
  time: "O(rows * cols) for clone / O(rows) to detect row aliasing"
  space: "O(rows * cols) for the independent matrix copy"
approach: "Check outer identity and inner row identity (`row_a is row_b`) cleanly, and build fresh inner lists rather than shallow copying or [[0]*cols]*rows"
tags: [internals, copying, aliasing, interview]
related:
  [
    python.how-python-works-inside.shallow-vs-deep-copy,
    python.lists-and-tuples.shallow-copy-and-aliasing-interview,
  ]
---

## Problem

1. Write `make_grid(rows, cols, fill=0)` returning an independent `rows x cols` 2D list (guard `rows < 0` or `cols < 0` with `ValueError`; avoid the classic `[[fill] * cols] * rows` bug!).
2. Write `classify_matrix_copy(a, b)` that compares two matrices `a` and `b` and returns:
   - `"alias"` if `a is b`
   - `"shallow"` if `a is not b` **yet** at least one nested mutable row is still shared (`any(ra is rb for ra, rb in zip(a, b))` and `len(a) > 0`)
   - `"independent"` otherwise (`copy.deepcopy(a)` or freshly built!).

## Hint

- `[[fill for _ in range(cols)] for _ in range(rows)]` builds a separate list per row!
- Watch the edge case when `a` and `b` are empty `[]`: `a is not b` -> `[]` has no inner shared lists, so `[]` copied via `.copy()` is `"independent"`.

## Solution

```python
import copy

def make_grid(rows, cols, fill=0):
    if rows < 0 or cols < 0:
        raise ValueError("dimensions must be >= 0")
    return [[fill for _ in range(cols)] for _ in range(rows)]

def classify_matrix_copy(a, b):
    if a is b:
        return "alias"
    if any(ra is rb for ra, rb in zip(a, b)):
        return "shallow"
    return "independent"

grid = make_grid(2, 3, fill=0)
grid[0][1] = 7                      # only row 0 changes!
print("grid:", grid)
print("same ref:  ", classify_matrix_copy(grid, grid))
print("grid.copy:", classify_matrix_copy(grid, grid.copy()))
print("deepcopy:  ", classify_matrix_copy(grid, copy.deepcopy(grid)))
```

## Walkthrough

Notice how `classify_matrix_copy` makes Python's three copy levels tangible:

- `grid` vs `grid` shares the outer list -> `"alias"`.
- `grid.copy()` creates a _new_ outer list, **but** both outer lists hold pointers to the exact same inner row objects (`ra is rb` is `True`) -> `"shallow"`.
- `copy.deepcopy(grid)` creates brand-new inner row objects too (`ra is rb` is `False`) -> `"independent"`.

And remember `make_grid(0, 3)` cleanly returns `[]` rather than crashing!
