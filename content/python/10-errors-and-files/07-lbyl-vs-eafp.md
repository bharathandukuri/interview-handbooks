---
type: compare
title: "LBYL vs EAFP: checking first vs trying and catching"
difficulty: medium
mostAsked: true
left: "LBYL (Look Before You Leap)"
right: "EAFP (Ask Forgiveness)"
tags: [errors, pythonic, patterns, concurrency]
related:
  [
    python.errors-and-files.try-except-else-finally,
    python.errors-and-files.reading-and-writing-files-with,
  ]
revision:
  - "**LBYL** ('Look Before You Leap') checks preconditions with `if` before acting, risking TOCTOU file race conditions"
  - "**EAFP** ('Easier to Ask for Forgiveness than Permission') tries the action inside `try:` and catches `except`, which is Python's idiomatic style"
---

Two philosophies exist for handling things that might fail (missing keys, missing files, invalid numbers):

- **LBYL:** check pre-conditions with `if` _before_ acting.
- **EAFP:** perform the action inside `try:` and handle failures in `except:` — Python's idiomatic default.

| Feature                   | LBYL (`if key in d:`)               | EAFP (`try: ... except KeyError:`)              |
| ------------------------- | ----------------------------------- | ----------------------------------------------- |
| Lookup / work count       | Checks twice (`in` then `[key]`)    | Checks once when the key exists (**faster**!)   |
| File / concurrency safety | Vulnerable to **race conditions**   | Atomic: handles missing/deleted file cleanly    |
| When failures are rare    | Extra overhead on every call        | Near-zero overhead in Python 3.11+ (`try` fast) |
| When failures are common  | Cleaner & faster (`if` beats catch) | Exception creation can cost more if frequent    |

## Verdict

Python favors **EAFP** (`try`/`except`) especially for **I/O, files, network calls, and duck typing**. Checking `if path.exists(): open(path)` (LBYL) still suffers from a **TOCTOU** ("time-of-check to time-of-use") race condition: another program could delete the file in the microsecond _between_ `.exists()` and `open()`! Instead, open the file in `try:` and handle `except FileNotFoundError:`. For tiny single-lookup dict defaults, `d.get(key)` stays cleanest.
