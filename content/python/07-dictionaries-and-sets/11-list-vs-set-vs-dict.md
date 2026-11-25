---
type: compare
title: "List vs Set vs Dict: picking the right container"
difficulty: easy
mostAsked: true
left: "list / tuple"
right: "set / dict"
tags: [lists, sets, dicts, complexity]
related:
  [
    python.lists-and-tuples.list-vs-tuple,
    python.dictionaries-and-sets.what-is-a-set,
  ]
revision:
  - "Membership check `x in container` is slow linear scan `O(n)` on `list`/`tuple`, and instant hash lookup `O(1)` on `set`/`dict`"
  - "Pick `list` for order + duplicates; `set` for fast uniqueness/membership; `dict` for key -> value mapping"
---

Every container has a clear sweet spot — choosing the wrong one can turn a 1-millisecond script into a multi-minute bottleneck:

| Feature                 | `list` `[...]`               | `set` `{...}`                  | `dict` `{k: v}`                     |
| ----------------------- | ---------------------------- | ------------------------------ | ----------------------------------- |
| Duplicates allowed?     | ✅ Yes                       | ❌ No                          | ❌ Keys unique (values can repeat)  |
| Ordered?                | ✅ Always                    | ❌ Unordered (no index)        | ✅ Preserves insertion order (3.7+) |
| Lookup by index `x[0]`? | ✅ Yes (`O(1)`)              | ❌ No (`TypeError`)            | ❌ No (lookup by key `d[k]`)        |
| Speed of `item in x`    | Slow on big data: **`O(n)`** | Fast hash lookup: **`O(1)`**   | Fast key lookup: **`O(1)`**         |
| Elements/keys hashable? | Any type allowed             | ✅ Must be hashable            | ✅ Keys must be hashable            |
| Memory footprint        | Compact array of pointers    | Hash table (more RAM per item) | Hash table of pairs (more RAM)      |

## Verdict

- Choose a **`list`** when **position or duplicates** matter (ordered history, scores, steps).
- Choose a **`set`** whenever you find yourself writing `if x not in seen:` over thousands of items, or finding overlaps (`a & b`, `a - b`).
- Choose a **`dict`** whenever you associate keys with values (user profiles, caches, frequency counts, Two Sum indices).
