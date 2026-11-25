---
type: question
title: "Explain *args, **kwargs, mutable default traps, and LEGB"
difficulty: medium
mostAsked: true
tags: [functions, args, kwargs, scope, interviews]
related:
  [
    python.functions.args-and-kwargs,
    python.functions.mutable-default-argument-pitfall,
    python.functions.scope-and-legb-rule,
  ]
revision:
  - "`*args` collects extra positional arguments into a **`tuple`**; `**kwargs` collects extra keyword arguments into a **`dict`**"
  - "Never write `def f(x=[]):` — default expressions run **once at `def` time**; use `x=None` instead"
  - "Python looks up names in **LEGB** order (**L**ocal -> **E**nclosing -> **G**lobal -> **B**uilt-in), determined at compile time"
---

## Answer

These four topics test whether you know how Python defines, calls, and resolves variables inside functions:

1. **`*args` and `**kwargs`:**
   - `*args` packs any extra positional arguments into a **`tuple`**; `**kwargs` packs any extra keyword arguments into a **`dict`**.
   - Standard parameter order in a signature is: `def fn(pos_only, /, normal, *args, kw_only=..., **kwargs):`. At a call site, `*iterable` and `**mapping` unpack containers back into individual arguments.
2. **Mutable default argument trap:**
   - Default expressions (`def add(item, cart=[])`) are evaluated **once** when `def` executes, **not** on each call. That same `list` stays stored in `add.__defaults__` and accumulates across calls. Always use `cart=None` and initialize `if cart is None: cart = []` inside the function.
3. **Scope and the LEGB rule:**
   - Python searches scopes from innermost to outermost: **L**ocal -> **E**nclosing (outer `def`) -> **G**lobal (module) -> **B**uilt-in (`len`, `sum`).
   - Assigning `x = ...` or `x += 1` **anywhere** in a function marks `x` as local for the whole function body at compile time; reading `x` before assigning it raises **`UnboundLocalError`** unless declared `nonlocal x` (enclosing) or `global x` (module).

**A short answer for an interview:** `*args` and `**kwargs` capture variable positional (`tuple`) and keyword (`dict`) arguments; default values are evaluated once at function definition time (so use `None` instead of `[]`/`{}`); and Python resolves names statically by scope in Local -> Enclosing -> Global -> Built-in order.

## Why interviewers ask

Wrapper functions, decorators, caching helpers, and API clients rely heavily on `*args`/`**kwargs` forwarding and closures. Meanwhile, mutable defaults and `UnboundLocalError` are top-five production bugs in Python interviews and code reviews.

## Follow-ups

- **"Why are `args` and `kwargs` named that way?"** Pure convention — only the asterisks `*` and `**` matter (`*items`, `**options` work identically).
- **"What happens if `lambda: i` is created inside a `for i in range(3):` loop?"** All lambdas share the single loop variable `i`, which ends at `2` (**late binding**), so every call returns `2` unless captured early via `lambda i=i: i`.
