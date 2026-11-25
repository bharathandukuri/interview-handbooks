---
type: concept
title: "Defining and calling functions with def and return"
difficulty: easy
tags: [functions, def, basics]
revision:
  - "Define a function with `def name(parameters):`; **call** it with brackets `name(arguments)`"
  - "**Parameters** are the names in `def`; **arguments** are the real values passed at the call site"
  - "A function without a `return` statement (or bare `return`) implicitly returns **`None`**"
---

A **function** wraps a reusable piece of code under a name so you write it once and run it anywhere.

```python
def greet(name):                    # `name` is a PARAMETER
    """Return a friendly greeting."""   # docstring: explains what the function does
    return f"Hello, {name}!"        # `return` hands the result back to the caller

def say_hi(name):
    print(f"Hi, {name}")            # prints only — no `return`!

msg = greet("Ada")                  # "Ada" is an ARGUMENT
nothing = say_hi("Bob")
print("Returned from greet:", msg)
print("Returned from say_hi:", nothing)
```

The screen shows:

```text
Hi, Bob
Returned from greet: Hello, Ada!
Returned from say_hi: None
```

**Important distinctions and edge cases:**

- **`print()` vs `return`:** Beginners often confuse them! `print()` only displays text on screen; `return` sends a real value back to the caller so you can store it (`msg = greet("Ada")`), pass it to another function, or test it. Notice `say_hi("Bob")` had no `return`, so Python automatically returned **`None`**.
- **Forgetting `()`:** Writing `greet` (without parentheses) refers to the function object itself — it does **not** call it!
- **Docstrings (`"""..."""`):** A string literal on the very first line inside `def` becomes documentation visible in editors and via `help(greet)`.
