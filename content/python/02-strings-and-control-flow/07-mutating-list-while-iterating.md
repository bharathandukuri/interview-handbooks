---
type: pitfall
title: "Mutating a list while iterating over it"
difficulty: easy
tags: [loops, lists, pitfalls]
---

## The trap

```python
nums = [1, 2, 3, 4, 5, 6]
for n in nums:
    if n % 2 == 0:
        nums.remove(n)   # shifts indices left mid-loop!
print(nums)              # [1, 3, 5] here, but skips adjacent evens!

# Try [2, 4, 6]: result is [4] — 4 gets skipped!
```

## The fix

```python
nums = [2, 4, 6, 7]
# Option 1: build a new list with a comprehension (cleanest)
nums = [n for n in nums if n % 2 != 0]

# Option 2: mutate in place via slice assignment
nums[:] = [n for n in nums if n % 2 != 0]
```

## Why it happens

`for n in nums` tracks an internal index counter (`0, 1, 2...`). When `nums.remove(2)` deletes index `0`, element `4` shifts down into index `0`, and the iterator advances to index `1` (`6`) — silently skipping `4`. Never add or remove items from the list you are currently iterating over; build a new filtered list or iterate over a copy (`nums[:]`).
