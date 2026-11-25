---
type: problem
title: "Two Sum"
difficulty: easy
mostAsked: true
complexity:
  time: "O(n)"
  space: "O(n)"
approach: "Hash Map"
tags: [arrays, hash-map]
revision:
  - "Single pass: store each number's index in a dict, check if complement already exists"
  - "Return indices immediately on complement match — no second loop needed"
---

## Problem

Given an array `nums` and an integer `target`, return the indices of two numbers that add up to `target`. Exactly one solution exists; elements may not be reused.

```
Input:  nums = [2, 7, 11, 15], target = 9
Output: [0, 1]   (nums[0] + nums[1] == 9)
```

## Hint

- What would you need to look up for each element to avoid a nested loop?
- Can you combine the lookup and the insertion in a single pass?

## Solution

```python
def two_sum(nums: list[int], target: int) -> list[int]:
    seen: dict[int, int] = {}  # value → index
    for i, n in enumerate(nums):
        complement = target - n
        if complement in seen:
            return [seen[complement], i]
        seen[n] = i
    return []
```

## Walkthrough

For each number `n` at index `i`, compute `complement = target - n`. If `complement` is already in `seen`, we've found our pair. Otherwise, store `n → i` and continue. We never re-read the array, so the solution is O(n) time and O(n) space. The key insight: transform "find two numbers" into "find one number's complement", which is a single dict lookup.
