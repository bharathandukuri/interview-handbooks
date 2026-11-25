---
type: problem
title: "Top K Frequent Elements"
difficulty: medium
mostAsked: true
complexity:
  time: "O(n)"
  space: "O(n)"
approach: "Bucket Sort"
tags: [arrays, hash-map, sorting]
revision:
  - "Count with `Counter`, then bucket by frequency for O(n) time"
  - "`Counter(nums).most_common(k)` uses a heap in O(n log k) when `k << n`"
---

## Problem

Given an integer array `nums` and an integer `k`, return the `k` most frequent elements.

```
Input:  nums = [1, 1, 1, 2, 2, 3], k = 2
Output: [1, 2]
```

## Hint

- No element can appear more than `len(nums)` times — index buckets by frequency!

## Solution

```python
from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    counts = Counter(nums)
    buckets: list[list[int]] = [[] for _ in range(len(nums) + 1)]
    for num, freq in counts.items():
        buckets[freq].append(num)

    result: list[int] = []
    for freq in range(len(buckets) - 1, 0, -1):
        result.extend(buckets[freq])
        if len(result) >= k:
            return result[:k]
    return result
```

## Walkthrough

Frequencies are bounded by `1..len(nums)`. Placing each unique number into `buckets[freq]` and scanning downward from highest frequency yields `k` items in strict O(n) time and O(n) space.
