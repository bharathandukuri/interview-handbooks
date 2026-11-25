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
  - "Count frequencies with `Counter`, then bucket by frequency for a true O(n) solution"
  - "Heap approach is O(n log k) but simpler — mention both and trade-offs"
---

## Problem

Given an integer array `nums` and integer `k`, return the `k` most frequent elements.

```
Input:  nums = [1,1,1,2,2,3], k = 2
Output: [1, 2]
```

## Hint

- What's the maximum possible frequency for any element?
- Can you use that bound to sort in linear time?

## Solution

```python
from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    count = Counter(nums)
    # Bucket i holds all numbers with frequency i
    buckets: list[list[int]] = [[] for _ in range(len(nums) + 1)]
    for num, freq in count.items():
        buckets[freq].append(num)

    result: list[int] = []
    for freq in range(len(buckets) - 1, 0, -1):
        result.extend(buckets[freq])
        if len(result) >= k:
            return result[:k]
    return result
```

## Walkthrough

Frequency can be at most `len(nums)`, so create `len(nums)+1` buckets. Place each number into `buckets[frequency]`. Then sweep buckets from high to low, collecting elements until you have `k`. Each step is O(n), making the whole algorithm O(n). The heap alternative — `Counter.most_common(k)` — is O(n log k) and one line, fine for most interviews unless the problem explicitly asks for linear time.
