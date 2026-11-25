---
type: problem
title: "Greet the user"
difficulty: easy
complexity:
  time: "Instant"
  space: "Tiny"
approach: "input() then print() with sep"
tags: [input, print, practice]
related:
  [python.getting-started.input-gives-text, python.getting-started.sep-and-end]
---

## Problem

Write a program that asks for the user's name and then greets them.

```text
What is your name? Ravi
Hello, Ravi! Welcome to Python.
```

(The word `Ravi` is what the user types.)

## Hint

- Use `input()` and save the answer in a variable called `name`.
- Commas in `print()` add a space between items. That would put a space before the `!`.
- Use `sep=""` and put the spaces you want inside the quotes.

## Solution

```python
name = input("What is your name? ")
print("Hello, ", name, "! Welcome to Python.", sep="")
```

## Walkthrough

`input()` shows the question and waits. The answer is saved in `name`.

Normally `print()` adds a space between items. We do not want a space before the `!`, so we set `sep=""`. That means nothing is added between items, and we type the spaces we need inside the quotes (`"Hello, "` has a space after the comma).

Later, in the Strings chapter, you will learn f-strings. They make this job even easier.
