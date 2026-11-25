---
type: compare
title: "Instance methods vs @classmethod vs @staticmethod"
difficulty: medium
mostAsked: true
left: "@classmethod (cls)"
right: "@staticmethod ()"
tags: [oop, methods, decorators, factory]
related: [python.oop.classes-objects-self-and-init]
revision:
  - "Instance methods take **`self`** and operate on one specific object"
  - "**`@classmethod`** takes **`cls`** (the class itself) — ideal for alternate constructors (`from_string`, `from_dict`) that work cleanly with subclasses"
  - "**`@staticmethod`** takes neither `self` nor `cls` — a plain utility helper grouped inside the class namespace"
---

Inside a class body, you can define three distinct kinds of methods depending on what data they need access to:

| Feature                    | Instance method (`def m(self)`)       | `@classmethod` (`def m(cls)`)                     | `@staticmethod` (`def m(...)`)              |
| -------------------------- | ------------------------------------- | ------------------------------------------------- | ------------------------------------------- |
| Implicit 1st argument      | `self` (the instance object)          | `cls` (the class object itself)                   | None (behaves like a normal function)       |
| Can read/mutate instance?  | ✅ Yes (`self.balance`)               | ❌ No direct instance                             | ❌ No                                       |
| Can read class / subclass? | Via `type(self)`                      | ✅ Yes (`cls(...)` builds the _calling_ subclass) | Must hardcode class name (poor inheritance) |
| Typical use case           | Core behavior (`account.deposit(50)`) | Alternative constructors (`Date.fromisoformat`)   | Validation/math helpers (`is_valid_isbn`)   |

```python
class DateLabel:
    def __init__(self, year, month, day):
        self.year, self.month, self.day = year, month, day

    @classmethod
    def from_iso(cls, text):              # `cls` constructs DateLabel OR any subclass!
        y, m, d = (int(part) for part in text.split("-"))
        return cls(y, m, d)

    @staticmethod
    def is_valid_iso(text):               # needs neither self nor cls
        parts = text.split("-")
        return len(parts) == 3 and all(p.isdigit() for p in parts)

class ExtendedDate(DateLabel):
    pass

obj = ExtendedDate.from_iso("2026-11-25")
print(type(obj).__name__, "| valid?", DateLabel.is_valid_iso("2026-11-25"))
```

The screen shows:

```text
ExtendedDate | valid? True
```

## Verdict

Notice `ExtendedDate.from_iso(...)` returned an **`ExtendedDate`**, not a plain `DateLabel`, because `@classmethod` used `cls(...)` instead of hardcoding `DateLabel(...)`! Use **`@classmethod`** for factory constructors and class-level state, and use **`@staticmethod`** (or a simple module-level function) for pure helper logic that belongs alongside the class without needing `cls`.
