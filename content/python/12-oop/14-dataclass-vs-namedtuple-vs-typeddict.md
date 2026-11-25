---
type: compare
title: "@dataclass vs NamedTuple vs TypedDict"
difficulty: medium
left: "@dataclass / NamedTuple"
right: "TypedDict / plain dict"
tags: [oop, dataclasses, typing, architecture]
related: [python.oop.dataclasses-and-enums]
---

Python offers several structured container types. Picking the right one avoids fighting mutability, memory, or JSON compatibility later:

| Feature                    | `@dataclass`                                  | `typing.NamedTuple`                       | `typing.TypedDict` (Ch 16 preview)      |
| -------------------------- | --------------------------------------------- | ----------------------------------------- | --------------------------------------- |
| Underlying runtime type    | Custom class (`obj.field`)                    | `tuple` subclass (`obj[0]` & `.x`)        | Plain **`dict`** (`obj["field"]`)       |
| Mutable by default?        | ✅ Yes (or immutable with `frozen=True`)      | ❌ Always immutable                       | ✅ Yes (`dict` rules apply)             |
| Tuple unpacking `a, b = x` | ❌ No                                         | ✅ Yes (acts as a real `tuple`!)          | ❌ No                                   |
| Methods & defaults         | ✅ Full methods, `__post_init__`, inheritance | Methods work; tricky equality with tuples | ❌ Schema hint only (no custom methods) |
| Direct JSON serialization  | Needs `dataclasses.asdict()` first            | Serializes as JSON array `[...]`          | ✅ Directly `json.dumps()`-able!        |

## Verdict

Reach for **`@dataclass`** (with `frozen=True, slots=True` when immutable) as your default Python record/entity type. Choose **`NamedTuple`** when you want an immutable lightweight record that unpacks or interacts cleanly with tuple APIs — beware one edge case: two different `NamedTuple` types `(3, 4)` and `Point(3, 4)` compare `==` because both inherit from `tuple`! Choose **`TypedDict`** purely for typing raw JSON dictionary payloads from external APIs.
