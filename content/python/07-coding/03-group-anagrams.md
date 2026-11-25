---
type: problem
title: "Group Anagrams"
difficulty: medium
complexity:
  time: "O(n · k log k)"
  space: "O(n · k)"
approach: "defaultdict + sorted key"
tags: [hash-map, strings, sorting]
---

## Problem

Given a list of strings, group the anagrams together. Return any order.

```
Input:  ["eat", "tea", "tan", "ate", "nat", "bat"]
Output: [["eat","tea","ate"], ["tan","nat"], ["bat"]]
```

## Hint

- Two strings are anagrams if and only if their sorted characters are identical.
- What can you use as a grouping key?

## Solution

```python
from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups: dict[tuple, list[str]] = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))   # e.g. "eat" → ('a', 'e', 't')
        groups[key].append(s)
    return list(groups.values())
```

## Walkthrough

Sort each string's characters to get a canonical key — all anagrams produce the same key. Use `defaultdict(list)` so the first insert doesn't need a `.setdefault()` check. The `tuple(sorted(s))` key is hashable, unlike a list. Time is O(n · k log k) where `k` is average string length; space is O(n · k) for storing all strings.

**O(n · k) alternative:** Use a frequency count tuple `(0, 2, 0, ..., 1)` of length 26 as the key — avoids the sort at the cost of a fixed-size array per string.
