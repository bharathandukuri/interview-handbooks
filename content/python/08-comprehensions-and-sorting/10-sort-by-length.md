---
type: problem
title: "Sort words by length (preserving original tie order)"
difficulty: easy
complexity:
  time: "O(n log n) via Timsort"
  space: "New sorted list of n words"
approach: "sorted(words, key=len)"
tags: [sorting, lists, strings, practice]
related: [python.comprehensions-and-sorting.sorted-and-sort-with-key]
---

## Problem

Given a list of words, return a **new** list sorted from shortest word to longest word without modifying the original list. If two words have the **exact same length**, keep whichever appeared earlier first! Handle empty strings `""` and empty lists `[]`.

```text
["python", "is", "cool", "hi", "a"] -> ["a", "is", "hi", "cool", "python"]
[]                                  -> []
```

## Hint

- Which sorting helper creates a **new** list without touching the input: `.sort()` or `sorted()`?
- Pass Python's built-in `len` function straight as the `key=` argument (`key=len` — no brackets after `len`!).
- Why do `"is"` and `"hi"` stay in their original `"is"` -> `"hi"` order automatically?

## Solution

```python
words = ["python", "is", "cool", "hi", "a"]
by_length = sorted(words, key=len)
print(by_length)
```

## Walkthrough

1. `sorted(words, key=len)` calls `len(w)` on each word (`6, 2, 4, 2, 1`), sorts by those numbers (`1, 2, 2, 4, 6`), and keeps `words` untouched. Notice we pass `key=len`, **not** `key=len()` — we are handing the function itself to `sorted()`, not calling it right now!
2. **Stability on ties:** `"is"` and `"hi"` both have length `2`. Because Python's Timsort is **stable**, `"is"` stays before `"hi"` automatically!
3. **Edge cases:** `sorted([], key=len)` cleanly returns `[]`, and `""` (length `0`) sorts to the front cleanly.
