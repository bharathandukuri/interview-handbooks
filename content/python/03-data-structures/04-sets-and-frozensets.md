---
type: concept
title: "Sets and `frozenset`"
difficulty: easy
tags: [sets, hashing, data-structures]
---

A `set` is an **unordered collection of unique hashable elements** backed by a hash table, giving **O(1)** average membership tests (`x in s`).

```python
empty = set()              # NOT `{}` — `{}` creates an empty dict!
a = {1, 2, 3, 4}
b = {3, 4, 5}

print(a | b)               # union: {1, 2, 3, 4, 5}
print(a & b)               # intersection: {3, 4}
print(a - b)               # difference: {1, 2}
print(a ^ b)               # symmetric difference: {1, 2, 5}
```

Use `.add(x)` to insert, `.discard(x)` to remove safely (no error if missing), or `.remove(x)` if missing should raise `KeyError`.

**`frozenset`:** An immutable, **hashable** version of `set`. Because it is hashable, a `frozenset` can live inside another `set` or act as a `dict` key (e.g., representing unordered graph edges `{u, v}`).
