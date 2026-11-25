---
type: question
title: "How Python dicts work internally"
difficulty: medium
mostAsked: true
tags: [dict, hashing, cpython]
revision:
  - "Dicts use **open-addressing** hash tables and preserve insertion order (guaranteed in 3.7+)"
  - "Compact layout (3.6+): a sparse index array points into a dense entry array"
  - "Average O(1) lookup/insert/delete; keys must implement `__hash__` and `__eq__`"
---

## Answer

A Python `dict` is an **open-addressing hash table** (no linked-list chaining). Given a key, Python computes `hash(key)` and masks the lower bits to probe an index. Collisions follow a pseudorandom probe sequence across the table.

**Compact dict layout (CPython 3.6+, standardized in 3.7+):**
Instead of one large sparse array of `(hash, key, value)` structs, CPython splits storage into:

1. A **sparse index table** (`indices`) storing small integer offsets.
2. A **dense entries array** (`entries`) appended in insertion order.

This saves ~20–25% memory and gives insertion-order iteration (`list(d.keys())`) for free!

**Key rules:**

- Keys must be **hashable** (`__hash__` + `__eq__`, immutable in value during dict lifetime).
- Lookup/insert/delete is **O(1)** amortized; table resizes when load factor exceeds ~2/3.

## Why interviewers ask

Dicts power almost everything in Python (modules, namespaces, `**kwargs`, instance `__dict__`). Understanding hashing explains O(1) lookups and why mutable `list`/`set` objects cannot be keys.

## Follow-ups

- Why does `hash("hello")` change between Python process restarts (`PYTHONHASHSEED`)?
- What happens if a custom class breaks the invariant `a == b => hash(a) == hash(b)`?
