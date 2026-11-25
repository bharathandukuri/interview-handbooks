---
type: problem
title: "Print a formatted name card"
difficulty: easy
complexity:
  time: "Instant (O(1))"
  space: "Tiny (O(1))"
approach: "Use print() per line, blank print() dividers, and sep='' / sep='-' cleanly"
tags: [print, practice]
related:
  [python.getting-started.print-basics, python.getting-started.sep-and-end]
---

## Problem

Write a program that prints a neat 4-part name card exactly matching this spacing and punctuation:

```text
--- Card ---
Name: Asha
City: Pune

Date: 25-11-2026
```

Requirements:

- Print an empty blank line between `City: Pune` and `Date: 25-11-2026`.
- Print `"25"`, `"11"`, and `"2026"` as three separate arguments joined with `-`, right after `"Date: "` on the **same line**!

## Hint

- An empty `print()` outputs one blank line.
- Put `end=""` on `print("Date: ", end="")` so the next `print("25", "11", "2026", sep="-")` stays right beside `"Date: "`!
- Notice why using `print("Date:", "25", "11", "2026", sep="-")` would be wrong: it would insert a dash `Date:-25-11-2026`!

## Solution

```python
print("--- Card ---")
print("Name: Asha")
print("City: Pune")
print()
print("Date: ", end="")
print("25", "11", "2026", sep="-")
```

## Walkthrough

Look closely at the subtle `sep="-"` pitfall solved cleanly on the last two lines:

- Passing `"Date: "` and the three date pieces into a _single_ `print("Date: ", "25", "11", "2026", sep="-")` would put dashes everywhere (`Date: -25-11-2026`).
- Printing `"Date: "` first with **`end=""`** keeps the cursor on the same line, and the second `print(...)` applies **`sep="-"`** strictly to the three date numbers!
- Using **`print()`** with zero arguments prints a clean blank spacer line without printing `None` or extra spaces.
