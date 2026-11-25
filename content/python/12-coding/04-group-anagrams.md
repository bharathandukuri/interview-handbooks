---
type: problem
title: "Group Anagrams"
difficulty: medium
complexity:
  time: "O(n * k log k)"
  space: "O(n * k)"
approach: "defaultdict + sorted tuple key"
tags: [hash-map, strings, sorting]
---

## Problem

Given a list of strings, group the anagrams together in any order.

```
Input:  ["eat", "tea", "tan", "ate", "nat", "bat"]
Output: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
```

## Hint

- Anagrams share the exact same sorted character tuple.
- `collections.defaultdict(list)` avoids manual missing-key checks.

## Solution

```python
from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups: defaultdict[tuple[str, ...], list[str]] = defaultdict(list)
    for s in strs:
        groups[tuple(sorted(s))].append(s)
    return list(groups.values())
```

## Walkthrough

`tuple(sorted(s))` produces a hashable canonical key identical for all anagrams. Grouping via `defaultdict(list)` takes O(n · k log k) time where `k` is max string length (or O(n · k) if keyed by a 26-letter frequency tuple).
