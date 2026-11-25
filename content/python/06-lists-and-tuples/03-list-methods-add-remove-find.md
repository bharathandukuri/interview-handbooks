---
type: concept
title: "Essential list methods: add, remove, search, and sort"
difficulty: easy
tags: [lists, methods, sorting]
related: [python.lists-and-tuples.lists-are-mutable]
revision:
  - "`.append(x)` adds to the end; `.insert(i, x)` inserts at index `i`; `.extend(items)` adds multiple elements"
  - "`.pop(i)` removes by index (default last); `.remove(val)` removes the **first** matching value (`ValueError` if missing)"
  - "`.sort()` sorts **in place and returns `None`** — use `sorted(nums)` for a new sorted copy"
---

Lists include built-in methods that modify the list in place (and almost all modifying methods return **`None`**):

```python
nums = [3, 1, 4, 1]
nums.append(5)          # [3, 1, 4, 1, 5]
nums.insert(1, 9)       # [3, 9, 1, 4, 1, 5] (shifts later items right)
nums.remove(1)          # removes ONLY the FIRST 1 -> [3, 9, 4, 1, 5]
last = nums.pop()       # removes & returns 5 -> nums is [3, 9, 4, 1]
nums.sort()             # sorts in place -> [1, 3, 4, 9]
print(nums, "popped:", last)
```

The screen shows:

```text
[1, 3, 4, 9] popped: 5
```

**Key methods and edge cases:**

- **Searching:** `nums.index(4)` returns index `2` (or `ValueError` if missing — check `if 4 in nums:` first!); `nums.count(1)` counts matches.
- **`.remove(val)` missing value edge case:** `nums.remove(99)` raises `ValueError: list.remove(x): x not in list`.
- **`.pop()` on empty list:** `[].pop()` raises `IndexError: pop from empty list`.
- **`.reverse()` vs `[::-1]`:** `nums.reverse()` flips the list in place; `nums[::-1]` makes a reversed copy.
- **`.clear()`:** Empties the list in place (`nums.clear()` -> `[]`), keeping any existing variable references intact.
