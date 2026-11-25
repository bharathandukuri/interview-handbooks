---
type: question
title: "Explain try/except/else/finally, EAFP, and safe file handling in Python"
difficulty: medium
mostAsked: true
tags: [errors, files, context-managers, interviews]
related:
  [
    python.errors-and-files.try-except-else-finally,
    python.errors-and-files.lbyl-vs-eafp,
    python.errors-and-files.reading-and-writing-files-with,
  ]
revision:
  - "`try` wraps minimal failing code -> `except` catches specific errors -> `else` runs if no error -> `finally` always runs for cleanup"
  - "Avoid bare `except:` because it catches `BaseException` (`KeyboardInterrupt`, `SystemExit`)"
  - "Python prefers **EAFP** (`try`/`except`) and **`with open(..., encoding='utf-8')`** plus streaming `for line in f:` for large files"
---

## Answer

Clean error handling and file I/O in Python come down to four core principles:

1. **`try` / `except` / `else` / `finally`:**
   - Keep `try` focused on the exact statement that might raise, catch **specific exceptions** (most specific before more general), put code that should run _only on success_ inside **`else`** (so bugs there are not accidentally swallowed), and reserve **`finally`** for guaranteed cleanup. Never put `return` inside `finally`, because it overrides active exceptions and earlier returns.
2. **Never use bare `except:`:**
   - Bare `except:` catches `BaseException`, trapping `Ctrl+C` (`KeyboardInterrupt`) and `sys.exit()` (`SystemExit`) along with real programmer typos (`NameError`). Use bare `raise` inside an `except` block when logging/re-throwing so you keep the original traceback, or `raise NewError(...) from err` to chain root causes cleanly.
3. **EAFP over LBYL:**
   - Checking `if path.exists(): open(path)` (LBYL) creates a TOCTOU race condition and duplicates lookups. Python prefers EAFP (`try: with open(path) ... except FileNotFoundError:`).
4. **Safe file and data handling:**
   - Always use `with open(path, mode, encoding="utf-8") as f:` so the file closes even when an exception occurs, stream huge files with `for line in f:` (`O(1)` buffer memory) rather than `.read()`, pass `newline=""` for CSVs, and remember JSON turns `int` keys into `str` and `tuple`s into `list`s.

**A short answer for an interview:** Use minimal `try` blocks with specific `except` clauses, put post-success logic in `else`, reserve `finally` for cleanup, prefer EAFP over pre-checks to avoid race conditions, and open files using `with open(..., encoding="utf-8")` while streaming large inputs line by line.

## Why interviewers ask

Resource leaks, swallowed exceptions (`except: pass`), Windows/Linux encoding mismatches, and out-of-memory crashes from `.read()` on large production files are everyday bugs. Interviewers look for habits that fail loudly and cleanly under unexpected inputs.

## Follow-ups

- **"Why shouldn't `assert` validate user input or API payloads?"** Running Python with `-O` (`python -O`) removes all `assert` statements completely; validate inputs with explicit `if ...: raise ValueError(...)`.
- **"What happens if `try` and `finally` both contain a `return` statement?"** `finally` wins — its `return` silently replaces `try`'s return value and swallows any unhandled exception, which is why `return` in `finally` is an anti-pattern.
