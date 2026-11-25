---
type: concept
title: "Lists in depth and Big-O operations"
difficulty: easy
tags: [lists, data-structures, complexity]
---

A Python `list` is a **dynamic array of object pointers** (it over-allocates capacity so `.append()` is amortized O(1)).

```python
nums = [3, 1, 4]
nums.append(1)           # [3, 1, 4, 1] — O(1) amortized
nums.extend([5, 9])      # adds each item — O(k)
nums.pop()               # removes & returns last item — O(1)
nums.insert(0, 99)       # shifts all elements right — O(n)!

ordered = sorted(nums)   # returns a NEW sorted list (works on any iterable)
nums.sort(reverse=True)  # sorts in place and returns None
```

| Operation                             | Average Big-O  | Notes                                      |
| ------------------------------------- | -------------- | ------------------------------------------ |
| `lst[i]`, `lst.append()`, `lst.pop()` | **O(1)**       | Fast random access & tail stack ops        |
| `lst.insert(0, x)`, `lst.pop(0)`      | **O(n)**       | Use `collections.deque` for O(1) left ops  |
| `x in lst`, `lst.remove(x)`           | **O(n)**       | Linear scan; use `set` for O(1) membership |
| `lst.sort()` / `sorted(lst)`          | **O(n log n)** | Timsort (hybrid merge + insertion sort)    |

:::tip[`sort()` returns `None`]
Never write `x = lst.sort()` — `x` becomes `None`. Use `sorted(lst)` if you need a new sorted list.
:::
