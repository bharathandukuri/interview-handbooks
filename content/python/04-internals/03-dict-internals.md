---
type: question
title: "How Python dicts work internally"
difficulty: medium
mostAsked: true
tags: [dict, hashing, cpython]
revision:
  - "Dicts are open-addressing hash tables; since Python 3.7 they preserve insertion order"
  - "Average O(1) lookup; worst-case O(n) with many hash collisions"
  - "Keys must be hashable — immutable types like `str`, `int`, `tuple` qualify"
---

## Answer

A Python `dict` is an **open-addressing hash table**. Each key is hashed with `hash(key)` and the hash is used to find a slot in the internal array. On collision, Python probes nearby slots using a pseudorandom sequence based on the hash.

```python
# Hash values guide slot selection
print(hash("hello"))   # e.g. 2436820509516560693 (varies by run)
print(hash(42))        # always 42 for small ints
```

**Since CPython 3.6** (and guaranteed in 3.7), dicts store a compact entry list in insertion order plus a separate sparse index array. This reduces memory compared to the old layout.

**Performance rules of thumb:**

- Lookup / insert / delete: **O(1)** average
- Worst case O(n) if all keys hash to the same bucket
- Resizing triggers when load factor exceeds ~2/3: all entries are rehashed

**Hashability requirement:** Dict keys must implement `__hash__` and `__eq__`. Mutable types like `list` don't, so they can't be keys.

```python
d = {(1, 2): "point"}   # tuple key — ok
d[[1, 2]] = "point"     # TypeError: unhashable type: 'list'
```

## Why interviewers ask

Dict internals explain O(1) lookups, why key order is preserved, and why lists can't be keys — all common interview follow-ups.

## Follow-ups

- What happens to a dict's internal table when you delete many keys?
- How does `dict.__eq__` compare two dicts?
