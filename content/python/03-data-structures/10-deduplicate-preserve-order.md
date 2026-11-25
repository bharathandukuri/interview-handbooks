---
type: problem
title: "Deduplicate While Preserving Order"
difficulty: easy
complexity:
  time: "O(n)"
  space: "O(n)"
approach: "dict.fromkeys / seen set"
tags: [lists, dicts, sets]
---

## Problem

Given a list of hashable items, return a new list with duplicates removed while preserving the order of first appearance.

```
Input:  [3, 1, 2, 1, 4, 3, 5]
Output: [3, 1, 2, 4, 5]
```

## Hint

- `list(set(items))` loses original order — what container preserves insertion order since Python 3.7?
- How would you handle **unhashable** items if a `key=` function isn't given?

## Solution

```python
from collections.abc import Iterable
from typing import TypeVar

T = TypeVar("T")

def dedupe(items: Iterable[T]) -> list[T]:
    # Since Python 3.7+, dict preserves insertion order in C speed
    return list(dict.fromkeys(items))
```

## Walkthrough

`dict.fromkeys(items)` inserts each item as a key in order, ignoring duplicates in O(1) amortized time per item, and `list(...)` extracts the unique keys in exact first-seen order. For custom deduplication keys (e.g., `dedupe_by(users, key=lambda u: u.id)`), maintain a `seen = set()` and append items whose key isn't in `seen` yet.
