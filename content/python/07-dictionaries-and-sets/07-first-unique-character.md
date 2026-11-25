---
type: problem
title: "First unique character in a string"
difficulty: easy
mostAsked: true
complexity:
  time: "Two linear passes (O(n))"
  space: "At most alphabet size"
approach: "Count all frequencies first, then return first index with count == 1"
tags: [dicts, strings, interview, edge-cases, practice]
related: [python.dictionaries-and-sets.counting-pattern-with-dicts]
revision:
  - "Two-pass approach: build character counts in pass 1, then find the first char with `counts[ch] == 1` in pass 2"
---

## Problem

Given a string `s`, print the **index** of the **first** character that appears only once in the whole string. If every character repeats (or the string is empty `""`), print `-1`.

```text
"leetcode"     -> 0   ('l' appears once)
"loveleetcode" -> 2   ('v' is first with count 1)
"aabb"         -> -1
""             -> -1
```

## Hint

- Can you know whether `'e'` at index `1` repeats later without scanning the whole string first?
- **Pass 1:** Count all characters using a dictionary `counts`.
- **Pass 2:** Loop through indices `0 .. len(s) - 1` and stop on the first character whose `counts[s[i]] == 1`!

## Solution

```python
s = "loveleetcode"
counts = {}
for ch in s:
    counts[ch] = counts.get(ch, 0) + 1

answer = -1
for i in range(len(s)):
    if counts[s[i]] == 1:
        answer = i
        break

print(answer)
```

## Walkthrough

1. Pass 1 counts every letter (`{'l': 2, 'o': 2, 'v': 1, 'e': 4, 't': 1, 'c': 1, 'd': 1}`).
2. Pass 2 checks `s` in order from index `0`: index `0` (`'l'`) has count `2`, index `1` (`'o'`) has count `2`, index `2` (`'v'`) has count `1` -> sets `answer = 2` and `break`s immediately!
3. **Edge cases:** For `""` (empty) or `"aabb"`, `counts[s[i]] == 1` never triggers, so `answer` cleanly stays `-1`. Checking counts with a `dict` runs in linear `O(n)` time instead of slow `O(n^2)` `s.count(ch)` inside a loop!
