---
type: concept
title: "Data containers and safe constants with @dataclass and Enum"
difficulty: medium
mostAsked: true
tags: [oop, dataclasses, enum, stdlib, python312]
related:
  [
    python.oop.classes-objects-self-and-init,
    python.oop.dataclass-vs-namedtuple-vs-typeddict,
  ]
revision:
  - "`@dataclass` auto-generates `__init__`, `__repr__`, and `__eq__` cleanly without repetitive boilerplate"
  - "Never write `tags: list = []` on a dataclass (`ValueError`!); always use **`field(default_factory=list)`**"
  - "Pass `frozen=True` for immutable/hashable value objects and `slots=True` for memory-light classes; use **`StrEnum`** instead of raw magic strings"
---

Many classes exist mainly to hold structured data (configs, users, points, orders) where writing `__init__`, `__repr__`, and `__eq__` by hand wastes 20 lines of boilerplate. Python's built-in **`@dataclass`** generates all three automatically, while **`Enum` / `StrEnum`** replaces typo-prone magic strings (`"pnding"` vs `"pending"`):

```python
from dataclasses import dataclass, field
from enum import StrEnum

class OrderStatus(StrEnum):                 # StrEnum works anywhere a str works (Python 3.11+)
    PENDING = "pending"
    SHIPPED = "shipped"

@dataclass(frozen=True, slots=True)
class Point:
    x: float
    y: float

@dataclass(slots=True)
class User:
    name: str
    roles: list[str] = field(default_factory=list)   # NEVER `roles: list = []`!
    status: OrderStatus = OrderStatus.PENDING

    def __post_init__(self):                         # runs right after auto __init__
        if not self.name.strip():
            raise ValueError("name cannot be empty")

p1 = Point(3, 4)
u1 = User("Ada")
u2 = User("Bob")
u1.roles.append("admin")
print("point:", p1, "| hashable set len:", len({p1, Point(3, 4)}))
print("u1:", u1, "| u2 roles:", u2.roles, "| status == 'pending'?", u1.status == "pending")
```

The screen shows:

```text
point: Point(x=3, y=4) | hashable set len: 1
u1: User(name='Ada', roles=['admin'], status=<OrderStatus.PENDING: 'pending'>) | u2 roles: [] | status == 'pending'? True
```

(Notice type annotations like `name: str` inside `@dataclass` help identify fields — we cover static type checking in full in Chapter 16!)

**Key options and edge cases on `@dataclass`:**

- **`field(default_factory=list)` protects against shared mutable defaults:** Python rejects `roles: list = []` directly at class creation time with `ValueError: mutable default <class 'list'> for field roles is not allowed`.
- **`frozen=True`:** Blocks attribute reassignment (`p1.x = 9` -> `FrozenInstanceError`) _and_ auto-generates `__hash__`, letting objects serve as `set` items or `dict` keys (as long as all fields are hashable). Note: if you mutate `self` inside `__post_init__` on a frozen dataclass, use `object.__setattr__(self, "field", val)`.
- **`slots=True` (Python 3.10+):** Skips creating a per-instance `__dict__`, cutting memory overhead sharply and preventing typos (`u1.naem = "X"` raises `AttributeError`).
- **`order=True`:** Auto-generates `<`, `<=`, `>`, `>=` by comparing fields in declaration order as a tuple.
