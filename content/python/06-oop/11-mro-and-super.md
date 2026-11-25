---
type: question
title: "Method Resolution Order and cooperative `super()`"
difficulty: hard
mostAsked: true
tags: [mro, inheritance, oop]
revision:
  - "Python uses C3 linearisation — inspect with `ClassName.__mro__`"
  - "`super()` delegates to the **next class in MRO**, not necessarily the direct parent"
  - "Every class in a multiple-inheritance diamond must call `super()` cooperatively"
---

## Answer

Python resolves method lookups in multiple inheritance using **C3 linearisation** (`ClassName.__mro__`), which preserves subclass-before-parent order and left-to-right base order while ensuring each class appears once.

```python
class A:
    def greet(self) -> str: return "A"

class B(A):
    def greet(self) -> str: return "B->" + super().greet()

class C(A):
    def greet(self) -> str: return "C->" + super().greet()

class D(B, C):
    pass

print(D().greet())   # B->C->A  (MRO: D -> B -> C -> A -> object)
```

In `D`, `B.greet`'s `super()` calls **`C.greet`**, not `A.greet`, because `C` is next in `D`'s MRO.

## Why interviewers ask

It tests whether you understand mixins and cooperative multiple inheritance in frameworks like Django or Pydantic, rather than assuming `super()` only means "my parent".

## Follow-ups

- What happens if `B` forgets to call `super()` in a diamond hierarchy?
- When does Python raise `TypeError: Cannot create a consistent method resolution order`?
