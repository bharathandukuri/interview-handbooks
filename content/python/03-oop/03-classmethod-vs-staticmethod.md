---
type: compare
title: "`@classmethod` vs `@staticmethod`"
difficulty: medium
mostAsked: true
left: "classmethod"
right: "staticmethod"
tags: [oop, class-design]
revision:
  - "`@classmethod` receives `cls` as first arg — it knows the class it's called on"
  - "`@staticmethod` receives no implicit args — it's a plain function inside the namespace"
  - "Use `@classmethod` for alternative constructors; `@staticmethod` for utility helpers"
---

| Feature                 | `@classmethod`                       | `@staticmethod`                  |
| ----------------------- | ------------------------------------ | -------------------------------- |
| First argument          | `cls` (the class itself)             | Nothing implicit                 |
| Access to class         | ✅ Via `cls`                         | ❌ Must reference class by name  |
| Inheritable constructor | ✅ Returns `cls(...)` for subclasses | ❌ Always returns the base class |
| Override behaviour      | ✅ Polymorphic via `cls`             | ❌ Not polymorphic               |
| Typical use             | Alternative constructors, registries | Pure utility / helper logic      |

## Verdict

```python
class Date:
    def __init__(self, y, m, d): ...

    @classmethod
    def from_iso(cls, s: str) -> "Date":   # works for subclasses too
        return cls(*map(int, s.split("-")))

    @staticmethod
    def is_leap(year: int) -> bool:         # no class context needed
        return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)
```

When in doubt: if the method needs the class (or should be inheritable), use `@classmethod`. If it's a free function that just lives here for organisation, use `@staticmethod`.
