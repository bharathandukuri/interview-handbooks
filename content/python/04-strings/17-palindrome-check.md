---
type: problem
title: "Chapter challenge: palindrome check"
difficulty: medium
complexity:
  time: "Grows with text length"
  space: "Grows with text length"
approach: "Clean spaces and case, guard empty input, then compare with [::-1]"
tags: [strings, slicing, edge-cases, practice]
related:
  [python.strings.reverse-a-string, python.strings.find-count-and-replace]
---

## Problem

A **palindrome** reads the same forwards and backwards when ignoring spaces and uppercase letters (such as `"racecar"` or `"Never odd or even"`).

Ask the user for text and print `Palindrome` or `Not a palindrome`. Make sure empty text or just spaces prints `Not a palindrome`.

```text
Text: Never odd or even
Palindrome
```

```text
Text:
Not a palindrome
```

## Hint

- Normalize the string using `.strip()`, `.lower()`, and `.replace(" ", "")`.
- Reverse the cleaned string with `cleaned[::-1]`.
- Guard the empty edge case (`if cleaned and cleaned == cleaned[::-1]:`).

## Solution

```python
text = input("Text: ")
cleaned = text.strip().lower().replace(" ", "")

if cleaned and cleaned == cleaned[::-1]:
    print("Palindrome")
else:
    print("Not a palindrome")
```

## Walkthrough

`.strip().lower().replace(" ", "")` turns `"Never odd or even"` into `"neveroddoreven"`, which matches `"neveroddoreven"[::-1]` (`Palindrome`).

**Edge cases handled cleanly:**

- **Whitespace-only or empty input (`""` or `"   "`):** `cleaned` becomes `""` (falsy), so `cleaned and ...` short-circuits to `False` and outputs `Not a palindrome` (instead of saying empty space is a palindrome!).
- **Single letter (`"A"`):** `cleaned` is `"a"`, `"a"[::-1]` is `"a"` -> `Palindrome`.
- (Wait: what about punctuation like `"A man, a plan..."`? In Chapter 5 Loops, you will filter with `.isalnum()` character by character!)
