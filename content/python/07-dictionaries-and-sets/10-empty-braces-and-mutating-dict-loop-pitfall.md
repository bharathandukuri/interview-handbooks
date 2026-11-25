---
type: pitfall
title: "Empty {} is a dict, NOT a set (and modifying sets/dicts mid-loop)"
difficulty: easy
tags: [sets, dicts, gotchas]
related:
  [
    python.dictionaries-and-sets.what-is-a-set,
    python.dictionaries-and-sets.looping-and-dict-views,
  ]
revision:
  - "`{}` always creates an empty **dict** — `{}.add(1)` raises `AttributeError`"
  - "Adding or removing items from a `set` or `dict` while iterating over it raises `RuntimeError`"
---

## The trap

```python
# Trap 1: thinking {} makes an empty set
seen = {}
# seen.add("a")         # AttributeError: 'dict' object has no attribute 'add'!

# Trap 2: changing size while looping
nums = {1, 2, 3, 4}
# for n in nums:
#     if n % 2 == 0:
#         nums.remove(n)   # RuntimeError: Set changed size during iteration!
```

## The fix

```python
# Fix 1: always use set() for an empty set
seen = set()
seen.add("a")

# Fix 2: loop over a snapshot copy (nums.copy() or list(nums))
nums = {1, 2, 3, 4}
for n in nums.copy():
    if n % 2 == 0:
        nums.remove(n)
print(nums)                # {1, 3}
```

## Why it happens

1. Python had dictionaries before sets were added to the language, so empty `{}` already meant "empty dict". Only non-empty `{1, 2}` (no colons!) creates a set.
2. Hash tables shift internal slots when elements are added or deleted. Looping directly over a resizing table would skip or repeat buckets unpredictably, so Python stops loudly with `RuntimeError`. Iterating over `.copy()` or building a new filtered set keeps everything safe.
