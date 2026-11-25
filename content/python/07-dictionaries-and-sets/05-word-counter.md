---
type: problem
title: "Word frequency counter"
difficulty: easy
complexity:
  time: "One pass over words"
  space: "Stores distinct words"
approach: "Split lowercase text and accumulate counts with dict.get()"
tags: [dicts, strings, counting, practice]
related:
  [
    python.dictionaries-and-sets.counting-pattern-with-dicts,
    python.lists-and-tuples.split-and-join,
  ]
---

## Problem

Given a sentence (with mixed uppercase/lowercase and extra spaces), count how many times each word appears cleanly. Handle empty or whitespace-only input.

```text
"To be or NOT to be" -> {'to': 2, 'be': 2, 'or': 1, 'not': 1}
"   "                -> {}
```

## Hint

- Normalize the sentence with `.lower()` first so `"To"` and `"to"` count together.
- Call `.split()` with no arguments so extra spaces do not create empty `""` keys.
- Use `counts[w] = counts.get(w, 0) + 1`.

## Solution

```python
text = "  To be   or NOT to be  "
counts = {}

for word in text.lower().split():
    counts[word] = counts.get(word, 0) + 1

print(counts)
```

## Walkthrough

1. `text.lower()` turns `"To"` and `"NOT"` lowercase so case does not split the same word into two keys.
2. `.split()` splits on any run of whitespace and discards leading/trailing spaces (so `"   ".split()` becomes `[]`, giving `{}` safely!).
3. The loop counts every word in a single pass with `.get(word, 0) + 1`.
