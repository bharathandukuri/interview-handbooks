---
type: problem
title: "Sliding window pattern: Longest Substring Without Repeating Characters"
difficulty: medium
mostAsked: true
complexity:
  time: "O(n) — single right-pointer pass over string of length n"
  space: "O(min(n, charset)) for the last_seen dictionary"
approach: "Track last seen index per character and jump left = max(left, last_seen[ch] + 1) cleanly"
tags: [interviews, sliding-window, strings, hash-map]
related: [python.interview-problem-set.interview-pattern-playbook]
revision:
  - "Maintain window `[left, right]` with all unique characters using `last_seen: dict[str, int]`"
  - "ALWAYS compute **`left = max(left, last_seen[ch] + 1)`** so stale characters left of `left` (like `'a'` in `'abba'`) never push `left` backward!"
---

## Problem

Given a string `s`, return the length of the **longest contiguous substring** containing **no duplicate characters**.

Edge cases to verify:

- Empty string `""` -> `0`
- All identical characters `"bbbb"` -> `1`
- Palindrome trap **`"abba"`** -> `2` (`"ab"` or `"ba"`)!
- Spaces / symbols `"a b a"` -> `3` (`"a b"` or `"b a"`)

## Hint

- Brute-force checks every `(i, j)` substring in `O(n^2)` or `O(n^3)`.
- Maintain a sliding window `[left, right]` plus `last_seen[ch] = right`.
- When `ch` already exists in `last_seen` **at or after `left`** (`last_seen[ch] >= left`), jump `left` directly to `last_seen[ch] + 1` (compactly written as `left = max(left, last_seen[ch] + 1)`!).

## Solution

```python
def length_of_longest_substring(s: str) -> int:
    last_seen: dict[str, int] = {}
    left = 0
    best = 0

    for right, ch in enumerate(s):
        if ch in last_seen:
            left = max(left, last_seen[ch] + 1)   # `max` prevents moving `left` backward!
        last_seen[ch] = right
        best = max(best, right - left + 1)

    return best

for sample in ["abcabcbb", "bbbbb", "pwwkew", "abba", ""]:
    print(f"{sample!r:>10} -> {length_of_longest_substring(sample)}")
```

## Walkthrough

Trace **`"abba"`** carefully — this is the exact test case interviewers watch for:

- `right=0 ('a')`: `left=0`, `last_seen={'a':0}`, `best=1`
- `right=1 ('b')`: `left=0`, `last_seen={'a':0,'b':1}`, `best=2`
- `right=2 ('b')`: `'b'` was seen at `1` -> `left = max(0, 1 + 1) = 2`, `last_seen['b']=2`, `best=2`
- `right=3 ('a')`: `'a'` is still in `last_seen` at old index `0` (OUTSIDE the current window `[2, 3]`)! Writing `left = max(2, 0 + 1)` keeps `left = 2` (size `3 - 2 + 1 = 2`), whereas forgetting `max()` would jump `left` backward to `1` and falsely return `3`!
