---
type: concept
title: "Exception handling, chaining, `assert`, and `ExceptionGroup`"
difficulty: medium
mostAsked: true
tags: [exceptions, error-handling, stdlib]
revision:
  - "`else` runs only if `try` succeeded; `finally` always runs for cleanup"
  - "Preserve root causes with `raise AppError(...) from exc`"
  - "Python 3.11+ adds `ExceptionGroup` and `except*` for concurrent errors"
---

Python's `try` statement supports four clauses — putting success-only logic in `else` avoids accidentally catching errors from your happy-path handler:

```python
try:
    raw = parse_int(text)
except ValueError as exc:
    raise ConfigError("Invalid port") from exc   # preserves cause chain
else:
    start_server(raw)                            # runs only if try succeeded
finally:
    cleanup()                                    # always runs
```

**Key rules:**

- Inherit custom exceptions from `Exception` (never `BaseException`, which includes `KeyboardInterrupt` and `SystemExit`).
- **`assert` is for internal invariants/tests, NOT input validation** — `python -O` strips `assert` statements!
- **Python 3.11+ `ExceptionGroup`:** When `asyncio.TaskGroup` raises multiple errors, catch subgroups with `except* ValueError as eg:`.
- Use `warnings.warn("...", DeprecationWarning)` for non-fatal notices.
