---
type: compare
title: "List vs Tuple: mutability, memory, and when to use each"
difficulty: easy
mostAsked: true
left: "list [...]"
right: "tuple (...)"
tags: [lists, tuples, mutability]
related:
  [
    python.lists-and-tuples.what-is-a-list,
    python.lists-and-tuples.what-is-a-tuple,
  ]
revision:
  - "`list` is **mutable** (items change, grow, shrink); `tuple` is **immutable** (fixed after creation)"
  - "Use `list` for homogeneous sequences you update; use `tuple` for fixed structured records and dict keys"
---

At first glance, lists and tuples look identical except for `[ ]` vs `( )`. In practice, they communicate very different intent to both Python and human readers:

| Feature                                   | `list`                                             | `tuple`                                                           |
| ----------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------- |
| Syntax                                    | `[1, 2, 3]`, single `[5]`                          | `(1, 2, 3)`, single `(5,)`                                        |
| Mutable?                                  | ✅ Yes (`append`, `pop`, `sort`, `x[0] = ...`)     | ❌ No (fixed references once built)                               |
| Hashable (usable as dict key / set item)? | ❌ Never (`TypeError`)                             | ✅ Yes (when all items inside are also immutable/hashable)        |
| Memory size                               | Slightly larger (over-allocates room to grow)      | Smaller and faster to construct                                   |
| Available methods                         | ~11 methods (`append`, `extend`, `sort`, ...)      | Only 2 (`.count()` and `.index()`)                                |
| Best semantic use                         | Collection of similar items (users, scores, tasks) | Fixed heterogeneous record (`(name, age, role)`, `(x, y)` coords) |

## Verdict

Pick a **`list`** when items represent a changing collection of the same kind of thing (e.g., lines from a file, shopping cart items). Pick a **`tuple`** when a fixed group of values belongs together as one record (`(lat, lon)`), when returning multiple values from a function (Chapter 9), or whenever you need an immutable, hashable key for a dictionary or set (Chapter 7).
