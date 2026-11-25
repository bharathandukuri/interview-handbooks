---
type: concept
title: "Essential `collections` module types"
difficulty: easy
mostAsked: true
tags: [collections, stdlib, data-structures]
revision:
  - "`Counter` for frequency maps; `defaultdict` avoids `KeyError`; `deque` for O(1) appendleft/popleft"
  - "`OrderedDict` preserves order and has `move_to_end()` for LRU-style caches"
  - "`ChainMap` layers multiple dicts (e.g. CLI args -> env vars -> defaults)"
---

The `collections` module provides specialized container types that cover common gaps in built-in `dict`/`list`/`tuple`:

```python
from collections import Counter, defaultdict, deque, OrderedDict

# Counter — frequency map + arithmetic (+, -, &, |)
freq = Counter("the cat sat on the mat".split())
print(freq.most_common(2))   # [('the', 2), ('cat', 1)]

# defaultdict — auto-initializes missing keys
graph = defaultdict(list)
graph["A"].append("B")

# deque — O(1) push/pop on BOTH ends (list.pop(0) is O(n))
window = deque([1, 2, 3], maxlen=3)
window.append(4)             # auto-evicts oldest: deque([2, 3, 4])

# OrderedDict — move_to_end() + popitem(last=False) for O(1) LRU
cache = OrderedDict([("a", 1), ("b", 2)])
cache.move_to_end("a")
cache.popitem(last=False)    # evicts ('b', 2)
```
