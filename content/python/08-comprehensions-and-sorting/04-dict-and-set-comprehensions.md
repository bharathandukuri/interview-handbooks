---
type: concept
title: "Dictionary and set comprehensions"
difficulty: easy
tags: [comprehensions, dicts, sets, pythonic]
related:
  [
    python.comprehensions-and-sorting.list-comprehensions,
    python.dictionaries-and-sets.what-is-a-dictionary,
  ]
revision:
  - "**Dict comprehension** (`{k: v for ...}`) requires a colon `:` between key and value"
  - "**Set comprehension** (`{expr for ...}`) uses `{ }` with no colon and deduplicates automatically"
---

The exact same comprehension pattern works with curly braces `{ }` to create **dictionaries** and **sets**:

```python
words = ["Ada", "Bob", "Ada", "Cara"]

# Dict comprehension (notice `k: v` with colon):
word_lengths = {w: len(w) for w in words}
print(word_lengths)

# Filtering a dict safely (builds a NEW dict — never mutates mid-loop!):
scores = {"Ada": 92, "Bob": 55, "Cara": 81}
passed = {name: score for name, score in scores.items() if score >= 60}
print(passed)

# Set comprehension (no colon -> unique items only!):
first_letters = {w[0].lower() for w in words}
print(sorted(first_letters))
```

The screen shows:

```text
{'Ada': 3, 'Bob': 3, 'Cara': 4}
{'Ada': 92, 'Cara': 81}
['a', 'b', 'c']
```

**Edge case — flipping keys and values (`{v: k for k, v in d.items()}`):**
Because dictionary keys must be unique, inverting `{"Ada": 3, "Bob": 3}` produces `{3: "Bob"}` — the **last** duplicate value overwrites earlier ones! And all values being inverted must be **hashable** (so `list` values will raise `TypeError`).
