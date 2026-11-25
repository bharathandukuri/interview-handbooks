---
type: concept
title: "Variable scope and the LEGB rule"
difficulty: medium
mostAsked: true
tags: [functions, scoping, legb]
revision:
  - "Python looks up names in **L**ocal → **E**nclosing → **G**lobal → **B**uilt-in order"
  - "Assigning to a name anywhere in a function marks it local — causing `UnboundLocalError` if read first"
  - "Use `nonlocal` to rebind an enclosing closure variable; `global` for module-level names"
---

When Python evaluates a name, it searches four scopes from innermost to outermost (**LEGB**):

1. **Local** — inside the current function
2. **Enclosing** — outer function(s) in nested closures
3. **Global** — module top-level
4. **Built-in** — `len`, `print`, `ValueError`, etc.

```python
def make_counter() -> callable:
    count = 0
    def inc() -> int:
        nonlocal count   # rebinds `count` in enclosing scope
        count += 1
        return count
    return inc
```

**Why `UnboundLocalError` happens:**

```python
x = 10
def broken():
    print(x)   # UnboundLocalError! `x = 20` below makes `x` local for the whole function
    x = 20
```

Python decides variable scope at **compile time**, not line-by-line at runtime. Never shadow built-ins like `list`, `id`, or `sum` with local variable names.
