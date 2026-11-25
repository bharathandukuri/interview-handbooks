---
type: problem
title: "Immutable `Money` Value Object"
difficulty: easy
complexity:
  time: "O(1)"
  space: "O(1)"
approach: "frozen dataclass + __add__ + @classmethod"
tags: [oop, dataclasses, dunder]
---

## Problem

Design an immutable `Money(amount_cents, currency)` class that supports `Money.from_dollars(12.50, "USD")`, addition (`m1 + m2`) raising `ValueError` on currency mismatch, and safe use as a dictionary key.

```
m = Money.from_dollars(10.50, "USD") + Money(250, "USD")
# Money(amount_cents=1300, currency='USD')
```

## Hint

- `@dataclass(frozen=True, slots=True)` gives immutability, `__eq__`, and `__hash__` automatically.
- Implement `__add__` and check `isinstance(other, Money)` (returning `NotImplemented` otherwise).

## Solution

```python
from dataclasses import dataclass

@dataclass(frozen=True, slots=True)
class Money:
    amount_cents: int
    currency: str = "USD"

    @classmethod
    def from_dollars(cls, dollars: float, currency: str = "USD") -> "Money":
        return cls(round(dollars * 100), currency.upper())

    def __add__(self, other: object) -> "Money":
        if not isinstance(other, Money):
            return NotImplemented
        if self.currency != other.currency:
            raise ValueError(f"Currency mismatch: {self.currency} vs {other.currency}")
        return Money(self.amount_cents + other.amount_cents, self.currency)
```

## Walkthrough

Storing integer cents avoids binary float drift, `frozen=True` makes instances immutable and hashable (usable as dict keys/sets), and returning `NotImplemented` on unknown types follows Python's binary operator protocol cleanly.
