---
type: concept
title: "Truthy and falsy: how if treats non-boolean values"
difficulty: easy
mostAsked: true
tags: [booleans, truthiness, none, edge-cases]
related:
  [python.variables-and-types.none, python.operators-and-decisions.and-or-not]
revision:
  - '**Falsy** values act like `False` in conditions: `False`, `None`, `0`, `0.0`, `0j`, `""` (and empty containers later)'
  - 'Almost everything else is **truthy** — including surprising strings like `"False"`, `"0"`, and `" "`!'
  - 'Always check `is None` / `is not None` when `0` or `""` is a valid answer'
---

You can pass any Python value directly into `if`, `while`, `and`, `or`, or `not` — Python checks its **truthiness** automatically.

Only these basic values count as **falsy** (act like `False`):

- `False` and `None`
- Any zero number: `0`, `0.0`, `0j`
- Empty text: `""` (0 characters)
- Empty collections you will learn in Chapters 6–7 (`[]`, `()`, `{}`, `set()`)

Everything else is **truthy** (acts like `True`).

```python
print(bool(""))         # False (empty string)
print(bool(" "))        # True! (has 1 space inside — NOT empty!)
print(bool("False"))    # True! (non-empty string of 5 letters!)
print(bool("0"))        # True! (the text "0", not the number 0!)
print(bool(0))          # False
print(bool(-1))         # True! (every non-zero number is truthy)
```

The screen shows:

```text
False
True
True
True
False
True
```

:::pitfall[Edge case: `0` vs `None`]
Never write `if balance:` if a bank balance of `0` is valid — `0` is falsy and would act like missing data! Use `if balance is not None:` whenever `0` or `""` is a real possible value.
:::
