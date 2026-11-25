---
type: concept
title: "Essential `collections` module types"
difficulty: easy
mostAsked: true
tags: [collections, stdlib, data-structures]
revision:
  - "`Counter` for frequency maps; `defaultdict` avoids `KeyError`; `deque` for O(1) appendleft/popleft"
  - "`OrderedDict` preserves insertion order and has `move_to_end()` for LRU-style caches"
  - "`namedtuple` creates lightweight immutable records with field-name access"
---

The `collections` module contains specialised container types that fill common gaps in the standard dict/list/tuple toolbox.

```python
from collections import Counter, defaultdict, deque, OrderedDict

# Counter — word frequency in one line
freq = Counter("the cat sat on the mat".split())
print(freq.most_common(2))   # [('the', 2), ('cat', 1)]

# defaultdict — no KeyError when key is missing
graph = defaultdict(list)
graph["A"].append("B")       # no pre-initialisation needed

# deque — O(1) on both ends (list popleft is O(n))
queue = deque([1, 2, 3], maxlen=3)
queue.append(4)              # auto-evicts oldest: deque([2, 3, 4])

# OrderedDict — LRU cache pattern
cache = OrderedDict([("a", 1), ("b", 2)])
cache.move_to_end("a")       # mark as recently used
cache.popitem(last=False)    # evict least recently used ('b')
```

:::tip[Counter arithmetic]
`Counter` supports `+`, `-`, `&` (intersection), and `|` (union) — handy for comparing frequency distributions.
:::

Also worth knowing: `ChainMap` (layered dict lookups — great for config), `UserDict`/`UserList` (safe base classes for custom containers).
