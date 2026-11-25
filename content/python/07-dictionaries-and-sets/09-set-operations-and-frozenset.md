---
type: concept
title: "Set math operations and frozenset"
difficulty: medium
tags: [sets, frozenset, data-structures]
related: [python.dictionaries-and-sets.what-is-a-set]
revision:
  - "Set algebra: union (`a | b`), intersection (`a & b`), difference (`a - b`), symmetric diff (`a ^ b`)"
  - "Test subset/superset with `<=` / `>=` (or `.issubset()` / `.issuperset()`)"
  - "`frozenset` is an **immutable, hashable** set — usable inside another set or as a dict key"
---

Python sets support mathematical set operations cleanly via operators or methods:

```python
a = {1, 2, 3, 4}
b = {3, 4, 5}

print("union:", sorted(a | b))        # items in a OR b -> [1, 2, 3, 4, 5]
print("both: ", sorted(a & b))        # intersection (in both) -> [3, 4]
print("diff: ", sorted(a - b))        # in a but NOT b -> [1, 2]
print("xor:  ", sorted(a ^ b))        # symmetric diff (in one only) -> [1, 2, 5]
print("subset?", {1, 2} <= a)         # True
```

The screen shows:

```text
union: [1, 2, 3, 4, 5]
both:  [3, 4]
diff:  [1, 2]
xor:   [1, 2, 5]
subset? True
```

**Why `frozenset` exists:**

- Because a normal `set` is mutable, you **cannot** put a `set` inside another `set` or use it as a `dict` key (`{{1, 2}}` raises `TypeError`).
- Wrapping items in **`frozenset([1, 2])`** creates an **immutable, hashable** set (no `.add()` or `.remove()`), so you can store unordered pairs like `{frozenset({1, 2}), frozenset({3, 4})}` or use them as dictionary keys cleanly!
- Bonus helper: `a.isdisjoint(b)` checks in `O(min(len(a), len(b)))` whether two sets share zero elements!
