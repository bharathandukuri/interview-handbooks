---
type: concept
title: "Dictionaries in depth"
difficulty: easy
mostAsked: true
tags: [dicts, hashing, data-structures]
revision:
  - "Dicts preserve insertion order (3.7+) and offer O(1) average lookup/insert/delete"
  - "Use `d.get(k, default)` instead of `d[k]` to avoid `KeyError`"
  - "Merge dicts cleanly with `d1 | d2` (new dict) or `d1 |= d2` (in-place)"
---

A `dict` maps **hashable keys** to arbitrary values while preserving insertion order.

```python
user = {"name": "Ada", "role": "admin"}
age = user.get("age", 0)         # safe lookup: returns 0 instead of KeyError
removed = user.pop("role", None) # remove & return with fallback

# Views stay live-synced with the dict
for k, v in user.items():
    print(k, v)

# Merging dicts (Python 3.9+)
defaults = {"theme": "dark", "lang": "en"}
custom = {"lang": "fr"}
merged = defaults | custom       # {'theme': 'dark', 'lang': 'fr'}
```

**Common methods:**

- `d.setdefault(k, []).append(v)` inserts `[]` only if `k` is missing, then appends (though `collections.defaultdict(list)` is cleaner for loops).
- `dict.fromkeys(["a", "b"], 0)` initializes keys safely — **never** pass a mutable default like `[]` to `fromkeys`, because every key shares the same list!
