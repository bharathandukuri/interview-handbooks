---
type: problem
title: "Heap pattern: Top K Frequent Elements"
difficulty: medium
mostAsked: true
complexity:
  time: "O(n log k) with bounded min-heap (or O(n) with frequency buckets)"
  space: "O(n) for Counter + heap / buckets"
approach: "Count frequencies with Counter, maintain a min-heap of size at most k popping the smallest count whenever len(heap) > k"
tags: [interviews, heap, heapq, sorting]
related:
  [
    python.modules-and-stdlib.collections-counter-defaultdict-deque,
    python.interview-problem-set.heapq-max-heap-and-tiebreaker-pitfall,
  ]
revision:
  - "Maintain a **size-`k` min-heap** of `(count, num)` pairs — popping whenever `len(heap) > k` leaves the top `k` largest counts in **`O(n log k)`** time!"
  - "Remember to guard `k <= 0` -> `[]` and tie-break cleanly or clarify tie order"
---

## Problem

Given an integer list `nums` and integer `k`, return the `k` most frequent elements.

Edge cases:

- `k <= 0` or empty `nums` -> `[]`
- `k >= len(unique elements)` -> all unique elements
- Ties: clarify whether any order is valid or sort deterministically by `(-count, value)`

```text
top_k_frequent([1, 1, 1, 2, 2, 3], k=2) -> [1, 2]
top_k_frequent([4], k=1)                -> [4]
```

## Hint

- Count occurrences in `O(n)` using `collections.Counter(nums)`.
- Iterate over `counts.items()`: push `(freq, num)` onto a min-heap (`heapq.heappush`), and whenever `len(heap) > k`, call `heapq.heappop(heap)` (evicts the smallest frequency!).
- At the end, extract elements sorted from highest frequency down (`sorted(heap, key=lambda p: (-p[0], p[1]))`) — or mention **bucket sort** (`buckets[freq]`) for pure **`O(n)`** time!

## Solution

```python
from collections import Counter
import heapq

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    if k <= 0 or not nums:
        return []
    counts = Counter(nums)
    min_heap: list[tuple[int, int]] = []

    for val, freq in counts.items():
        heapq.heappush(min_heap, (freq, val))
        if len(min_heap) > k:
            heapq.heappop(min_heap)

    min_heap.sort(key=lambda pair: (-pair[0], pair[1]))
    return [val for _, val in min_heap]

print(top_k_frequent([1, 1, 1, 2, 2, 3], 2))
print(top_k_frequent([5, 5, 7, 7, 2], 1))
print(top_k_frequent([], 2))
```

## Walkthrough

Notice why a **bounded min-heap** of size $k$ beats sorting all $u$ unique elements (`O(u log u)`): when you have 10 million log IDs and only need the top $k = 5$, keeping `len(min_heap) <= 5` takes tiny **`O(n log k)`** work!

Follow-up for interviews: **"Can you reach `O(n)` worst-case time?"** Yes — **bucket sort**! Allocate `buckets = [[] for _ in range(len(nums) + 1)]`, append each `val` into `buckets[freq]`, then walk `buckets` backward from `len(nums)` down to `1` collecting up to `k` elements cleanly in `O(n)`.
