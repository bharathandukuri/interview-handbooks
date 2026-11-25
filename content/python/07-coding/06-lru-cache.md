---
type: problem
title: "LRU Cache"
difficulty: medium
mostAsked: true
complexity:
  time: "O(1) get and put"
  space: "O(capacity)"
approach: "OrderedDict"
tags: [design, hash-map, linked-list]
revision:
  - "`OrderedDict.move_to_end(key)` marks a key as recently used in O(1)"
  - "`popitem(last=False)` evicts the least-recently-used key in O(1)"
---

## Problem

Design a data structure that follows the LRU (Least Recently Used) cache policy with O(1) `get` and `put`.

```
LRUCache(2)
put(1, 1)   cache: {1:1}
put(2, 2)   cache: {1:1, 2:2}
get(1) → 1  cache: {2:2, 1:1}  (1 moved to end = most recent)
put(3, 3)   cache: {1:1, 3:3}  (2 evicted — least recently used)
get(2) → -1 (evicted)
```

## Hint

- You need O(1) lookup AND O(1) ordering. What standard Python type gives you both?

## Solution

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int) -> None:
        self.cap = capacity
        self.cache: OrderedDict[int, int] = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)   # mark as recently used
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.cap:
            self.cache.popitem(last=False)   # evict LRU (front)
```

## Walkthrough

`OrderedDict` maintains insertion order and provides `move_to_end` (O(1)) and `popitem` (O(1)), which map perfectly to LRU semantics. The "most recently used" item lives at the end; the LRU item lives at the front. For a from-scratch solution (without `OrderedDict`), implement a doubly-linked list + hash map to achieve the same O(1) guarantees.
