---
type: concept
title: "enumerate() and zip(): clean indexed and paired loops"
difficulty: easy
mostAsked: true
tags: [loops, enumerate, zip, pythonic, edge-cases]
related: [python.loops.range-count-numbers]
revision:
  - "`enumerate(items, start=0)` yields `(index, value)` pairs cleanly — prefer over `range(len(items))`"
  - "`zip(a, b)` pairs elements side by side and stops at the **shortest** input unless `strict=True` (Python 3.10+)"
---

Python gives you two built-in helpers that eliminate manual index variables (`i = 0`) in loops and comprehensions:

**1. `enumerate(iterable, start=0)`** pairs each index with its element:

```python
names = ["Ada", "Grace", "Linus"]
for idx, name in enumerate(names, start=1):
    print(f"{idx}. {name}", end="  ")
print()
```

**2. `zip(seq1, seq2, ...)`** steps through two or more sequences together in lockstep:

```python
scores = [98, 95, 99]
gradebook = {name: score for name, score in zip(names, scores, strict=True)}
print(gradebook)

# Default zip edge case (no strict=True): silently stops at shortest!
print(list(zip([1, 2, 3], ["a", "b"])))
```

The screen shows:

```text
1. Ada  2. Grace  3. Linus
{'Ada': 98, 'Grace': 95, 'Linus': 99}
[(1, 'a'), (2, 'b')]
```

**Important edge cases:**

- **Unequal lengths in `zip()`:** By default `zip([1, 2, 3], ["a", "b"])` quietly drops `3`! Whenever inputs **must** match in length, pass **`strict=True`** (Python 3.10+), which raises `ValueError` loudly if lengths differ.
- **Exhaustible iterators:** Both `enumerate()` and `zip()` produce lazy one-pass iterators (like generators — Chapter 13). Wrap in `list(...)` or iterate directly in a `for` loop.
