---
type: concept
title: "`itertools` essentials"
difficulty: medium
tags: [itertools, stdlib, generators]
---

`itertools` provides C-speed lazy building blocks for combining, slicing, and grouping iterators without extra lists.

```python
import itertools as it

list(it.islice(it.count(10, 2), 4))       # [10, 12, 14, 16] — slice infinite streams
list(it.chain([1, 2], [3, 4]))            # [1, 2, 3, 4]
list(it.batched("ABCDEFG", 3))            # [('A','B','C'), ('D','E','F'), ('G',)] (3.12+)
list(it.pairwise([10, 20, 35]))           # [(10, 20), (20, 35)] (3.10+)
list(it.accumulate([1, 2, 3, 4]))         # [1, 3, 6, 10] (prefix sums)
```

**Combinatorics & Grouping:**

- `it.product(A, B)`: Cartesian product (replaces nested loops).
- `it.permutations(items, r)` / `it.combinations(items, r)`: ordered vs unordered selections.
- `it.groupby(sorted_items, key=...)`: groups **consecutive** equal keys — always sort by the same `key` beforehand!
