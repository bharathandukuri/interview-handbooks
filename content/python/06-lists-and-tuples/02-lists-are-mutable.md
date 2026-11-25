---
type: concept
title: "Lists are mutable: editing, inserting, and deleting in place"
difficulty: easy
mostAsked: true
tags: [lists, mutability, slicing]
related:
  [python.strings.strings-never-change, python.lists-and-tuples.what-is-a-list]
revision:
  - "Lists are **mutable**: you can change elements in place (`nums[0] = 99`) without creating a new list"
  - "**Slice assignment** (`nums[1:3] = [20, 30]`) can replace, shrink, or grow parts of a list"
  - "`del nums[i]` removes by index in place; `.pop(i)` removes and **returns** the element"
---

Unlike strings (which are immutable), lists are **mutable**: you can modify individual elements, swap slices, add items, and delete items **directly inside the existing list**.

```python
nums = [10, 20, 30, 40]
nums[0] = 99              # edit single slot in place -> [99, 20, 30, 40]
nums[1:3] = [200]         # slice assignment shrinks! -> [99, 200, 40]
del nums[1]               # delete index 1 -> [99, 40]
print(nums)
```

The screen shows:

```text
[99, 40]
```

**How slice assignment behaves:**

- Replacing a slice (`nums[1:3] = [200]`) swaps elements `1` and `2` with `[200]`, even changing the list's length!
- Deleting with `del` vs `.pop()`: `del nums[1]` removes an item without returning it (you can even `del nums[1:3]` to delete a slice). Use `nums.pop(1)` when you want to **save and use** the removed value (`last = nums.pop()`).

**Edge case:** Trying to assign to a non-existent single index (`nums[10] = 5`) raises `IndexError` — use `.append()` to grow a list instead.
