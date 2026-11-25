---
type: problem
title: "Chapter challenge: a friendly reply"
difficulty: easy
complexity:
  time: "Instant"
  space: "Tiny"
approach: "Two input() calls and two print() calls"
tags: [input, print, practice]
related: [python.getting-started.greet-the-user]
---

## Problem

Write a program that asks **two** questions and then shows **two** lines.

```text
What is your name? Mira
What is your favourite food? Dosa
Mira loves Dosa!
Nice choice, Mira.
```

(The words `Mira` and `Dosa` are what the user types.)

## Hint

- Call `input()` two times and save each answer in its own variable.
- Use `sep=""` and put the spaces you need inside the quotes.
- You can use a saved answer as many times as you like. Here `name` is used twice.

## Solution

```python
name = input("What is your name? ")
food = input("What is your favourite food? ")

print(name, " loves ", food, "!", sep="")
print("Nice choice, ", name, ".", sep="")
```

## Walkthrough

The two `input()` lines save the answers in `name` and `food`.

Each `print()` builds one line from separate pieces. Because of `sep=""`, Python adds nothing between the pieces, so every space and every `!` or `.` comes exactly from what we typed.

Notice that `name` shows up in both lines. A variable keeps its value until you change it.
