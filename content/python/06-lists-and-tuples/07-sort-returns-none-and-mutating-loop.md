---
type: pitfall
title: "x = nums.sort() gives None (and removing while looping skips items)"
difficulty: medium
mostAsked: true
tags: [lists, sorting, loops, gotchas]
related: [python.lists-and-tuples.list-methods-add-remove-find]
revision:
  - "`.sort()` and `.reverse()` mutate in place and return **`None`** — never write `nums = nums.sort()`"
  - "Calling `.remove()` on the same list you are looping over shifts indices and silently skips items"
---

## The trap

```python
# Trap 1: saving the return value of .sort()
nums = [3, 1, 2]
ordered = nums.sort()
print(ordered)         # None!

# Trap 2: deleting from a list while iterating over it
vals = [2, 4, 6, 7]
for v in vals:
    if v % 2 == 0:
        vals.remove(v)
print(vals)            # [4, 7]! (4 got skipped!)
```

## The fix

```python
# Fix 1: call nums.sort() alone, OR use sorted(nums) for a new list
nums = [3, 1, 2]
ordered = sorted(nums)     # [1, 2, 3], nums untouched

# Fix 2: build a new list, or loop over a slice copy `vals[:]`
vals = [2, 4, 6, 7]
clean = []
for v in vals:
    if v % 2 != 0:
        clean.append(v)
print(clean)               # [7]
```

## Why it happens

1. Python returns `None` from in-place list methods (`.sort()`, `.reverse()`, `.append()`) on purpose as a loud signal that the list itself changed rather than making a copy.
2. In Trap 2, `for v in vals:` steps internally by index `0, 1, 2...`. Removing `2` at index `0` shifts `4` left into index `0`, so when the loop advances to index `1`, it lands on `6` and **skips `4`**! Loop over a shallow copy `vals[:]` or append kept items to a new list.
