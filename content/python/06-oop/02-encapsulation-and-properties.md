---
type: concept
title: "Encapsulation, name mangling, and `@property`"
difficulty: medium
tags: [oop, properties, encapsulation]
---

Python relies on convention ("we're all consenting adults") rather than strict `private` keywords:

- `_name`: **internal / protected** by convention (linters warn if accessed externally; skipped by `from mod import *`).
- `__name`: **name mangling** — Python rewrites `self.__secret` to `self._ClassName__secret` to prevent accidental collisions in subclasses, not for security.

**`@property`** turns a method into a computed attribute with optional validation on write:

```python
class Temperature:
    def __init__(self, celsius: float) -> None:
        self.celsius = celsius        # triggers the setter right away!

    @property
    def celsius(self) -> float:
        return self._celsius

    @celsius.setter
    def celsius(self, value: float) -> None:
        if value < -273.15:
            raise ValueError("Below absolute zero")
        self._celsius = value
```

Start with plain public attributes; refactor to `@property` later when you need validation or computed values without breaking callers.
