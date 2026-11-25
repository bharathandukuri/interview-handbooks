---
type: concept
title: "`@overload`, `Literal`, `Final`, `Self`, and `TypeIs`"
difficulty: medium
tags: [typing, stdlib, python311]
---

Precision typing tools for real-world libraries:

```python
from typing import Final, Literal, Self, overload

MAX_RETRIES: Final = 3          # type checker rejects reassignment

@overload
def parse(raw: str, as_int: Literal[True]) -> int: ...
@overload
def parse(raw: str, as_int: Literal[False] = ...) -> str: ...
def parse(raw: str, as_int: bool = False) -> int | str:
    return int(raw) if as_int else raw
```

**Essential helpers:**

- **`Self` (3.11+):** Annotates fluent builder methods or `@classmethod` constructors so subclasses return the subclass type, not the base class.
- **`Never` (3.11+):** Return type for functions that always raise or loop forever (helps exhaustiveness checks in `match`/`case`).
- **`Annotated[int, "gt=0"]`:** Attaches runtime metadata (used heavily by FastAPI & Pydantic) alongside static types.
- **`TypeIs[T]` (3.13) / `TypeGuard[T]` (3.10):** Custom type-narrowing predicate functions.
