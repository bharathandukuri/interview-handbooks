---
type: problem
title: "BankAccount class with validation and transfers"
difficulty: easy
complexity:
  time: "O(1) per operation"
  space: "O(1) per account instance"
approach: "Validate invariant preconditions at __init__ and every mutation method so account balance never becomes corrupted"
tags: [oop, classes, validation, practice]
related: [python.oop.classes-objects-self-and-init]
---

## Problem

Design a `BankAccount(owner, balance=0)` class supporting:

- Reject negative starting balance (`ValueError`).
- `.deposit(amount)`: reject `amount <= 0` (`ValueError`), add to balance, return new balance.
- `.withdraw(amount)`: reject `amount <= 0` (`ValueError`), reject `amount > balance` (`ValueError("insufficient funds")`), subtract, return new balance.
- `.transfer_to(other, amount)`: reject transferring to non-`BankAccount` (`TypeError`), self-transfer edge case (no-op or reject cleanly), and perform atomic withdrawal + deposit so neither account ends in a half-updated state if validation fails!
- Clean `__repr__` returning `"BankAccount(owner='Ada', balance=150)"`.

## Hint

- Factor positive-amount validation cleanly into a private helper method `_validate_positive(amount)` (or guard each method clearly).
- In `transfer_to(other, amount)`: guard `isinstance(other, BankAccount)` and `if other is self: raise ValueError(...)` first, then call `self.withdraw(amount)` _before_ `other.deposit(amount)` so if balance is too low, nothing gets deposited into `other`!

## Solution

```python
class BankAccount:
    def __init__(self, owner, balance=0):
        if balance < 0:
            raise ValueError("initial balance cannot be negative")
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("deposit amount must be positive")
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("withdrawal amount must be positive")
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount
        return self.balance

    def transfer_to(self, other, amount):
        if not isinstance(other, BankAccount):
            raise TypeError("target must be a BankAccount")
        if other is self:
            raise ValueError("cannot transfer to the same account")
        self.withdraw(amount)
        other.deposit(amount)

    def __repr__(self):
        return f"BankAccount(owner={self.owner!r}, balance={self.balance})"

ada = BankAccount("Ada", 100)
bob = BankAccount("Bob")
ada.deposit(50)
ada.transfer_to(bob, 40)
print(ada)
print(bob)
```

## Walkthrough

Notice how keeping **invariants** enforced inside the methods prevents corrupted state:

1. If `ada.transfer_to(bob, 500)` raises `ValueError("insufficient funds")`, `self.withdraw(amount)` stops **before** `other.deposit(amount)` runs, keeping `bob.balance` untouched.
2. Checking `if other is self:` prevents nonsensical self-transfers from inflating logs or bypassing validation.
3. Using `{self.owner!r}` inside `__repr__` automatically wraps strings in clean quotes (`'Ada'`) instead of bare `Ada`! (Note: for real-world currency math, use `decimal.Decimal` or integer cents instead of binary `float`, avoiding `0.1 + 0.2` drift.)
