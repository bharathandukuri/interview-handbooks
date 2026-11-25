---
type: concept
title: "Raising exceptions, re-raising, chaining, and assert"
difficulty: medium
mostAsked: true
tags: [errors, raise, assert, exceptions]
related:
  [
    python.errors-and-files.try-except-else-finally,
    python.errors-and-files.bare-except-pitfall,
  ]
revision:
  - "Use `raise ValueError(...)` to fail fast on invalid input instead of silently returning bad values"
  - "Use bare `raise` inside `except` to log-and-rethrow while keeping the original traceback; use `raise NewError from err` to chain"
  - "Never use `assert` to validate user input — `python -O` strips all `assert` statements completely"
---

When a function receives invalid data, returning `-1` or `None` silently lets bad data spread further into your program. Raising an exception stops execution at the exact line where something went wrong (**fail fast, fail loudly**).

**1. Raising and custom exception names:**

```python
# Preview: `class ... (Exception):` creates a custom error name (classes are covered in Chapter 12)
class NegativeAmountError(Exception):
    pass

def deposit(balance, amount):
    if amount <= 0:
        raise NegativeAmountError(f"amount must be positive, got {amount}")
    return balance + amount

try:
    deposit(100, -25)
except NegativeAmountError as err:
    print("Blocked:", err)
```

The screen shows:

```text
Blocked: amount must be positive, got -25
```

**2. Re-raising and exception chaining (`raise` vs `raise ... from err`):**

- **Log and re-throw cleanly:** inside an `except` block, writing bare **`raise`** (with nothing after it) re-throws the exact same exception and **keeps its original traceback intact**. Never write `raise err` — that resets the traceback line number to the `except` block!
- **Exception chaining (`raise NewErr(...) from err`):** wraps a low-level error (like `KeyError`) inside a clearer high-level error (`ConfigError`) while attaching the root cause (`__cause__`) so debugging still shows what went wrong underneath. Use `from None` only if you intentionally want to hide internal noise.

**3. When NOT to use `assert`:**
`assert condition, "message"` raises `AssertionError` if `condition` is false. Use `assert` **only** for internal developer sanity checks and tests — **never** for security checks, permissions, or validating user input! Running Python in optimized mode (`python -O script.py`) skips every `assert` line completely.
