---
type: concept
title: "Reading error messages and tracebacks"
difficulty: easy
tags: [errors, debugging, traceback, basics]
revision:
  - "**Syntax errors** break Python's grammar rules before running; **runtime errors** (exceptions) happen while running"
  - "Always read a **traceback** from the **bottom line upward**: error type + message first, then line number"
  - "If a **`SyntaxError`** points at a fine-looking line, check the line **above** it for an unclosed bracket or quote!"
---

Errors happen to every programmer — Python error messages are not failures, they are diagnostic clues telling you **what** went wrong and **where**.

Python reports errors in two stages:

1. **Syntax / Parse errors (`SyntaxError`, `IndentationError`):** Caught while Python reads your file _before_ line 1 starts. Nothing runs until syntax is valid!
2. **Runtime errors (`NameError`, `TypeError`, `ValueError`):** Syntax is valid so the program starts, **but** fails when executing a specific line — printing a **traceback** (stack report).

```python
# When greeting was never defined, calling `print(greeting)` produces:
# Traceback (most recent call last):
#   File "hello.py", line 1, in <module>
#     print(greeting)
#           ^^^^^^^^
# NameError: name 'greeting' is not defined
print("Read error bottom-up: NameError -> line 1 -> check spelling or quotes!")
```

The screen shows:

```text
Read error bottom-up: NameError -> line 1 -> check spelling or quotes!
```

**How to read any traceback in 3 steps:**

1. **Start at the bottom line:** `NameError: name 'greeting' is not defined` names the exact category and cause.
2. **Look just above it for the file & line number:** `File "hello.py", line 1` (Python 3.11+ also adds `^^^^^` pointers directly under the offending token!).
3. **Remember the line-above rule for `SyntaxError`:** If Python highlights an innocent line, look **one line above** — forgetting a closing `)` or `"` makes Python realize the mistake only when it hits the _next_ line!

| Common error       | Typical beginner cause                                |
| ------------------ | ----------------------------------------------------- |
| `SyntaxError`      | Missing quote `"`, missing closing `)`, typo in colon |
| `IndentationError` | Accidental leading spaces or misaligned block         |
| `NameError`        | Misspelled name (`Print`, `true`) or missing quotes   |
| `TypeError`        | Mixing incompatible types (`"Age: " + 20`)            |
| `ValueError`       | Right type, unusable value (`int("abc")`)             |
