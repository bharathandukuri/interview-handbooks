---
type: concept
title: "Debugging (breakpoint(), f'{x=}') and structured logging vs print()"
difficulty: easy
tags: [debugging, logging, stdlib, clean-code]
related: [python.errors-and-files.reading-and-writing-files-with]
---

Sprinkling `print("HERE 1")`, `print("HERE 2")` works on a 10-line exercise, **but** falls apart in real services where you need timestamps, severity levels, log filtering, or live variable inspection mid-crash.

**1. Interactive debugging (`breakpoint()` + debug f-strings):**

- Drop **`breakpoint()`** anywhere in code (Python 3.7+): execution pauses right on that line in **`pdb`** (**Python Debugger**)! Core commands: `p expr` (inspect value), `n` (next line), `s` (step into function), `l` (show source), `c` (continue), `q` (quit).
- Quick inline inspect: **`print(f"{total=}")`** prints `total=42` cleanly without typing `"total="` manually!

**2. Proper `logging` over `print()`:**

```python
import io
import logging

stream = io.StringIO()
logger = logging.getLogger("billing")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler(stream)
handler.setFormatter(logging.Formatter("%(levelname)s | %(name)s | %(message)s"))
logger.handlers = [handler]
logger.propagate = False

user_id = 42
logger.debug("Verbose trace — hidden because level is INFO")
logger.info("Charge succeeded for user %s", user_id)      # lazy `%s` formatting!
logger.warning("Retry #%d triggered", 2)

print(stream.getvalue().strip())
```

The screen shows:

```text
INFO | billing | Charge succeeded for user 42
WARNING | billing | Retry #2 triggered
```

**Three production `logging` rules & edge cases:**

- **Severity order (`DEBUG < INFO < WARNING < ERROR < CRITICAL`):** By default Python's root logger only emits `WARNING` and above!
- **Pass `%s` arguments lazily (`logger.info("User %s", uid)`) instead of eager f-strings:** If `DEBUG` logging is disabled in production, `logger.debug("Payload: %s", big_obj)` skips formatting strings completely (zero wasted CPU!).
- **Log tracebacks inside `except` using `logger.exception("Failed")`:** Automatically attaches the full stack trace at `ERROR` level without manually calling `traceback.format_exc()`. Never call `logging.basicConfig()` inside reusable library modules — let the application entrypoint configure handlers!
