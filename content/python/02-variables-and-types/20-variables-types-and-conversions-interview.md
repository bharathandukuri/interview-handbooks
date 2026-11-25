---
type: question
title: "Variables & basic types check: label aliasing, None vs 0, float precision, and casting"
difficulty: easy
mostAsked: true
tags: [interview, variables, types, float, none]
related:
  [
    python.variables-and-types.variable-alias-immutable-predict,
    python.variables-and-types.none,
    python.variables-and-types.float-surprise,
    python.variables-and-types.converting-types,
  ]
revision:
  - "Assigning `b = a` copies the object reference; reassigning `a = 20` leaves immutable `b` untouched"
  - "`None` is a unique `NoneType` singleton (check with `is None`), distinct from `0`, `False`, or `''`"
  - "`10 / 2` returns float `5.0`, `0.1 + 0.2 != 0.3` due to IEEE 754 binary fractions, and `bool('False')` is `True`"
---

## Answer

Core Python starter interviews combine variable behavior with common basic-type traps:

1. **Variables as object labels:**
   - Variables point to heap objects rather than fixed memory slots or other variables. After `a = 10; b = a; a = 20`, `b` still holds `10`. Tuple unpacking (`a, b = b, a`) evaluates the full right side before binding names on the left, swapping cleanly with zero temp variable.
2. **`None` vs `0` vs `""` vs `False`:**
   - `None` (sole instance of `NoneType`) signifies absence of a value. Compare with **`is None` / `is not None`** rather than `== None`. Unlike `0` or `""`, arithmetic or `len(None)` raises `TypeError`.
3. **Numeric precision & division:**
   - Python integers have arbitrary precision (zero overflow). True division `/` always returns `float` (`10 / 2 -> 5.0`), and binary floats suffer tiny rounding errors (`0.1 + 0.2 == 0.30000000000000004`) — use **`Decimal("0.1")`** or integer cents for currency, and beware `round()` uses round-half-to-even (`round(2.5) == 2`).
4. **Type conversion traps:**
   - `int(3.9)` truncates to `3`, `int(-3.9)` truncates toward zero to `-3`, `int("3.9")` raises `ValueError`, and **`bool("False")` returns `True`** because any non-empty string is truthy.

**A short answer for an interview:** Python variables bind labels to typed objects (so `b = a; a = 20` keeps `b == 10`), `None` is a singleton distinct from `0`/`""` checked via `is None`, ints never overflow while IEEE 754 floats need `Decimal`/cents for finance, and `int()`/`bool()` have truncation and truthiness traps (`int('3.9')` fails, `bool('False')` is `True`).

## Why interviewers ask

Understanding labels, `None` semantics, `0.1 + 0.2` binary floats, and casting edge cases early prevents silent billing mistakes, boolean bugs, and `TypeError` surprises in production scripts.

## Follow-ups

- **"Why does `True + True` evaluate to `2` in Python?"** Because `bool` is a subclass of `int` (`True == 1`, `False == 0`).
- **"Why should you check `if amount is not None:` instead of `if amount:` for optional numbers?"** Because `amount = 0` is a valid numeric value yet is falsy in `if amount:` — checking `is not None` distinguishes missing values (`None`) from real zero (`0`).
