---
type: predict
title: "LRU cache eviction trace after read-refresh (OrderedDict)"
difficulty: medium
tags: [interviews, lru-cache, collections, trace]
related: [python.interview-problem-set.lru-cache-design-problem]
options:
  - "-1 10 30"
  - "20 -1 30"
  - "-1 -1 30"
  - "20 10 -1"
answer: 0
---

```python
from collections import OrderedDict

cache = OrderedDict()
capacity = 2

def put(k, v):
    if k in cache:
        cache.move_to_end(k)
    cache[k] = v
    if len(cache) > capacity:
        cache.popitem(last=False)

def get(k):
    if k not in cache:
        return -1
    cache.move_to_end(k)
    return cache[k]

put(1, 10)
put(2, 20)
_ = get(1)
put(3, 30)
print(get(2), get(1), get(3))
```

## Output

```text
-1 10 30
```

## Explanation

Trace the **Least Recently Used (LRU)** order after every operation (`[oldest -> newest]`):

1. `put(1, 10)` -> `[1]`
2. `put(2, 20)` -> `[1, 2]`
3. `get(1)` refreshes key `1` via `move_to_end(1)` -> `[2, 1]`! (Now key `2` is oldest!)
4. `put(3, 30)` exceeds capacity `2`, so `popitem(last=False)` evicts the oldest key **`2`**, leaving `[1, 3]`!
5. Printing `get(2), get(1), get(3)` therefore outputs `-1 10 30`.
