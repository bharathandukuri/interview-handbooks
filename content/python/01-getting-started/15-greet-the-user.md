---
type: problem
title: "Greet the user cleanly (controlling spaces with sep='')"
difficulty: easy
complexity:
  time: "Instant (O(1))"
  space: "Tiny (O(1))"
approach: "Read name with input(), print greeting cleanly with sep='' so punctuation touches the name"
tags: [input, print, practice]
related:
  [python.getting-started.input-gives-text, python.getting-started.sep-and-end]
---

## Problem

Write a program that asks for the user's name and prints an exact greeting with **no space** between the name and `!`:

```text
What is your name? Ravi
Hello, Ravi! Welcome to Python.
```

_(Edge check: what goes wrong if you use normal commas `print("Hello,", name, "! Welcome to Python.")`? It prints `Hello, Ravi ! Welcome to Python.` with an awkward extra space before `!`!)_

## Hint

- Read the name: `name = input("What is your name? ")`.
- Pass `sep=""` to `print(...)` so Python adds zero automatic spaces between items.
- Include the needed spaces explicitly **inside** the quotes (`"Hello, "` has one space after the comma; `"! Welcome to Python."` starts immediately with `!`).

## Solution

```python
name = input("What is your name? ")
print("Hello, ", name, "! Welcome to Python.", sep="")
```

## Walkthrough

Notice why controlling **`sep=""`** solves the punctuation gap cleanly:

1. Default `print("Hello,", name, "!")` inserts spaces around every comma, yielding `"Hello, Ravi !"`.
2. Setting `sep=""` tells Python to glue the parts together directly without extra spaces, so `"Hello, "` + `name` + `"! Welcome to Python."` produces **`Hello, Ravi! Welcome to Python.`** cleanly.
3. In Chapter 04, you will also meet **f-strings** (`f"Hello, {name}! Welcome to Python."`), which make mixed text and variables even shorter to write!
