---
type: problem
title: "Binary Search & `bisect` Lower Bound"
difficulty: medium
complexity:
  time: "O(log n)"
  space: "O(1)"
approach: "Binary Search / bisect"
tags: [binary-search, bisect, arrays]
---

## Problem

Given a sorted ascending array `nums` and `target`, return the **first index** where `nums[i] >= target` (insertion index), or `len(nums)` if all elements are smaller.

```
Input:  nums = [1, 3, 5, 5, 9], target = 5
Output: 2
```

## Hint

- Shrink `[lo, hi)` using `mid = lo + (hi - lo) // 2`.
- Python's standard library also provides `bisect.bisect_left(nums, target)`.

## Solution

```python
def lower_bound(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo
```

## Walkthrough

Using half-open bounds `[lo, hi)` cleanly handles empty lists and duplicates without off-by-one bugs. Whenever `nums[mid] < target`, the insertion point must be strictly right of `mid`; otherwise `mid` itself could be the first valid index (`hi = mid`). When `lo == hi`, return `lo`.
