---
type: problem
title: "Binary search pattern: Exact match, lower_bound, and Search in Rotated Array"
difficulty: medium
mostAsked: true
complexity:
  time: "O(log n)"
  space: "O(1)"
approach: "Use left <= right invariant; in rotated arrays, at least one half [left..mid] or [mid..right] is strictly sorted — check whether target lies inside that sorted half"
tags: [interviews, binary-search, arrays, algorithms]
related: [python.interview-problem-set.interview-pattern-playbook]
revision:
  - "Standard exact binary search uses **`while left <= right:`** shrinking `right = mid - 1` or `left = mid + 1`"
  - "In a **rotated sorted array**, compare `nums[left] <= nums[mid]` to identify which half is sorted (`<=` handles the 2-element `left == mid` boundary!)"
---

## Problem

1. Write `lower_bound(nums, target)` finding the first index `i` where `nums[i] >= target` (same semantics as `bisect.bisect_left`, returning `len(nums)` if every element is smaller).
2. Write **`search_rotated(nums, target)`** finding `target`'s index in a **rotated sorted array of distinct integers** (e.g., `[4, 5, 6, 7, 0, 1, 2]`), or returning `-1` if missing — in **`O(log n)`** time!

Edge cases: empty `[]` -> `-1`, single element `[5]` -> `0` or `-1`, two elements `[3, 1]` looking for `1` (`left == mid`!), non-rotated array `[1, 2, 3]`.

## Hint

- In `lower_bound`, maintain `left, right = 0, len(nums)` (**half-open `[left, right)`** invariant!), returning `left` at the end.
- In `search_rotated`: at any `mid`, split `[left..mid..right]` — **at least one side** (`[left..mid]` OR `[mid..right]`) MUST be strictly sorted!
- Check `if nums[left] <= nums[mid]:` (`<=` is critical when `left == mid` in a 2-element subarray like `[3, 1]` searching for `1`!). If `nums[left] <= target < nums[mid]`, narrow `right = mid - 1`; otherwise search right `left = mid + 1`.

## Solution

```python
def lower_bound(nums: list[int], target: int) -> int:
    left, right = 0, len(nums)           # search space [left, right)
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid
    return left

def search_rotated(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1       # search space [left, right]
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:      # left half is sorted (`<=` handles left == mid!)
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:                            # right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1

print("lower_bound [1,2,2,5] target 2:", lower_bound([1, 2, 2, 5], 2))
print("lower_bound target 9:", lower_bound([1, 2, 2, 5], 9))
print("rotated find 0:", search_rotated([4, 5, 6, 7, 0, 1, 2], 0))
print("rotated 2-elem [3, 1] find 1:", search_rotated([3, 1], 1))
print("rotated empty:", search_rotated([], 1))
```

## Walkthrough

Understanding **both** binary-search invariants ends off-by-one confusion forever:

- **Half-open `[left, right)` (`while left < right:`):** `right` starts at `len(nums)`, fails when `left == right`, moves `right = mid` (since `mid` stays a valid candidate) and returns `left` — ideal for boundary problems (`lower_bound`, `min capacity to ship packages`).
- **Closed `[left, right]` (`while left <= right:`):** `right` starts at `len(nums) - 1`, checks `nums[mid] == target`, and excludes `mid` cleanly with `mid - 1` / `mid + 1`. Notice how **`nums[left] <= nums[mid]`** handles `[3, 1]` looking for `1`: `mid = 0` (`3`), `nums[0] <= nums[0]` is `True`, `3 <= 1 < 3` is `False`, so `left` moves to `1` and matches `1`!
