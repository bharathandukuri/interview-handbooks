---
type: compare
title: "`list` vs `tuple`: mutability and use cases"
difficulty: easy
left: "list"
right: "tuple"
tags: [containers, mutability, hashing]
---

| Feature         | `list`                           | `tuple`                                    |
| --------------- | -------------------------------- | ------------------------------------------ |
| Mutable         | ✅ Yes                           | ❌ No                                      |
| Hashable        | ❌ No                            | ✅ Yes (if all elements are hashable)      |
| Memory          | Slightly larger (over-allocates) | Smaller and faster                         |
| Syntax          | `[1, 2, 3]`                      | `(1, 2, 3)`                                |
| Use as dict key | ❌ No                            | ✅ Yes                                     |
| Typical use     | Dynamic sequences that grow      | Fixed records, dict keys, function returns |

## Verdict

Reach for a **tuple** when the data is fixed (coordinates, RGB values, function return pairs) — it signals intent and can be used as a dict key or set element. Use a **list** when you need to append, pop, sort, or otherwise modify the collection.
