---
type: concept
title: "Multi-level sorting using tuple comparison and Timsort stability"
difficulty: medium
tags: [sorting, tuples, timsort, patterns]
related: [python.comprehensions-and-sorting.sorted-and-sort-with-key]
revision:
  - "Tuples compare **element by element** from index `0`: `(2, 'apple') < (2, 'bat') < (3, 'ant')`"
  - "Because Python's sort is **stable**, sorting by the secondary key *first* and primary key *second* breaks ties cleanly!"
---

Suppose you want to sort words by **shortest length first**, and break ties **alphabetically** (so `"hi"` comes before `"is"`). Python compares tuples left to right (**lexicographically**): if the first element ties, Python automatically compares the second element!

```python
words = ["zebra", "is", "hi", "ant", "at"]

# Technique 1: pair keys in a tuple (key1, key2), sort, and extract!
pairs = [(len(w), w.lower(), w) for w in words]
ordered = [w for _, _, w in sorted(pairs)]
print(ordered)

# Technique 2: two-pass stable sort (secondary key FIRST, primary key SECOND!)
by_alpha = sorted(words, key=str.lower)
by_len_then_alpha = sorted(by_alpha, key=len)
print(by_len_then_alpha)
```

The screen shows:

```text
['at', 'hi', 'is', 'ant', 'zebra']
['at', 'hi', 'is', 'ant', 'zebra']
```

**Why Technique 2 works (Timsort stability!):**
First `by_alpha` puts `"at", "hi", "is"` in alphabetical order. Then sorting by `len` keeps equal-length items (`len == 2`) in the **exact alphabetical order** already set by the first sort! This trick is super handy whenever one key goes ascending and another goes descending (`reverse=True`)!
