---
type: pitfall
title: "Bare except: and swallowing exceptions silently"
difficulty: easy
mostAsked: true
tags: [errors, anti-patterns, debugging, gotchas]
related: [python.errors-and-files.try-except-else-finally]
revision:
  - "Bare `except:` catches **`BaseException`**, including `Ctrl+C` (`KeyboardInterrupt`) and `sys.exit()` (`SystemExit`)"
  - "Silently ignoring errors (`except Exception: pass`) hides typos like `NameError` and makes bugs invisible"
  - "Always catch **specific exceptions** (`except ValueError:`) and handle or log them explicitly"
---

## The trap

```python
user_id = "123"

try:
    result = int(usre_id)       # oops: typo in variable name (`usre_id`)!
except:                         # catches EVERYTHING (even NameError & Ctrl+C!)
    result = 0

print("Result:", result)        # silently prints 0 — typo bug stays hidden forever!
```

## The fix

```python
user_id = "123"

try:
    result = int(user_id)
except ValueError:              # catches ONLY bad integer text, never NameError or Ctrl+C!
    result = 0

print("Result:", result)        # 123
```

## Why it happens

Python's error hierarchy has **`BaseException`** at the very root, **above** **`Exception`**:

- `BaseException`
  - `KeyboardInterrupt` (`Ctrl+C`)
  - `SystemExit` (`sys.exit()`)
  - `Exception`
    - `ValueError`, `TypeError`, `KeyError`, `OSError`, etc.

Writing a **bare `except:`** catches every `BaseException`. That traps users when they press `Ctrl+C` in a loop _and_ hides programmer typos (`NameError`, `AttributeError`) behind a fallback! Even `except Exception: pass` hides bugs unless you at least log or narrow down to the exact error you actually expect (`ValueError`, `KeyError`, `FileNotFoundError`).
