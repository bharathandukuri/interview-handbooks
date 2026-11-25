---
type: concept
title: "The descriptor protocol (`__get__`, `__set__`, `__set_name__`)"
difficulty: hard
mostAsked: true
tags: [descriptors, internals, oop]
revision:
  - "Descriptors are class attributes defining `__get__`, `__set__`, or `__delete__`"
  - "Data descriptors (defining `__set__` or `__delete__`) take precedence over instance `__dict__`"
  - "`@property`, `@classmethod`, `@staticmethod`, and bound methods are all implemented via descriptors"
---

A **descriptor** is any object placed on a **class** that customizes attribute lookup (`__get__`), assignment (`__set__`), or deletion (`__delete__`) on instances.

```python
class Positive:
    def __set_name__(self, owner: type, name: str) -> None:
        self.private_name = f"_{name}"

    def __get__(self, obj: object, objtype: type | None = None) -> float:
        if obj is None:
            return self                     # accessed on the class
        return getattr(obj, self.private_name)

    def __set__(self, obj: object, value: float) -> None:
        if value <= 0:
            raise ValueError("Must be positive")
        setattr(obj, self.private_name, value)

class Product:
    price = Positive()                      # reusable validation across attributes!
```

**Attribute lookup precedence:**

1. **Data descriptors** on the class (e.g. `@property`, `Positive` above)
2. Instance `obj.__dict__`
3. **Non-data descriptors** (only `__get__`, like regular methods!) & class attributes.
