---
type: problem
title: "Hash map pattern: Group Anagrams"
difficulty: medium
mostAsked: true
complexity:
  time: "O(n * k) using 26-letter signature tuple (or O(n * k log k) sorting each word)"
  space: "O(n * k) to store groups and signatures"
approach: "Map every word to a canonical hashable signature key inside a defaultdict(list)"
tags: [interviews, hash-map, strings, anagrams]
related:
  [
    python.dictionaries-and-sets.counting-pattern-with-dicts,
    python.modules-and-stdlib.collections-counter-defaultdict-deque,
  ]
revision:
  - "Anagrams share both the exact sorted character tuple and the exact 26-letter frequency tuple"
  - "Lists are unhashable — convert the signature into a hashable **`tuple`** (`tuple(counts)` or `tuple(sorted(word))`) as the dict key!"
---

## Problem

Given a list of lowercase ASCII strings `words`, group anagrams together (`"eat"`, `"tea"`, `"ate"` share the same letters rearranged).

Handle edge cases cleanly:

- Empty list `[]` -> `[]`
- Single empty strings `["", ""]` -> `[["", ""]]`
- Single-character or non-anagram words (`["a"]`)

```text
group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"])
-> [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]
```

## Hint

- Two words are anagrams if and only if they have the same character counts.
- For lowercase English words `'a'..'z'`, build a 26-slot count array (`counts = [0] * 26`), increment `counts[ord(ch) - ord("a")] += 1`, and turn it into **`tuple(counts)`** (**`O(n * k)`** instead of sorting each word in `O(k log k)`!).
- If Unicode strings may appear, sort characters cleanly (`"".join(sorted(word))`).

## Solution

```python
from collections import defaultdict

def group_anagrams(words: list[str]) -> list[list[str]]:
    groups: defaultdict[tuple[int, ...], list[str]] = defaultdict(list)
    base = ord("a")
    for word in words:
        counts = [0] * 26
        for ch in word:
            counts[ord(ch) - base] += 1
        groups[tuple(counts)].append(word)
    return list(groups.values())

print(group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"]))
print(group_anagrams(["", ""]))
print(group_anagrams([]))
```

## Walkthrough

Notice why **`tuple(counts)`** makes this solution interview-gold:

1. Avoids sorting every string (`O(k log k)` -> **`O(k)`** per word of length $k$), yielding **`O(n * k)`** total time!
2. Handles `""` seamlessly (`counts` is 26 zeros for every `""`, grouping `["", ""]` together cleanly).
3. Remember: **dictionaries cannot use a `list` as a key** (`TypeError: unhashable type: 'list'`), so wrapping `counts` in `tuple(counts)` is essential!
4. Follow-up check: if Unicode (`"café"`) or digits appear cleanly in inputs, switch the key line cleanly to `key = tuple(sorted(word))` (`O(n * k log k)`).
