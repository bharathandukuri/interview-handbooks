---
type: problem
title: "Reverse a string"
difficulty: easy
complexity:
  time: "Grows with text length"
  space: "Grows with text length"
approach: "Slice backwards with [::-1]"
tags: [strings, slicing, practice]
related: [python.strings.slicing-cut-a-piece, python.strings.f-strings]
---

## Problem

Ask the user to type any text and print it backwards. Make sure single letters and empty input do not crash.

```text
Enter text: Python
Reversed: nohtyP
```

```text
Enter text: a
Reversed: a
```

(The text after the colon is what the user types.)

## Hint

- Save the input in a variable called `text`.
- Slicing with a negative step `text[::-1]` walks from the last index back to `0`.
- Remember Chapter 1: if you have not read f-strings yet (card `07`), you can also use `"Reversed: " + backwards`.

## Solution

```python
text = input("Enter text: ")
backwards = text[::-1]
print("Reversed:", backwards)
```

## Walkthrough

`text[::-1]` creates a reversed copy without altering `text`.

**Edge cases:**

- **Empty string (`""`):** `""[::-1]` safely returns `""` (never `IndexError`).
- **One character (`"a"`):** `"a"[::-1]` returns `"a"`.
- **Spaces and punctuation:** `"a b!"[::-1]` keeps every character and produces `"!b a"`.
