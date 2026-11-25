---
type: compare
title: "Assignment (=) vs shallow copy vs copy.deepcopy()"
difficulty: easy
left: "Alias (=) & Shallow Copy (.copy() / [:])"
right: "Deep Copy (copy.deepcopy())"
tags: [internals, copying, mutability, memory]
related: [python.how-python-works-inside.shallow-vs-deep-copy]
---

Comparing how each operation treats outer containers versus inner nested objects saves you from accidental shared-state mutations:

| Property                   | Alias (`b = a`)             | Shallow copy (`a.copy()`, `a[:]`, `list(a)`) | Deep copy (`copy.deepcopy(a)`)        |
| -------------------------- | --------------------------- | -------------------------------------------- | ------------------------------------- |
| New outer container?       | ❌ No (`b is a` is `True`)  | ✅ Yes (`b is a` is `False`)                 | ✅ Yes (`b is a` is `False`)          |
| Nested lists/dicts shared? | ✅ Yes (same inner objects) | ⚠️ **Yes!** (`b[0] is a[0]` is `True`!)      | ❌ No (fresh recursive copies)        |
| Cost / speed               | `O(1)` pointer copy         | `O(len(a))` top-level pointers               | `O(total nested objects)` + memo dict |
| Handles circular cycles?   | N/A                         | N/A                                          | ✅ Yes (tracks seen object ids!)      |

## Verdict

Never use `b = a` expecting isolation. Use a **shallow copy** (`lst.copy()`, `dict(d)`) when all nested items are immutable (`int`, `str`, `tuple` of immutables) — it is fast and readable. Whenever a structure holds **nested mutable lists/dicts/objects**, reach for **`copy.deepcopy()`** (or redesign cleanly with immutable `@dataclass(frozen=True)` records!).
