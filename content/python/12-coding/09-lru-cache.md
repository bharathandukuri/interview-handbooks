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
  - "`OrderedDict.move_to_end(key)` marks a key as most-recently-used in O(1)"
  - "`popitem(last=False)` evicts the least-recently-used key in O(1)"
---

## Problem

Design a Least Recently Used (LRU) cache supporting `get(key)` (returns `-1` if missing) and `put(key, value)` in **O(1)** time.

```
cache = LRUCache(2)
cache.put(1, 1); cache.put(2, 2)
cache.get(1)    # -> 1 (1 is now most recent)
cache.put(3, 3) # evicts key 2
cache.get(2)    # -> -1
```

## Hint

- `collections.OrderedDict` combines a hash map with a doubly linked list in C.

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
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.cap:
            self.cache.popitem(last=False)
```

## Walkthrough

Most-recently-used keys stay at the tail (`move_to_end`), while the oldest key sits at the head (`popitem(last=False)`). If an interviewer asks for a from-scratch implementation without `OrderedDict`, pair a `dict[int, Node]` with a custom doubly linked list with sentinel `head`/`tail` nodes.
