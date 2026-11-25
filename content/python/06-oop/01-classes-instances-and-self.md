---
type: concept
title: "Classes, instances, `self`, and `__new__` vs `__init__`"
difficulty: easy
tags: [oop, classes, syntax]
---

A `class` is a blueprint; calling it constructs an **instance** and automatically passes that instance as the first argument (`self`) to its methods.

```python
class BankAccount:
    currency = "USD"                 # class attribute (shared by all instances)

    def __init__(self, owner: str, balance: float = 0.0) -> None:
        self.owner = owner           # instance attribute (unique per instance)
        self.balance = balance

    def deposit(self, amount: float) -> None:
        self.balance += amount
```

**`__new__` vs `__init__`:**

1. `__new__(cls, ...)` **allocates and returns** the new instance (rarely overridden except for singletons or subclassing immutable built-ins like `str`/`tuple`).
2. `__init__(self, ...)` **initializes** the already-created instance and must return `None`.

:::pitfall[Mutable class attributes]
Never put `items = []` at class level if each instance should own its own list — initialize `self.items = []` inside `__init__`.
:::
