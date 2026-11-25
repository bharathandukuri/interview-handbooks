---
type: question
title: "Method Resolution Order and cooperative `super()`"
difficulty: hard
mostAsked: true
tags: [mro, inheritance, oop]
revision:
  - "Python uses C3 linearisation — `ClassName.__mro__` shows the lookup chain"
  - "`super()` delegates to the **next class in MRO**, not the direct parent"
  - "Every class in a diamond must call `super().__init__()` for cooperative MRO to work"
---

## Answer

Python resolves method lookup using **C3 linearisation**, which guarantees each class appears only once in the chain and respects local precedence. You can inspect it with `ClassName.__mro__` or `mro()`.

```python
class A:
    def greet(self): return "A"

class B(A):
    def greet(self): return "B→" + super().greet()

class C(A):
    def greet(self): return "C→" + super().greet()

class D(B, C):
    pass

print(D.__mro__)
# (<class 'D'>, <class 'B'>, <class 'C'>, <class 'A'>, <class 'object'>)
print(D().greet())   # B→C→A
```

`super()` doesn't mean "call my parent" — it means "call the next in MRO". In the example above, `B.greet`'s `super()` calls `C.greet`, not `A.greet`, because `C` comes next in `D`'s MRO.

## Why interviewers ask

MRO questions distinguish candidates who have worked with real class hierarchies (mixins, Django CBVs, Pydantic models) from those who know only single inheritance.

## Follow-ups

- What happens if `B` doesn't call `super()`?
- How does Python raise `TypeError` when it can't compute a consistent MRO?
