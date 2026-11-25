---
type: problem
title: "Valid Palindrome (Alphanumeric)"
difficulty: easy
complexity:
  time: "O(n)"
  space: "O(1)"
approach: "Two Pointers"
tags: [strings, two-pointers]
---

## Problem

Given a string `s`, return `True` if it reads the same forward and backward after converting uppercase letters to lowercase and ignoring all non-alphanumeric characters.

```
Input:  s = "A man, a plan, a canal: Panama"
Output: True
```

## Hint

- Can you scan from both ends with `left` and `right` indices without allocating a cleaned copy?
- `ch.isalnum()` checks letters and digits in one call.

## Solution

```python
def is_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True
```

## Walkthrough

Two pointers start at opposite ends and skip over spaces/punctuation using `.isalnum()`. When both point at valid characters, compare `.lower()`. Any mismatch returns `False` immediately. Because we move inward without building a filtered string, time is O(n) and extra space is O(1).
