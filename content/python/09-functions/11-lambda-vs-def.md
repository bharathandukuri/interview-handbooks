---
type: compare
title: "def vs lambda: named functions vs inline callbacks"
difficulty: easy
left: "def function"
right: "lambda expression"
tags: [functions, lambda, clean-code]
related:
  [
    python.functions.defining-and-calling-functions,
    python.functions.first-class-functions-and-lambda,
  ]
---

Both create real callable **function objects** in Python, so they share parameters, defaults, `*args`, `**kwargs`, and LEGB lookup rules — yet they serve different roles:

| Feature                   | `def name(args): ...`                     | `lambda args: expr`                              |
| ------------------------- | ----------------------------------------- | ------------------------------------------------ |
| Name in errors/tracebacks | Real name (`def validate_age` -> clearer) | Always shown as `<lambda>` (harder to debug)     |
| Body size                 | Any number of statements, loops, `if`s    | **Single expression only** (no `return`, loops)  |
| Docstrings (`"""..."""`)  | ✅ Supported (`help(fn)`)                 | ❌ Not supported                                 |
| Assignments inside body   | ✅ `x = 1`, `return x`                    | ❌ Forbidden (except walrus `:=` in rare cases)  |
| Best used for             | Reusable logic, multi-step helpers        | Short one-off callbacks (`sorted(..., key=...)`) |

## Verdict

Use **`lambda`** only when passing a tiny, obvious one-line expression directly to another function like `sorted(users, key=lambda u: u["age"])`. If you feel tempted to assign a lambda to a variable (`square = lambda x: x * x`) — Python's official style guide (PEP 8) advises against it: write **`def square(x):`** instead so stack traces, tests, and docstrings stay clear.
