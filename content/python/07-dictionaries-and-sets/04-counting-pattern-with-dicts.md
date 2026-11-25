---
type: concept
title: "The frequency counting pattern with dictionaries"
difficulty: easy
mostAsked: true
tags: [dicts, patterns, counting]
related: [python.dictionaries-and-sets.reading-updating-and-deleting]
revision:
  - "Build frequency maps cleanly using `counts[x] = counts.get(x, 0) + 1`"
  - "Counting with a dictionary runs in linear `O(n)` time — each lookup and update takes `O(1)`"
---

One of the most common tasks in both everyday scripts and coding interviews is counting how many times each item appears (building a **frequency map**).

```python
letters = "abracadabra"
counts = {}

for ch in letters:
    counts[ch] = counts.get(ch, 0) + 1

print(counts)
```

The screen shows:

```text
{'a': 5, 'b': 2, 'r': 2, 'c': 1, 'd': 1}
```

Watch how `counts[ch] = counts.get(ch, 0) + 1` works on every turn without needing `if ch in counts:`:

- The **first time** Python sees `'a'`, `'a'` is missing, so `.get('a', 0)` returns `0`. Adding `1` saves `counts['a'] = 1`.
- The **second time**, `.get('a', 0)` returns `1`. Adding `1` updates `counts['a'] = 2`.

This runs in one quick pass (`O(n)` total time), and handles empty input (`""` -> `{}`) cleanly. In Chapter 11, you will also meet `collections.Counter` and `collections.defaultdict(int)`, which wrap this exact pattern into one line!
