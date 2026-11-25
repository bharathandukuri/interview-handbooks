---
type: concept
title: "Multiple inheritance, MRO (C3 linearization), and cooperative super()"
difficulty: hard
mostAsked: true
tags: [oop, mro, inheritance, super]
related: [python.oop.inheritance-and-super, python.oop.mro-and-dunder-predict]
revision:
  - "Python resolves inherited methods using the **MRO** (**Method Resolution Order**), computed via **C3 linearization** (`Class.__mro__`)"
  - "In a **diamond hierarchy** (`D(B, C)` where both inherit from `A`), MRO searches `[D, B, C, A, object]` so `A` runs only once"
  - "`super()` does **NOT** always mean 'direct parent' — it calls the **next class in the MRO** of the dynamic instance `self`"
---

Python supports inheriting from **more than one** parent (`class Child(Left, Right):`). This raises a famous puzzle called the **diamond problem**: if both `B` and `C` inherit from `A`, and `D(B, C)` inherits from both `B` and `C`, in what order does Python search for methods — and how do we prevent `A.__init__` from running twice?

Python solves this cleanly using **C3 Linearization** to compute a single strict list called the **MRO** (**Method Resolution Order**), readable anytime via `Class.__mro__` or `Class.mro()`:

```python
class Base:
    def greet(self):
        return ["Base"]

class Left(Base):
    def greet(self):
        return ["Left"] + super().greet()

class Right(Base):
    def greet(self):
        return ["Right"] + super().greet()

class Child(Left, Right):
    def greet(self):
        return ["Child"] + super().greet()

print("MRO:", [cls.__name__ for cls in Child.__mro__])
print("Call chain:", Child().greet())
```

The screen shows:

```text
MRO: ['Child', 'Left', 'Right', 'Base', 'object']
Call chain: ['Child', 'Left', 'Right', 'Base']
```

**Look closely at what `super()` just did inside `Left.greet()`!**
Even though `Left` inherits directly from `Base` (`class Left(Base):`), calling `super().greet()` on a `Child` instance jumped from `Left` to **`Right`** — **NOT** `Base`! Why? Because **`super()` delegates to the NEXT class in `type(self).__mro__`** (`['Child', 'Left', 'Right', 'Base', 'object']`), ensuring `Base` is visited once at the end!

**Two edge cases in multiple inheritance:**

1. **Breaking the cooperative chain:** If `Left.greet()` forgot to call `super().greet()`, **`Right.greet()` and `Base.greet()` would never execute**! Similarly, in **cooperative multiple inheritance**, parent classes taking different `__init__` parameters forward unused keyword arguments cleanly with `super().__init__(**kwargs)` and accept `**kwargs` safely.
2. **Impossible MRO (`TypeError`):** C3 guarantees two rules: subclasses always come **before** parents, and left-to-right base listing (`D(B, C)`) stays preserved. If two base lists conflict (`class X(A, B)` and `class Y(B, A)` -> `class Z(X, Y)`), Python immediately raises **`TypeError: Cannot create a consistent method resolution order (MRO)`** at class definition time! Prefer small, single-purpose **mixin** classes (or composition) over deep diamonds.
