---
type: problem
title: "Remove duplicates while keeping order"
difficulty: easy
complexity:
  time: "Checks seen list for each item"
  space: "Stores unique elements"
approach: "Append to unique list only if item not in unique"
tags: [lists, loops, edge-cases, practice]
related:
  [
    python.lists-and-tuples.what-is-a-list,
    python.lists-and-tuples.sort-returns-none-and-mutating-loop,
  ]
---

## Problem

Given a list `nums`, build a new list keeping only the **first** copy of each element in its original order (do not mutate `nums`). Handle empty lists and already-unique lists cleanly.

```text
[3, 1, 2, 1, 4, 3, 5] -> [3, 1, 2, 4, 5]
[]                    -> []
```

## Hint

- Start with an empty list `unique = []`.
- Loop over `nums`: if an item is `not in unique`, append it!
- Why does this preserve original order cleanly when `[]` is empty or `[7]` has 1 item?

## Solution

```python
nums = [3, 1, 2, 1, 4, 3, 5]
unique = []

for item in nums:
    if item not in unique:
        unique.append(item)

print(unique)
```

## Walkthrough

For each `item` in `nums`, `if item not in unique:` checks if we have seen it earlier. If not, `.append(item)` adds it to the end of `unique`, keeping the exact order of first appearance!

**Edge cases and looking ahead:**

- `[]` skips the loop and prints `[]` cleanly.
- Works even on mixed or unhashable elements (like nested lists `[1, 2]`).
- **Performance note:** Checking `item not in unique` scans `unique` linearly, which slows down on 100,000 items (`O(n^2)`). In **Chapter 7**, you will learn **sets** and `dict.fromkeys()` to do this at instant `O(1)` lookup speed!
