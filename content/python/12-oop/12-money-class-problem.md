---
type: problem
title: "Chapter challenge: Immutable-style Money class with dunder methods"
difficulty: medium
mostAsked: true
complexity:
  time: "O(1) per operation"
  space: "O(1) per Money value"
approach: "Store currency + exact integer cents cleanly, validate mismatches, implement __eq__/__hash__/__lt__/__add__/__mul__/__rmul__"
tags: [oop, dunder, edge-cases, interview]
related:
  [
    python.oop.dunder-methods-and-hashability,
    python.oop.encapsulation-and-properties,
  ]
revision:
  - "Represent money as exact integer **cents** (or `Decimal`), never binary `float` (`0.1 + 0.2 != 0.3`)"
  - "Guard cross-currency arithmetic/comparisons explicitly (`ValueError`) and support `3 * price` via `__rmul__`"
---

## Problem

Design a value-object `Money(cents, currency="USD")` class (storing integer cents to eliminate float rounding bugs!) that supports:

- Read-only `cents` and uppercase normalized `currency` (reject non-int `cents` including `bool`, and blank currencies).
- Clean formatting: `repr` -> `"Money(1250, 'USD')"`; `str` -> `"USD 12.50"` (and `"-USD 0.50"` cleanly for negative balances!).
- Value equality (`__eq__`) and hashability (`__hash__`), plus ordering (`__lt__` — rejecting different currencies cleanly with `ValueError`!).
- Addition (`m1 + m2`) checking currencies match (`ValueError` on `"USD"` + `"EUR"`, returning `NotImplemented` for non-`Money`), and integer scaling in **both** orders (`m * 3` and `3 * m` via `__mul__` / `__rmul__`).

## Hint

- Wrap internal `_cents` and `_currency` behind `@property` getters with **no setters** so the object stays safe to put in sets/dicts (`__hash__`).
- Return `NotImplemented` when `other` is an unrelated type (e.g., `Money(100) + 5` or `Money(100) == "USD 1.00"`), **but** raise `ValueError` when adding or ordering two `Money` objects with different currencies (`"USD"` vs `"EUR"`).
- Note for negative formatting: `-50` cents has integer division `-50 // 100 == -1` in Python! Take `abs(self._cents)` first, split with `divmod(abs(self._cents), 100)`, and prepend `"-" ` only when `self._cents < 0`!

## Solution

```python
class Money:
    def __init__(self, cents, currency="USD"):
        if isinstance(cents, bool) or not isinstance(cents, int):
            raise TypeError("cents must be an int")
        if not isinstance(currency, str) or not currency.strip():
            raise ValueError("currency must be a non-empty code")
        self._cents = cents
        self._currency = currency.strip().upper()

    @property
    def cents(self):
        return self._cents

    @property
    def currency(self):
        return self._currency

    def __repr__(self):
        return f"Money({self._cents!r}, {self._currency!r})"

    def __str__(self):
        sign = "-" if self._cents < 0 else ""
        dollars, rem = divmod(abs(self._cents), 100)
        return f"{sign}{self._currency} {dollars}.{rem:02d}"

    def __eq__(self, other):
        if not isinstance(other, Money):
            return NotImplemented
        return (self._cents, self._currency) == (other._cents, other._currency)

    def __hash__(self):
        return hash((self._cents, self._currency))

    def __lt__(self, other):
        if not isinstance(other, Money):
            return NotImplemented
        if self._currency != other._currency:
            raise ValueError(f"cannot compare {self._currency} with {other._currency}")
        return self._cents < other._cents

    def __add__(self, other):
        if not isinstance(other, Money):
            return NotImplemented
        if self._currency != other._currency:
            raise ValueError(f"cannot add {self._currency} and {other._currency}")
        return Money(self._cents + other._cents, self._currency)

    def __mul__(self, factor):
        if isinstance(factor, bool) or not isinstance(factor, int):
            return NotImplemented
        return Money(self._cents * factor, self._currency)

    def __rmul__(self, factor):
        return self * factor

price = Money(1250, "usd")
tax = Money(125)
total = price + tax
print("str:", total, "| repr:", repr(total))
print("3x tax:", 3 * tax, "| equal set size:", len({Money(50, "USD"), Money(50, "usd")}))
print("neg format:", str(Money(-50, "USD")))
```

## Walkthrough

Notice three subtle production-grade edge cases handled cleanly here:

1. **Negative formatting bug avoided:** A naive `f"{cents // 100}.{cents % 100:02d}"` turns `-50` cents into `"-1.50"` because Python's `//` floors toward $-\infty$! Using `sign = "-"` with `divmod(abs(cents), 100)` guarantees `Money(-50)` renders cleanly as `"-USD 0.50"`.
2. **Symmetric scaling (`3 * tax` and `tax * 3`):** Python evaluates `3 * tax` as `(3).__mul__(tax)` first; when `int.__mul__` returns `NotImplemented`, Python falls back to `tax.__rmul__(3)` automatically!
3. **Immutable properties + `__hash__`:** Exposing `cents` and `currency` via read-only `@property` guarantees hashes stay stable inside sets and dictionary keys.
