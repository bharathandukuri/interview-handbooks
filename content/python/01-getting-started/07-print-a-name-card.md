---
type: problem
title: "Print a name card"
difficulty: easy
complexity:
  time: "Instant"
  space: "Tiny"
approach: "One print() for each line"
tags: [print, practice]
related:
  [python.getting-started.print-basics, python.getting-started.sep-and-end]
---

## Problem

Write a program that prints a small name card with 3 lines. Use your own details if you like.

```text
Name: Asha
City: Pune
Hobby: Chess
```

**Part 2:** On a new line, print the date `25-11-2026`. Give `print()` three separate items (`"25"`, `"11"` and `"2026"`) and let `print()` add the dashes.

## Hint

- Use one `print()` for each line of the name card.
- Words need quotes.
- For the date, use the `sep` helper.

## Solution

```python
print("Name: Asha")
print("City: Pune")
print("Hobby: Chess")

print("25", "11", "2026", sep="-")
```

## Walkthrough

Each `print()` shows one line and then moves to the next line. Three `print()` calls give three lines.

For the date, we pass three items to one `print()`. Setting `sep="-"` tells Python to put a dash between the items instead of a space, so you get `25-11-2026`.
