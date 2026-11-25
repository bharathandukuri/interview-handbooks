---
type: problem
title: "Intervals pattern: Merge Overlapping Intervals"
difficulty: medium
mostAsked: true
complexity:
  time: "O(n log n) dominated by sorting intervals by start"
  space: "O(n) for merged result (does not alias input sublists!)"
approach: "Sort intervals by start time cleanly and extend the last merged interval's end via max() whenever the next interval overlaps or touches"
tags: [interviews, intervals, sorting, arrays]
related: [python.comprehensions-and-sorting.sorted-and-sort-with-key]
revision:
  - "Sort by `(start, end)` first — then an interval overlaps the previous merged one whenever `start <= merged[-1][1]`"
  - "Update `merged[-1][1] = max(merged[-1][1], end)` (**never** overwrite unconditionally — handles nested `[1, 10], [2, 5]`!)"
---

## Problem

Given a list of `[start, end]` intervals (`start <= end`), merge all overlapping or touching intervals and return them sorted cleanly **without modifying the caller's original list or inner lists**.

Edge cases:

- Empty `[]` -> `[]`
- Touching boundary `[1, 4], [4, 5]` -> `[[1, 5]]`
- Fully contained interval `[1, 10], [2, 5]` -> `[[1, 10]]`

## Hint

- Sort a fresh copy (`sorted(intervals, key=lambda iv: iv[0])`).
- Initialize `merged = [list(ordered[0])]` (**`list(...)`** copies the inner 2-element list so mutating `merged[-1][1]` never mutates the caller's interval!).
- Check `start <= merged[-1][1]`. When overlapping, merge with `max(merged[-1][1], end)`.

## Solution

```python
def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []
    ordered = sorted(intervals, key=lambda iv: (iv[0], iv[1]))
    merged: list[list[int]] = [[ordered[0][0], ordered[0][1]]]

    for start, end in ordered[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])

    return merged

print(merge_intervals([[1, 3], [8, 10], [2, 6], [15, 18]]))
print(merge_intervals([[1, 10], [2, 5], [10, 12]]))
print(merge_intervals([]))
```

## Walkthrough

Notice two clean safeguards interviewers appreciate:

1. **`[[ordered[0][0], ordered[0][1]]]` / `[start, end]` copies:** If we stored `ordered[0]` directly inside `merged`, changing `merged[-1][1] = max(...)` would mutate the caller's nested `[1, 3]` list as an unintended side effect!
2. **`max(merged[-1][1], end)` handles nested intervals:** For `[[1, 10], [2, 5]]`, simply doing `merged[-1][1] = end` would shrink `[1, 10]` down to `[1, 5]`! Using `max` handles both partial overlaps and full containment cleanly.
