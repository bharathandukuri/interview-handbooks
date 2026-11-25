---
type: concept
title: "Inheritance, overriding methods, super(), and isinstance()"
difficulty: easy
mostAsked: true
tags: [oop, inheritance, super, polymorphism]
related:
  [
    python.oop.classes-objects-self-and-init,
    python.oop.mro-and-multiple-inheritance,
  ]
revision:
  - "**Inheritance** lets a child class reuse and extend a parent class (`class Child(Parent):`)"
  - "Use **`super()`** inside overridden methods so parent initialization/logic still runs cleanly without hardcoding the parent class name"
  - "Remember `isinstance(True, int)` is `True` because `bool` subclasses `int` — use `type(x) is int` only when subclasses must be rejected"
---

**Inheritance** lets a specialized **child class** (**subclass**) share attributes and methods from a **parent class** (**base class**) without duplicating code — expressing an **"is-a"** relationship (`SavingsAccount` _is a_ `BankAccount`).

```python
class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def describe(self):
        return f"{self.owner}: ${self.balance:.2f}"

class SavingsAccount(Account):
    def __init__(self, owner, balance=0, rate=0.05):
        super().__init__(owner, balance)      # reuse parent __init__ cleanly!
        self.rate = rate

    def add_interest(self):
        self.balance += self.balance * self.rate

    def describe(self):                       # override & extend parent method
        return f"{super().describe()} (rate {self.rate:.0%})"

acc = SavingsAccount("Ada", 1000, rate=0.04)
acc.add_interest()
print(acc.describe())
print("isinstance Account?", isinstance(acc, Account), "| type exact?", type(acc) is Account)
```

The screen shows:

```text
Ada: $1040.00 (rate 4%)
isinstance Account? True | type exact? False
```

**Important edge cases to remember:**

- **`isinstance()` vs `type() is ...`:** `isinstance(acc, Account)` is `True` for `SavingsAccount` (supports **polymorphism**: functions written for `Account` work seamlessly on any subclass!). Checking `type(x) is Account` breaks polymorphism. On the flip side, remember Python's `bool` inherits from `int`, so `isinstance(True, int)` is `True` — always check `isinstance(x, bool)` first when you must treat booleans differently!
- **Why `super().__init__(...)` beats `Account.__init__(self, ...)`:** Calling `Account.__init__` directly breaks multiple inheritance chains (next card) and forces you to update every method body if a parent class is renamed or reorganized later.
- **`issubclass(SavingsAccount, Account)`** checks relationships between **class objects** themselves (`True`), while `isinstance(obj, Class)` checks an **instance** against a class (or tuple of classes, like `isinstance(x, (int, float))`).
