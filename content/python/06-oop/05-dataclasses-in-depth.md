---
type: concept
title: "`@dataclass` in depth"
difficulty: medium
mostAsked: true
tags: [dataclasses, oop, stdlib]
revision:
  - "`@dataclass` auto-generates `__init__`, `__repr__`, and `__eq__`"
  - "Never use `tags: list[str] = []` — use `field(default_factory=list)`"
  - "Use `frozen=True` for immutable/hashable value objects and `slots=True` (3.10+) for low memory"
---

`@dataclass` eliminates boilerplate for data-holding classes while keeping full OOP power:

```python
from dataclasses import dataclass, field

@dataclass(frozen=True, slots=True)
class Order:
    id: int
    items: tuple[str, ...] = ()
    tags: list[str] = field(default_factory=list)   # safe mutable default!

    def __post_init__(self) -> None:
        if self.id <= 0:
            raise ValueError("id must be positive")
```

**Key options:**

- `frozen=True`: Disallows attribute reassignment (`FrozenInstanceError`) and auto-generates `__hash__` so instances can be dict keys/set items. (Inside `__post_init__` on a frozen class, use `object.__setattr__(self, ...)` if normalizing fields.)
- `kw_only=True` (3.10+): Forces callers to pass fields by keyword.
- `order=True`: Auto-generates `<`, `<=`, `>`, `>=` comparing fields in declaration order.
- Helpers: `dataclasses.asdict(obj)` and `dataclasses.replace(obj, id=2)`.
