---
type: problem
title: "Count vowels in text"
difficulty: easy
complexity:
  time: "Grows with text length"
  space: "Tiny"
approach: "Normalize with .lower() and sum .count() for each vowel"
tags: [strings, methods, practice]
related:
  [python.strings.case-and-strip-methods, python.strings.find-count-and-replace]
---

## Problem

Ask the user for any sentence and count how many vowels (`a`, `e`, `i`, `o`, `u`) appear, counting both uppercase and lowercase letters.

```text
Enter text: I love Python
Vowels: 4
```

```text
Enter text: Why?
Vowels: 0
```

(The phrase after the colon is what the user types.)

## Hint

- Turn the input lowercase right away using `.lower()` so `"A"` and `"a"` both count together.
- Call `.count("a")`, `.count("e")`, `.count("i")`, `.count("o")`, and `.count("u")` and add them.
- Use an f-string for the output.

## Solution

```python
text = input("Enter text: ").lower()
vowels = (
    text.count("a")
    + text.count("e")
    + text.count("i")
    + text.count("o")
    + text.count("u")
)
print(f"Vowels: {vowels}")
```

## Walkthrough

Converting `input(...)` straight with `.lower()` handles `"I"`, `"O"`, or any mixed case in one step without altering uppercase inputs separately.

Each `.count(...)` scans the string cleanly.

**Edge cases:**

- Empty string `""` or text with no vowels like `"Why?"` returns `0` cleanly without errors.
- Accented characters or `y` are excluded by the problem rule (`a, e, i, o, u` only). In Chapter 5 (Loops), you will also learn how to do this by walking through the text one character at a time.
