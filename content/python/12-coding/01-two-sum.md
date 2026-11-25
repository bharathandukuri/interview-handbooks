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
  - "Single pass: store each number's index in a dict and check if `target - n` already exists"
  - "Return indices immediately on complement match"
---

## Problem

Given an array `nums` and an integer `target`, return the indices of two numbers that add up to `target`. Exactly one solution exists; elements may not be reused.

```
Input:  nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
```

## Hint

- What complement value would pair with `nums[i]`?
- Check `seen` before inserting `nums[i]` so an element cannot pair with itself.

## Solution

```python
def two_sum(nums: list[int], target: int) -> list[int]:
    seen: dict[int, int] = {}
    for i, n in enumerate(nums):
        complement = target - n
        if complement in seen:
            return [seen[complement], i]
        seen[n] = i
    return []
```

## Walkthrough

For each element `n` at index `i`, look up `target - n` in `seen`. If found, return `[seen[complement], i]`. Otherwise store `seen[n] = i`. Checking before inserting guarantees we never reuse the same index, achieving O(n) time and O(n) space.
