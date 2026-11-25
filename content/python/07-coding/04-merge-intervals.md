---
type: problem
title: "Merge Intervals"
difficulty: medium
mostAsked: true
complexity:
  time: "O(n log n)"
  space: "O(n)"
approach: "Sort + Linear Merge"
tags: [arrays, sorting, intervals]
revision:
  - "Sort by start time, then iterate: extend the last merged interval or push a new one"
  - "Overlap condition: `next.start <= current.end`"
---

## Problem

Given a list of intervals `[start, end]`, merge all overlapping intervals and return the result.

```
Input:  [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
```

## Hint

- If you sort by start time, overlapping intervals will be adjacent.
- When does the current interval extend the previous one?

## Solution

```python
def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged: list[list[int]] = [intervals[0]]

    for start, end in intervals[1:]:
        if start <= merged[-1][1]:          # overlapping
            merged[-1][1] = max(merged[-1][1], end)
        else:                               # gap — start new interval
            merged.append([start, end])

    return merged
```

## Walkthrough

After sorting, any two adjacent intervals either overlap (`next.start ≤ current.end`) or don't. If they overlap, extend the last merged interval's end to `max(current.end, next.end)` — the `max` handles full containment. Otherwise, push the next interval as-is. One linear pass after the sort gives O(n log n) overall. Watch the edge case of an interval fully contained within the previous one (the `max` handles it).
