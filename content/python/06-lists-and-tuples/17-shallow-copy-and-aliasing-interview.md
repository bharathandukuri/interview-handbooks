---
type: question
title: "What is the difference between b = a and b = a.copy() for lists?"
difficulty: medium
mostAsked: true
tags: [interview, lists, aliasing, copying]
related: [python.lists-and-tuples.aliasing-and-copying-lists]
revision:
  - "`b = a` creates an **alias** (both names point to the same list object in memory)"
  - "`b = a.copy()` (or `a[:]`) creates a **shallow copy** (new outer list, but nested objects are still shared)"
---

## Answer

`b = a` does **not** copy anything — it binds a second variable name to the **same list object** in memory (**aliasing**). Appending, sorting, or modifying `b` mutates `a` as well.

`b = a.copy()` (identical to `a[:]` or `list(a)`) creates a **shallow copy**: a brand-new outer list containing references to the same elements.

```python
grid = [[1, 2], [3, 4]]
shallow = grid.copy()
shallow.append([5, 6])      # affects ONLY `shallow` (outer list is separate)
shallow[0].append(99)       # affects BOTH `shallow` and `grid` (inner list is shared!)
```

A short answer for an interview: "`b = a` shares the exact same list object. `a.copy()` creates a shallow copy — a new outer list so top-level changes do not leak across, though nested mutable objects inside are still shared unless you use `copy.deepcopy()`."

## Why interviewers ask

Aliasing and shallow copy bugs account for countless real-world state bugs (like passing a list into helper code and accidentally mutating the caller's list, or initializing grids with `[[]] * n`).

## Follow-ups

- What happens when you run `grid = [[0] * 3] * 3` and set `grid[0][0] = 1`?
- How do you make a completely independent copy of nested lists (`copy.deepcopy()`, covered in Chapter 14)?
