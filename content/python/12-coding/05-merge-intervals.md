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
  - "Sort intervals by start time, then merge if `start <= merged[-1][1]`"
  - "Use `max(merged[-1][1], end)` to handle fully nested intervals"
---

## Problem

Given an array of `[start, end]` intervals, merge all overlapping intervals.

```
Input:  [[1, 3], [2, 6], [8, 10], [15, 18]]
Output: [[1, 6], [8, 10], [15, 18]]
```

## Hint

- Sorting by `start` ensures any overlapping intervals sit next to each other.

## Solution

```python
def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []
    ordered = sorted(intervals, key=lambda x: x[0])
    merged: list[list[int]] = [ordered[0][:]]
    for start, end in ordered[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged
```

## Walkthrough

After sorting by start time, compare each `[start, end]` against the last interval in `merged`. If they overlap (`start <= merged[-1][1]`), extend the end with `max(...)`; otherwise append a fresh interval. Copying `ordered[0][:]` avoids mutating the caller's input.
