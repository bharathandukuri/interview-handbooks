---
type: problem
title: "Longest Substring Without Repeating Characters"
difficulty: medium
mostAsked: true
complexity:
  time: "O(n)"
  space: "O(min(n, charset))"
approach: "Sliding Window + last-seen dict"
tags: [sliding-window, strings, hash-map]
revision:
  - "Track each character's last index in `last_seen: dict[str, int]`"
  - "When a repeat falls inside the window (`>= left`), jump `left = last_seen[ch] + 1`"
---

## Problem

Given a string `s`, find the length of the longest substring without repeating characters.

```
Input:  s = "abcabcbb"
Output: 3   ("abc")
```

## Hint

- Maintain a `[left, right]` window of unique characters.
- Don't move `left` backwards when you see a character that occurred _before_ `left`.

## Solution

```python
def length_of_longest_substring(s: str) -> int:
    last_seen: dict[str, int] = {}
    left = best = 0
    for right, ch in enumerate(s):
        if ch in last_seen and last_seen[ch] >= left:
            left = last_seen[ch] + 1
        last_seen[ch] = right
        best = max(best, right - left + 1)
    return best
```

## Walkthrough

Each character `ch` advances `right` once. If `ch` was already seen at or after `left`, advance `left` past the previous occurrence (`last_seen[ch] + 1`). Update `last_seen[ch] = right` and track the maximum window width `right - left + 1`.
