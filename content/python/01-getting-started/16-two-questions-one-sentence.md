---
type: problem
title: "Chapter challenge: interactive two-question reply"
difficulty: easy
complexity:
  time: "Instant (O(1))"
  space: "Tiny (O(1))"
approach: "Store two input() responses in descriptive variables and format multi-line replies with sep=''"
tags: [input, print, practice]
related: [python.getting-started.greet-the-user]
---

## Problem

Write a program that asks **two** questions (`name` and `food`) and prints **two** personalized lines matching exact spacing and punctuation:

```text
What is your name? Mira
What is your favourite food? Dosa
Mira loves Dosa!
Nice choice, Mira.
```

Notice the edge details: no space before `!` on line 1, no space before `.` on line 2, and `name` is reused across both output lines!

## Hint

- Store each `input(...)` answer in its own variable (`name`, `food`) — a variable remembers its text so you can print `name` multiple times without asking twice.
- Use `sep=""` on both `print()` lines and place `" loves "` (with spaces on both sides) inside quotes.

## Solution

```python
name = input("What is your name? ")
food = input("What is your favourite food? ")

print(name, " loves ", food, "!", sep="")
print("Nice choice, ", name, ".", sep="")
```

## Walkthrough

1. Each `input(...)` waits for the user, saves their answer in a variable (`name` and `food`), and remembers it until the program ends (unless reassigned later).
2. Reusing `name` in two different `print()` lines prints `Mira` twice cleanly.
3. Using `sep=""` keeps `!` and `.` attached right after `Dosa` and `Mira`, while `" loves "` keeps clear spaces between the words!
