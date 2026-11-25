---
type: concept
title: "Aliasing vs shallow copying (and the [[]] * 3 trap)"
difficulty: medium
mostAsked: true
tags: [lists, copying, memory, edge-cases]
related: [python.lists-and-tuples.lists-are-mutable]
revision:
  - "`b = a` creates an **alias** (same list in memory); `b = a.copy()` or `a[:]` creates a **shallow copy**"
  - "A **shallow copy** creates a new outer list, **but nested inner lists inside are still shared**"
  - "Never create a grid with `[[0] * 3] * 3` — all rows share the exact same inner list!"
---

Because lists are mutable, assigning `b = a` does **not** copy the list — both names point to the exact same list in memory (**aliasing**).

To duplicate a flat list independently, make a **shallow copy** with `a.copy()`, `a[:]`, or `list(a)`:

```python
a = [1, 2, 3]
alias = a               # points to the SAME list
copy_a = a.copy()       # brand-new outer list (`a[:]` does the exact same thing)

a.append(4)
print("alias:", alias)  # [1, 2, 3, 4] (changed!)
print("copy:", copy_a)  # [1, 2, 3]    (untouched!)
```

The screen shows:

```text
alias: [1, 2, 3, 4]
copy: [1, 2, 3]
```

**Two vital nested-list edge cases:**

1. **Shallow copy shares nested lists:** If `grid = [[1, 2], [3, 4]]`, calling `g2 = grid.copy()` creates a new outer list, **but `g2[0]` still points to the same inner `[1, 2]` list**! Changing `g2[0].append(9)` mutates `grid[0]` too (Chapter 14 shows `copy.deepcopy()` to duplicate inner layers).
2. **`[[]] * 3` shares one list 3 times:** `rows = [[0] * 3] * 3` repeats references to the **exact same row**! Modifying `rows[0][0] = 9` changes all 3 rows! Always build grids with a loop (or list comprehension in Chapter 8).
