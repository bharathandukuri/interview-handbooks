---
type: problem
title: "Chapter challenge: group words by first letter"
difficulty: medium
mostAsked: true
complexity:
  time: "One pass over words (O(n))"
  space: "Stores grouped words in dict"
approach: "Normalize case, guard empty strings, group with dict.setdefault()"
tags: [dicts, lists, strings, edge-cases, practice]
related:
  [
    python.dictionaries-and-sets.reading-updating-and-deleting,
    python.lists-and-tuples.split-and-join,
  ]
revision:
  - "Skip empty strings `if not w:` before accessing `w[0]` (`IndexError` guard)"
  - "`groups.setdefault(key, []).append(w)` inserts `[]` only if `key` is missing, then appends"
---

## Problem

Given a list of words (which might contain mixed uppercase/lowercase and empty/whitespace strings `""` or `"  "`), group all valid words into a dictionary keyed by their **lowercase first letter**.

```text
["Apple", "ant", "", "Banana", "bat"] -> {'a': ['Apple', 'ant'], 'b': ['Banana', 'bat']}
```

## Hint

- Strip whitespace with `w.strip()` and skip empty entries (`if not clean: continue`) so `clean[0]` never raises `IndexError`!
- Extract the grouping key `key = clean[0].lower()`.
- Use `groups.setdefault(key, []).append(clean)` (or check `if key not in groups: groups[key] = []` first — remember why `dict.fromkeys` fails here!).

## Solution

```python
words = ["Apple", "ant", "", "  ", "Banana", "bat"]
groups = {}

for raw in words:
    w = raw.strip()
    if not w:
        continue
    key = w[0].lower()
    groups.setdefault(key, []).append(w)

print(groups)
```

## Walkthrough

1. Guarding `w = raw.strip()` and `if not w: continue` safely ignores `""` and `"  "` before touching index `w[0]`.
2. `w[0].lower()` ensures `"Apple"` and `"ant"` share the `'a'` bucket instead of separating `'A'` and `'a'`.
3. `groups.setdefault(key, []).append(w)` looks up `key`; if missing, creates a **fresh** `[]` specifically for that key and returns it so `.append(w)` adds cleanly.
4. Notice why `groups` stays safe: unlike `dict.fromkeys(keys, [])`, each missing key gets its own newly allocated empty list!
