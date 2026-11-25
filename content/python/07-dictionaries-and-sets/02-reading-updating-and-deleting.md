---
type: concept
title: "Reading, updating, merging, and deleting dict keys"
difficulty: easy
mostAsked: true
tags: [dicts, methods, edge-cases]
related: [python.dictionaries-and-sets.what-is-a-dictionary]
revision:
  - "Use `d.get(key, default)` instead of `d[key]` when a key might be missing (`d[key]` raises `KeyError`)"
  - "Assign `d[key] = val` to add or overwrite; use `d.pop(key, default)` or `del d[key]` to remove"
  - "Merge two dicts cleanly with `d1 | d2` (new dict) or `d1 |= d2` (update in place, Python 3.9+)"
---

You can add, update, read safely, and remove pairs from a dictionary directly:

```python
scores = {"Ada": 95, "Bob": 80}
scores["Ada"] = 99                 # updates existing key
scores["Cara"] = 88                # inserts new key

print(scores.get("Bob"))           # 80
print(scores.get("Zoe", 0))        # missing key -> returns fallback 0 (no crash!)
removed = scores.pop("Bob", None)  # removes "Bob" and returns 80

merged = {"a": 1, "b": 2} | {"b": 9, "c": 3}   # right wins on conflict!
print(scores, "removed:", removed, "merged:", merged)
```

The screen shows:

```text
80
0
{'Ada': 99, 'Cara': 88} removed: 80 merged: {'a': 1, 'b': 9, 'c': 3}
```

**Important edge cases:**

- **`d[key]` vs `d.get(key)`:** `scores["Zoe"]` crashes with `KeyError: 'Zoe'`; `scores.get("Zoe")` safely returns `None` (or your custom fallback default).
- **`del` vs `.pop()`:** `del scores["missing"]` raises `KeyError`, whereas `scores.pop("missing", None)` safely returns `None` without crashing.
- **`.setdefault(k, default)`:** Inserts `default` only if `k` is absent, then returns `d[k]`.
- **Merge precedence (`d1 | d2`):** When both dicts share a key (`"b"`), the **right-hand** dict wins (`9`).
