---
type: problem
title: "Most common non-banned word"
difficulty: easy
complexity:
  time: "O(n log n) or O(n) for counting + min/max tie-break"
  space: "O(u) for u unique words"
approach: "Normalize case, exclude banned words in an O(1) set, count with Counter, pick highest count (alphabetical on ties)"
tags: [collections, counter, strings, practice]
related: [python.modules-and-stdlib.collections-counter-defaultdict-deque]
---

## Problem

Given a list of words `words` (or mixed-case strings) and an optional iterable `banned`, write `most_common_word(words, banned=None)` to return the most frequent non-banned word in lowercase.

Rules and edge cases:

- Treat words case-insensitively (`"Python"` and `"python"` match).
- Break count ties **alphabetically** (for example `"apple"` beats `"banana"` if both appear `2` times).
- If `words` is empty, or every word is banned (or blank `""`), return `None`.

```text
most_common_word(["Go", "python", "Python", "go", "go"], banned=["go"]) -> "python"
most_common_word(["b", "a", "b", "a"])                                -> "a"
most_common_word(["skip"], banned=["skip"])                           -> None
```

## Hint

- Convert `banned` once into a lowercase `set`: `banned_set = {w.lower() for w in (banned or [])}`.
- Build `counts = Counter(...)` skipping banned or empty strings.
- Guard `if not counts: return None` before finding the winner!
- Use `min(counts.items(), key=lambda pair: (-pair[1], pair[0]))[0]` — negate count so highest count wins, and tie-break ascending on the word!

## Solution

```python
from collections import Counter

def most_common_word(words, banned=None):
    banned_set = {w.lower() for w in (banned or [])}
    counts = Counter(
        cleaned
        for raw in words
        if (cleaned := raw.strip().lower()) and cleaned not in banned_set
    )
    if not counts:
        return None
    winner, _ = min(counts.items(), key=lambda pair: (-pair[1], pair[0]))
    return winner

print(most_common_word(["Go", "python", "Python", "go", "go"], banned=["go"]))
print(most_common_word(["b", "a", "b", "a"]))
print(most_common_word(["skip"], banned=["skip"]))
print(most_common_word([]))
```

## Walkthrough

Notice why **`min(..., key=lambda pair: (-pair[1], pair[0]))`** beats `counts.most_common(1)`:

- `counts.most_common(1)` returns the first tied word in _insertion order_, **not** alphabetical order! On `["b", "a", "b", "a"]`, `most_common(1)` would return `"b"` instead of `"a"`.
- Finding the minimum tuple `(-count, word)` scans `counts` once in **`O(u)`** time (faster than sorting the whole dictionary in `O(u log u)`!) while guaranteeing deterministic alphabetical tie-breaking.
- Using `walrus :=` cleanly normalizes whitespace/casing once inside the generator expression passed to `Counter` (keeping peak memory down to only the unique allowed words).
