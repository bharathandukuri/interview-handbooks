---
type: concept
title: "Variable scope and the LEGB lookup rule"
difficulty: medium
mostAsked: true
tags: [functions, scope, legb]
related: [python.functions.defining-and-calling-functions]
revision:
  - "Python looks up names in **LEGB** order: **L**ocal -> **E**nclosing -> **G**lobal -> **B**uilt-in"
  - "Variables created inside a function are **local** and disappear when the function returns"
  - "Use `nonlocal` to rebind an enclosing function's variable; use `global` (sparingly) for module globals"
---

Where can a variable be seen, and what happens if two variables share the same name? Python resolves every name using the **LEGB rule**, searching from innermost to outermost:

1. **Local (L):** Names assigned inside the current function (`def` / `lambda`).
2. **Enclosing (E):** Names in any outer function wrapping the current nested function.
3. **Global (G):** Names at the top level of the current module/file.
4. **Built-in (B):** Python's pre-loaded names (`len`, `print`, `sum`, `max`, `int`).

```python
x = "global"

def outer():
    x = "enclosing"
    def inner():
        x = "local"
        print("inside inner:", x)    # finds L first -> "local"
    inner()
    print("inside outer:", x)        # outer still has its own -> "enclosing"

outer()
print("outside:", x)                 # global stays untouched -> "global"
```

The screen shows:

```text
inside inner: local
inside outer: enclosing
outside: global
```

**Rebinding outer names (`global` vs `nonlocal`) and shadowing:**

- Without `global` or `nonlocal`, assigning `x = ...` inside a function creates a separate local variable without touching the outer `x`. `nonlocal x` rebinds the enclosing function's `x`; `global x` rebinds the module's `x` (avoid `global` when possible — pass arguments and `return` new values instead!).
- **Do not shadow built-ins:** Naming a local variable `list = [1, 2]` or `sum = 0` hides Python's built-in `list()` or `sum()` inside that scope (**B** comes _after_ **L** and **G**)!
