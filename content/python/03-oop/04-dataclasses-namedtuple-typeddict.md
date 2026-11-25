---
type: compare
title: "`dataclass` vs `NamedTuple` vs `TypedDict`"
difficulty: medium
left: "dataclass"
right: "NamedTuple / TypedDict"
tags: [typing, oop, stdlib]
---

| Feature               | `@dataclass`                     | `NamedTuple`                        | `TypedDict`                                       |
| --------------------- | -------------------------------- | ----------------------------------- | ------------------------------------------------- |
| Mutable by default    | ✅ Yes (`frozen=False`)          | ❌ No                               | ✅ Yes (it's a dict)                              |
| Hashable              | Only with `frozen=True`          | ✅ Yes                              | ❌ No                                             |
| Inheritance           | Full OOP                         | Limited                             | Limited                                           |
| Memory                | `__dict__` (or `__slots__`)      | Tuple (compact)                     | Underlying dict                                   |
| Indexable by position | ❌ No                            | ✅ Yes                              | ❌ No                                             |
| JSON / dict friendly  | Needs `dataclasses.asdict()`     | Needs `._asdict()`                  | ✅ Already a dict                                 |
| `__repr__` auto       | ✅                               | ✅                                  | ❌ Just dict repr                                 |
| When to use           | Rich domain objects with methods | Lightweight records / return values | Typed annotations for plain dicts (APIs, configs) |

## Verdict

Use **`@dataclass`** for most domain model classes — especially when you need methods, mutability control (`frozen=True`), or `__post_init__`. Use **`NamedTuple`** for small immutable records you need to unpack positionally. Use **`TypedDict`** when you're annotating dicts that cross process boundaries (JSON, kwargs) and don't want a wrapper class.
