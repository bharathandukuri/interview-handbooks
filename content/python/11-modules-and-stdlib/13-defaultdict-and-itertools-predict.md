---
type: predict
title: "defaultdict missing-key lookup and unsorted itertools.groupby"
difficulty: hard
tags: [collections, itertools, gotchas, trace]
related:
  [
    python.modules-and-stdlib.collections-counter-defaultdict-deque,
    python.modules-and-stdlib.itertools-and-functools,
  ]
options:
  - "True 3"
  - "False 2"
  - "True 2"
  - "False 3"
answer: 0
---

```python
from collections import defaultdict
from itertools import groupby

dd = defaultdict(list)
_ = dd["missing"]
groups = [(k, list(g)) for k, g in groupby(["a", "a", "b", "a"])]

print("missing" in dd, len(groups))
```

## Output

```text
True 3
```

## Explanation

Two classic standard-library edge cases interact here:

1. **Reading a missing key in `defaultdict` mutates the dict!** Simply evaluating `dd["missing"]` triggers `__missing__`, calls `list()`, and **inserts `"missing": []`** into `dd`. So `"missing" in dd` immediately evaluates to **`True`** (use `dd.get("missing")` if you only want to check safely).
2. **`itertools.groupby` merges consecutive equal keys only:** On `["a", "a", "b", "a"]` (unsorted!), `groupby` yields `('a', ['a', 'a'])`, then `('b', ['b'])`, then a _separate_ `('a', ['a'])` — making **`3`** groups instead of `2`. Always call `sorted(...)` with the same `key=` before calling `groupby(...)` if equal keys can appear apart!
