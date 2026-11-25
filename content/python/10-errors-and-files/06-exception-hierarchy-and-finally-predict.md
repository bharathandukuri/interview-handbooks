---
type: predict
title: "Execution order with LookupError, else, and finally"
difficulty: medium
mostAsked: true
tags: [errors, finally, hierarchy, trace]
related:
  [
    python.errors-and-files.try-except-else-finally,
    python.errors-and-files.syntax-errors-vs-exceptions,
  ]
revision:
  - "`KeyError` and `IndexError` are both subclasses of **`LookupError`**"
  - "`finally` executes **before** a `return` inside `try` or `except` actually leaves the function"
options:
  - "try -> except -> finally\nresult: fallback"
  - "try -> except\nresult: fallback"
  - "try -> except -> else -> finally\nresult: fallback"
  - "KeyError crashes the program"
answer: 0
---

```python
def trace():
    steps = []
    try:
        steps.append("try")
        d = {"a": 1}
        return d["b"]
    except LookupError:
        steps.append("except")
        return "fallback"
    else:
        steps.append("else")
    finally:
        steps.append("finally")
        print(" -> ".join(steps))

print("result:", trace())
```

## Output

```text
try -> except -> finally
result: fallback
```

## Explanation

This trace tests three important exception rules together:

1. **Exception inheritance (`LookupError`):** `d["b"]` raises a `KeyError`. In Python's exception tree, both `KeyError` and `IndexError` inherit from `LookupError`, so `except LookupError:` catches it cleanly!
2. **`else:` is skipped:** Because an exception occurred inside `try`, Python jumps over `else:` straight into `except LookupError:`.
3. **`finally:` runs before `return` completes:** Even though `except` hits `return "fallback"`, Python saves `"fallback"`, executes the entire `finally:` block first (which prints `try -> except -> finally`), and **then** finishes returning `"fallback"` to the caller.
