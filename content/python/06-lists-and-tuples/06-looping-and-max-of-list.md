---
type: problem
title: "Find the maximum of a list (without max())"
difficulty: easy
complexity:
  time: "Visits every item once"
  space: "Tiny"
approach: "Track best = nums[0] across a for loop"
tags: [lists, loops, edge-cases, practice]
related:
  [
    python.lists-and-tuples.what-is-a-list,
    python.loops.running-total-and-counter,
  ]
---

## Problem

Write code that finds the largest number in a non-empty list `nums` **without** using Python's built-in `max()`. Make sure your solution works even when **every number in the list is negative**!

```text
[-9, -3, -7] -> -3
[42]         -> 42
```

## Hint

- **Trap to avoid:** Do NOT initialize `best = 0`! What happens on `[-9, -3, -7]` if `best` starts at `0`?
- Initialize `best = nums[0]` (the very first item) instead!
- Also check the edge case: what if `nums` is `[]` (empty)?

## Solution

```python
nums = [-9, -3, -7]

if not nums:
    print("List is empty")
else:
    best = nums[0]
    for n in nums[1:]:
        if n > best:
            best = n
    print(best)
```

## Walkthrough

1. Guarding `if not nums:` prevents `IndexError` when given `[]`.
2. Setting `best = nums[0]` ensures `best` always starts as a **real element from the list** (`-9`), so comparing `-3 > -9` updates `best` to `-3` cleanly — avoiding the classic `best = 0` bug that wrongly prints `0` for all-negative lists!
3. Slicing `nums[1:]` skips comparing `nums[0]` against itself (and for a 1-element list `[42]`, `nums[1:]` is `[]`, so the loop finishes immediately and prints `42`).
