---
type: problem
title: "Chapter challenge: rotate a list right by k steps"
difficulty: medium
mostAsked: true
complexity:
  time: "Copies n elements once"
  space: "New rotated list of size n"
approach: "Normalize k = k % len(nums), then splice slices [-k:] + [:-k]"
tags: [lists, slicing, modulo, edge-cases, practice]
related:
  [
    python.lists-and-tuples.what-is-a-list,
    python.operators-and-decisions.maths-operators,
  ]
revision:
  - "Normalize `k = k % len(nums)` so rotations bigger than `len(nums)` wrap cleanly"
  - "Guard empty lists first (`if not nums:`) so `% 0` never raises `ZeroDivisionError`, and handle `k == 0`"
---

## Problem

Given a list `nums` and a non-negative integer `k`, rotate the list to the **right** by `k` steps (elements shifting past the end wrap back to the front).

Handle **edge cases**: `nums = []`, `k = 0`, and `k > len(nums)` (like rotating `[1, 2, 3]` by `k = 5`).

```text
nums = [1, 2, 3, 4, 5], k = 2 -> [4, 5, 1, 2, 3]
nums = [1, 2, 3],       k = 5 -> [2, 3, 1]
nums = [],              k = 3 -> []
```

## Hint

- Rotating a list of length `n` by `n` steps brings every item right back to where it started! So `k = k % n` shrinks huge `k` values down into `0 .. n - 1`.
- Guard `if nums:` before taking `% len(nums)` so `[]` avoids `ZeroDivisionError`.
- Watch the `k == 0` slice trap: in Python, `nums[-0:]` means `nums[0:]` (the whole list!), NOT `[]`! Check `if k > 0:` before slicing `nums[-k:] + nums[:-k]`.

## Solution

```python
nums = [1, 2, 3, 4, 5]
k = 2

if not nums:
    rotated = []
else:
    k = k % len(nums)
    if k == 0:
        rotated = nums.copy()
    else:
        rotated = nums[-k:] + nums[:-k]

print(rotated)
```

## Walkthrough

1. If `nums` is `[1, 2, 3, 4, 5]` (`len == 5`) and `k = 2`: `nums[-2:]` grabs the last 2 items (`[4, 5]`), and `nums[:-2]` grabs everything before them (`[1, 2, 3]`). Joining them gives `[4, 5, 1, 2, 3]`.
2. **Large `k` edge case (`k = 5` on length `3`):** `5 % 3 == 2`, rotating `[1, 2, 3]` -> `[2, 3, 1]`.
3. **Critical `k == 0` slice trap:** When `k` is `0` (or `len(nums)` after `%`), `-0` is `0`! `nums[-0:] + nums[:-0]` would become `nums[0:] + nums[:0]` = `nums + []`, which works by luck here — wait: actually `nums[:0]` IS `[]`, though explicit `if k == 0: rotated = nums.copy()` makes the intent crystal clear and bug-proof! And if modifying in place is required later, `nums[:] = rotated` updates `nums` for all aliases too!
