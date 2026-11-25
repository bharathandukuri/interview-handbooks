---
type: concept
title: "Exception handling: `else`, `finally`, and chaining"
difficulty: medium
tags: [exceptions, error-handling, stdlib]
---

Python's `try` block has four optional clauses — most developers only use two:

```python
try:
    result = risky_call()
except ValueError as exc:
    handle_bad_value(exc)
except (TypeError, KeyError):
    handle_other(exc)
else:
    # Runs ONLY if NO exception was raised in try
    use_result(result)
finally:
    # ALWAYS runs — cleanup goes here
    close_resource()
```

**`else`** is the under-used gem: it means "this code only runs if the `try` succeeded". Separating happy-path code into `else` avoids accidentally catching exceptions raised by your success handler.

**Exception chaining** (`raise X from Y`) preserves the original cause:

```python
try:
    value = int(user_input)
except ValueError as exc:
    raise RuntimeError("Invalid config") from exc
# Traceback shows both: RuntimeError caused by ValueError
```

Use `raise X from None` to suppress the implicit chain (hide implementation details).

**Python 3.11+ — `ExceptionGroup` and `except*`:**

```python
async with asyncio.TaskGroup() as tg:
    tg.create_task(might_fail_a())
    tg.create_task(might_fail_b())
# If multiple tasks raise, they're wrapped in ExceptionGroup

try:
    ...
except* ValueError as eg:   # `except*` catches a subgroup by type
    for exc in eg.exceptions:
        log(exc)
```

`ExceptionGroup` lets you propagate multiple concurrent exceptions without losing any of them.
