---
type: pitfall
title: "Mutable class attributes shared across all instances"
difficulty: medium
mostAsked: true
tags: [oop, classes, mutability, gotchas]
related:
  [
    python.oop.classes-objects-self-and-init,
    python.functions.mutable-default-argument-pitfall,
  ]
revision:
  - "Class attributes defined directly inside `class Dog:` live once on the **class** and are shared by every instance"
  - "Mutating a mutable class attribute (`self.tricks.append(...)`) leaks across all objects; initialize mutable per-instance data inside **`__init__`**"
---

## The trap

```python
class Dog:
    tricks = []                       # ONE list created once on the class!

    def __init__(self, name):
        self.name = name

    def learn(self, trick):
        self.tricks.append(trick)     # mutates Dog.tricks for EVERY dog!

a = Dog("Ada")
b = Dog("Bob")
a.learn("sit")
print("Bob's tricks:", b.tricks)      # ['sit']  <-- Bob never learned 'sit'!
```

## The fix

```python
class Dog:
    def __init__(self, name):
        self.name = name
        self.tricks = []              # fresh list per instance inside __init__!

    def learn(self, trick):
        self.tricks.append(trick)

a = Dog("Ada")
b = Dog("Bob")
a.learn("sit")
print("Ada:", a.tricks, "| Bob:", b.tricks)
```

## Why it happens

Just like mutable default arguments in `def`, attributes written directly inside the `class Dog:` body are evaluated **only once** when Python builds the class object. Every `Dog` instance shares that same `Dog.tricks` list until one assigns `self.tricks = [...]` directly on itself.

**Second subtle trap (`self.count += 1` vs `Class.count += 1`):** For an immutable integer `count = 0` on the class, writing `self.count += 1` inside `__init__` reads `Dog.count` (`0`), adds `1`, and writes a brand-new **instance attribute** `self.count = 1` — leaving `Dog.count` stuck at `0`! Always update class-wide counters using **`Dog.count += 1`** (or `type(self).count += 1`), never `self.count += 1`.
