---
type: concept
title: "Tuples and star unpacking"
difficulty: easy
tags: [tuples, unpacking, syntax]
---

Tuples are **immutable ordered sequences**. The comma — not the parentheses — creates a tuple:

```python
single = (42,)        # trailing comma REQUIRED for a 1-element tuple!
not_a_tuple = (42)    # just int 42
pair = 10, 20         # parentheses optional in assignments and returns
```

**Extended star unpacking (`*`)** works on any iterable (`tuple`, `list`, `str`, generators):

```python
first, *middle, last = [1, 2, 3, 4, 5]
# first=1, middle=[2, 3, 4], last=5  (`middle` is always a list)

head, *_ = ("ok", 200, "extra")   # ignore trailing fields with `*_`
```

**Tuple immutability nuance:** A tuple's _references_ are fixed, not the objects inside. If a tuple contains a `list`, `t = ([1, 2], "a")`, you cannot reassign `t[0] = []`, **but** `t[0].append(3)` mutates the inner list and makes `t` unhashable (`hash(t)` raises `TypeError`).
