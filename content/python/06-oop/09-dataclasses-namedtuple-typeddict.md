---
type: compare
title: "`dataclass` vs `NamedTuple` vs `TypedDict`"
difficulty: medium
left: "@dataclass"
right: "NamedTuple / TypedDict"
tags: [typing, oop, stdlib]
---

| Feature                   | `@dataclass`                    | `NamedTuple`                            | `TypedDict`                           |
| ------------------------- | ------------------------------- | --------------------------------------- | ------------------------------------- |
| Mutable by default        | ✅ Yes (`frozen=True` optional) | ❌ No (immutable)                       | ✅ Yes (plain `dict`)                 |
| Hashable                  | Only with `frozen=True`         | ✅ Yes (if fields hashable)             | ❌ No                                 |
| Unpackable (`a, b = obj`) | ❌ No                           | ✅ Yes                                  | ❌ No                                 |
| Memory footprint          | `__dict__` (or `slots=True`)    | Compact tuple                           | Dict overhead                         |
| JSON-ready                | Needs `asdict()`                | Needs `._asdict()`                      | ✅ Already a `dict`                   |
| Best use                  | Rich domain models & entities   | Small immutable records / return tuples | Typing JSON payloads & `dict` configs |

## Verdict

Default to **`@dataclass`** (`frozen=True, slots=True` when immutable) for domain objects. Pick **`NamedTuple`** for lightweight positional records (like `(lat, lon)`), and **`TypedDict`** when annotating existing `dict` structures from APIs without wrapping them in a class.
