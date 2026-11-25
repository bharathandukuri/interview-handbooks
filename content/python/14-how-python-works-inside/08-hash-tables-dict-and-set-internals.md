---
type: concept
title: "How Python dictionaries and sets work under the hood (hash tables)"
difficulty: medium
mostAsked: true
tags: [internals, dictionaries, sets, hashing, complexity]
related:
  [
    python.dictionaries-and-sets.why-dict-and-set-are-fast,
    python.oop.dunder-methods-and-hashability,
  ]
revision:
  - "CPython `dict` and `set` use **open-addressing hash tables**, giving **`O(1)`** average lookup, insertion, and deletion"
  - "Since Python 3.7+, **compact dictionaries** store a sparse hash index table + dense key/value array — preserving **insertion order** while saving ~20–25% RAM"
  - "Dict/set keys must be **hashable** (`__hash__` + `__eq__`); never mutate an object in a way that changes its hash after inserting it"
---

How can `user in big_dict` stay instant (`O(1)`) whether the dictionary holds 10 items or 10 million? Python backs both **`dict`** and **`set`** with **open-addressing hash tables**.

**Inside a modern CPython dictionary (Python 3.7+ compact layout):**
Instead of storing big sparse `(hash, key, value)` structs directly (wasting RAM for empty slots), CPython splits the dictionary into **two arrays**:

1. **`indices` (sparse hash table):** holds small integer indices (`0`, `1`, `2`...) hashed from `hash(key)` using open-addressing probing when collisions occur.
2. **`entries` (dense array):** appends `(hash, key, value)` records strictly in **insertion order**.

Because `entries` stores items sequentially, iterating over a `dict` preserves **insertion order** AND skips empty buckets!

```python
import sys

# Resizing happens automatically around ~2/3 load factor; deletions keep insertion order cleanly:
d = {}
sizes = []
for i in range(10):
    d[i] = i * 10
    sizes.append(sys.getsizeof(d))
print("Dict size growth steps:", sorted(set(sizes)))

# Identity check comes BEFORE equality in lookups (that's why float('nan') works as a dict key!):
nan = float("nan")
weird = {nan: "still found!"}
print("same nan object works:", weird[nan])
print("new float('nan') misses (nan != nan):", float("nan") in weird)
```

The screen shows:

```text
Dict size growth steps: [224, 352]
same nan object works: still found!
new float('nan') misses (nan != nan): False
```

**Important hash-table rules and edge cases:**

- **Hash collisions & load factor:** If two different keys map to the same slot, Python probes another index cleanly. Once the table reaches roughly **2/3 full**, Python allocates a larger power-of-two table and re-indexes entries (amortized **`O(1)`**!).
- **Why `weird[nan]` worked even though `nan == nan` is `False`:** Dictionary lookups test `stored_key is key or stored_key == key` — matching object identity first (`O(1)` pointer compare!) before calling `__eq__`.
- **`dict` deletions do NOT shrink capacity automatically** (`d.clear()` resets to minimal size, whereas `del d[k]` leaves dummy tombstone slots reused later). Note also `1 == True == 1.0` share the same hash (`hash(1) == hash(True) == 1`), so `{1: "a", True: "b"}` keeps key `1` and overwrites value `"b"`!
