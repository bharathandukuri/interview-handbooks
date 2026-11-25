---
type: concept
title: "Handling exceptions cleanly with try, except, else, and finally"
difficulty: easy
mostAsked: true
tags: [errors, try-except, finally, edge-cases]
related: [python.errors-and-files.syntax-errors-vs-exceptions]
revision:
  - "`try` wraps risky code; `except ErrorType as err` handles specific expected failures"
  - "`else` runs **only** if `try` succeeded with no exception (keeps `try` small and precise)"
  - "`finally` **always** runs — whether `try` succeeded, failed, or even hit `return`"
---

A `try` block lets your program recover gracefully from expected runtime failures instead of crashing. Python gives `try` **four** optional clauses, and each has a strict job:

1. **`try:`** Code that might raise an expected exception. Keep this block as **small as possible** so you do not accidentally hide unrelated bugs on other lines.
2. **`except ErrorType as err:`** Runs only if `try` raised a matching exception. You can stack multiple `except` blocks (put **more specific** errors above **more general** ones), or group several with a tuple `except (ValueError, TypeError):`.
3. **`else:`** Runs **only when `try` completed without raising any exception**. Anything that _depends_ on `try` succeeding — without wanting its own errors caught by `except` — belongs here!
4. **`finally:`** **Always runs**, no matter what happened: success, handled exception, unhandled exception, `break`, or `return`! Ideal for closing connections or releasing temporary state.

```python
def divide_and_report(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("Cannot divide by zero!")
    except TypeError as err:
        print("Need numbers:", err)
    else:
        print("Success! Result =", result)
    finally:
        print("Cleanup finished.\n")

divide_and_report(10, 2)
divide_and_report(10, 0)
divide_and_report("10", 2)
```

The screen shows:

```text
Success! Result = 5.0
Cleanup finished.

Cannot divide by zero!
Cleanup finished.

Need numbers: unsupported operand type(s) for /: 'str' and 'int'
Cleanup finished.
```

**Important ordering and edge-case rules:**

- **Specific exceptions first:** `FileNotFoundError` is a specialized kind (**subclass**) of `OSError`, and `ZeroDivisionError` is a subclass of `ArithmeticError`. Putting `except OSError:` _before_ `except FileNotFoundError:` would make the specific handler unreachable!
- **Never `return` inside `finally:`:** A `return` statement inside `finally:` silently **overwrites** any return value _and_ swallows any active exception from `try`/`except`! Use `finally:` purely for cleanup, not returning values.
