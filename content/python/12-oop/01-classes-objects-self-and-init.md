---
type: concept
title: "Classes, objects, __init__, and how self works"
difficulty: easy
mostAsked: true
tags: [oop, classes, self, init]
revision:
  - "A **class** is a blueprint; calling `ClassName(...)` builds an **instance** (object) in memory"
  - "`__new__` allocates the object; **`__init__(self, ...)`** initializes its attributes and must return `None`"
  - "`self` is the instance itself — Python passes it automatically as the first argument to instance methods"
---

When data and the functions that work on that data belong together (like a user profile, bank account, or game player), bundling them into one unit keeps programs organized. A **class** is the blueprint; each value built from it is an **instance** (an **object**).

```python
class Dog:
    species = "Canis familiaris"       # class attribute (shared by ALL dogs)

    def __init__(self, name, age):     # runs automatically after creating the object
        self.name = name               # instance attribute (unique to THIS dog)
        self.age = age

    def speak(self, sound="Woof"):     # instance method: Python passes the instance as `self`
        return f"{self.name} says {sound}!"

ada = Dog("Ada", 3)                    # Python calls Dog.__init__(ada, "Ada", 3)
bob = Dog("Bob", 5)
print(ada.speak())
print("Dog.speak(bob, 'Arf'):", Dog.speak(bob, "Arf"))   # exact same mechanism!
print("Same species?", ada.species, "| Different names?", ada.name, bob.name)
```

The screen shows:

```text
Ada says Woof!
Dog.speak(bob, 'Arf'): Bob says Arf!
Same species? Canis familiaris | Different names? Ada Bob
```

**Important mechanics and edge cases:**

- **Why `self` is explicit:** Writing `ada.speak()` is simply shorthand for `Dog.speak(ada)`. Python automatically passes `ada` as the first argument (`self`). Naming it `self` is a strong universal convention (not a keyword — though you should always name it `self`). Forgetting `self` in `def speak():` raises **`TypeError: Dog.speak() takes 0 positional arguments but 1 was given`**!
- **`__new__` vs `__init__`:** Calling `Dog("Ada", 3)` triggers **two** steps:
  1. `Dog.__new__(Dog, "Ada", 3)` allocates and returns the brand-new empty instance (**constructor**). You almost never override `__new__` unless subclassing immutable types like `int`/`str`/`tuple`.
  2. `Dog.__init__(instance, "Ada", 3)` fills in initial attributes (`self.name = ...`) and **must implicitly return `None`** (returning anything else raises `TypeError`).
- **Lookups fall back from instance -> class:** When Python evaluates `ada.species`, it looks inside `ada.__dict__` first; if not found, it searches `Dog.__dict__` (and parent classes).
