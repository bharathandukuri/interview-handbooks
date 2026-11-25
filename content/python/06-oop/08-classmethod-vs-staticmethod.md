---
type: compare
title: "`@classmethod` vs `@staticmethod`"
difficulty: medium
mostAsked: true
left: "@classmethod"
right: "@staticmethod"
tags: [oop, class-design]
revision:
  - "`@classmethod` receives `cls` as its first argument — aware of subclasses"
  - "`@staticmethod` receives no implicit `self` or `cls` — a plain function in the class namespace"
  - "Use `@classmethod` for alternative constructors; `@staticmethod` for stateless helpers"
---

| Feature                    | `@classmethod`                                     | `@staticmethod`                     |
| -------------------------- | -------------------------------------------------- | ----------------------------------- |
| Implicit first arg         | `cls` (the class being called)                     | None                                |
| Polymorphic in subclasses? | ✅ Yes (`cls(...)` constructs the subclass)        | ❌ No                               |
| Access class attributes?   | ✅ Via `cls.attr`                                  | ❌ Must hardcode class name         |
| Typical use                | Alternative constructors (`from_json`, `from_env`) | Pure utility helper scoped to class |

## Verdict

```python
class Date:
    def __init__(self, y: int, m: int, d: int) -> None: ...

    @classmethod
    def from_iso(cls, s: str) -> "Date":   # works cleanly for Date subclasses
        return cls(*map(int, s.split("-")))

    @staticmethod
    def is_leap(year: int) -> bool:         # stateless pure utility
        return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)
```

If a method needs `cls` (especially factory constructors), use `@classmethod`. If it needs neither `self` nor `cls`, use `@staticmethod` or a module-level function.
