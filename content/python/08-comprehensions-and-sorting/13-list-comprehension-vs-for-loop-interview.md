---
type: question
title: "When should you choose a comprehension over a normal for loop?"
difficulty: medium
mostAsked: true
tags: [interview, comprehensions, pythonic, readability]
related:
  [
    python.comprehensions-and-sorting.list-comprehensions,
    python.comprehensions-and-sorting.tuple-comprehension-gotcha-and-readability,
  ]
revision:
  - "Use comprehensions to **build a new collection** via a clean 1-step transform or filter"
  - "Use a regular `for` loop for **side effects** (`print`, logging, file writes), complex `try/except`, `break`, or >2 nested loops"
---

## Answer

A **comprehension** (`[expr for x in it if cond]`) is ideal when your goal is strictly **producing a new `list`, `dict`, or `set`** from an existing iterable with a simple transform and/or filter. It reads declaratively and skips repeated `.append()` overhead.

Switch back to a regular **`for` loop** whenever:

1. You only want **side effects** (`print(x)`, saving to a database, writing files) — `[print(x) ...]` wastes memory building `[None, ...]`.
2. You need **early exit (`break`)** or multi-line error handling (`try/except`).
3. The logic needs **deep nesting** (>2 loops) or multiple tricky conditions that become unreadable crammed onto one line.
4. You do not need all elements stored in RAM at once (use a generator expression `(expr for ...)` — Chapter 13!).

A short answer for an interview: "Use comprehensions for clean, side-effect-free collection transformations and filters; stick with a normal `for` loop for side effects, `break`/`try` control flow, or deeply nested logic."

## Why interviewers ask

It separates clean Pythonic code from unreadable "one-liner golf" and shows awareness of memory waste when comprehensions are misused for side effects.

## Follow-ups

- What does `(x for x in items)` actually create if not a tuple?
- In Python 3, can a loop variable inside `[x for x in range(5)]` overwrite an existing variable `x` outside? (No — Python 3 isolates comprehension scope!)
