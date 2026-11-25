---
type: concept
title: "Enums: `Enum`, `IntEnum`, and `StrEnum`"
difficulty: easy
tags: [enum, oop, stdlib]
---

Use `enum.Enum` instead of scattered magic strings or integer constants — you get type safety, autocomplete, iteration, and `isinstance` checks.

```python
from enum import StrEnum, auto, unique

@unique
class Role(StrEnum):          # Python 3.11+ — values are true `str` instances
    ADMIN = auto()            # "admin"
    EDITOR = auto()           # "editor"
    VIEWER = "viewer"

print(Role.ADMIN == "admin")  # True (because StrEnum subclasses str)
print(list(Role))             # [<Role.ADMIN: 'admin'>, ...]
```

**Which Enum base to pick:**

- **`Enum`:** Default choice; members don't accidentally compare equal to raw ints/strings (`Status.OK != 200`).
- **`StrEnum` (3.11+) / `IntEnum`:** Use when values must serialize directly to JSON or interoperate with string/int APIs.
- **`@unique`:** Raises `ValueError` at import time if two names accidentally share the same value (alias).
