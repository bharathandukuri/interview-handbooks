---
type: question
title: "Python basics check: syntax vs runtime errors, indentation, and input()"
difficulty: easy
mostAsked: true
tags: [interview, basics, syntax, input, indentation]
related:
  [
    python.getting-started.indentation,
    python.getting-started.reading-error-messages,
    python.getting-started.input-text-trap,
  ]
revision:
  - "Python uses **4-space indentation** (never mixed tabs/spaces) to group code blocks instead of `{ }`"
  - "**Syntax/Indentation errors** stop the entire script before line 1 runs; **runtime exceptions** occur while executing valid syntax"
  - "`input()` always returns a `str` (`'3' + '4' == '34'`), and Python is strictly **case-sensitive**"
---

## Answer

Early Python interviews and coding screens often probe whether fundamentals are solid:

1. **Why indentation matters in Python:**
   - Leading whitespace is part of Python's grammar — 4 spaces per block level replace `{ ... }`. Mixing tabs and spaces triggers **`TabError`**, and accidental top-level spaces trigger **`IndentationError`**.
2. **`SyntaxError` vs Runtime Exceptions (`NameError`, `TypeError`, `ValueError`):**
   - Grammar errors (`SyntaxError`, `IndentationError`) fail during initial file compilation before line 1 executes. Runtime errors happen mid-execution on valid syntax (`Print("hi")` -> `NameError` because Python is case-sensitive; `int("abc")` -> `ValueError`). Always read tracebacks from the **bottom line** upward.
3. **`input()` and `print()` fundamentals:**
   - `input()` always returns a `str` (even `"25"` or empty `""` on Enter), requiring `int(...)` or `float(...)` before math. `print()` takes positional items separated by `sep=" "` and finished with `end="\n"`.

**A short answer for an interview:** Python uses 4-space indentation as syntax, validates grammar across the whole file before running, treats names case-sensitively, returns strings from `input()`, and separates items in `print()` with `sep=" "` and `end="\n"`.

## Why interviewers ask

Even experienced developers switching from C/JS get bitten by case sensitivity, mixed tabs/spaces, or forgetting `input()` returns strings.

## Follow-ups

- **"What happens if you pass only 1 argument with `sep='-'` to `print('Hello', sep='-')`?"** It prints `Hello` with no dash, because `sep` is only placed _between_ multiple arguments.
- **"In a `.py` file, what happens if line 1 is `print('Start')` and line 2 has a `SyntaxError`?"** Nothing prints — not even `Start`! Python parses and compiles the entire file first, rejecting syntax mistakes before running line 1.
