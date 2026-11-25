---
type: pitfall
title: "Missing key crashes (KeyError) and shared dict.fromkeys([]) trap"
difficulty: medium
mostAsked: true
tags: [dicts, gotchas, aliasing, edge-cases]
related: [python.dictionaries-and-sets.reading-updating-and-deleting]
revision:
  - "Direct `d[k]` on a missing key raises `KeyError`; use `d.get(k, fallback)` when keys may be absent"
  - "`dict.fromkeys(keys, [])` shares **one single list** across every key — mutate one and all keys change!"
---

## The trap

```python
# Trap 1: assuming a key exists
counts = {"apples": 2}
# counts["bananas"] += 1        # KeyError: 'bananas'!

# Trap 2: initializing dictionary values with mutable [] via fromkeys
groups = dict.fromkeys(["odd", "even"], [])
groups["odd"].append(1)
print(groups)                   # {'odd': [1], 'even': [1]} <-- BOTH got 1!
```

## The fix

```python
# Fix 1: use .get()
counts = {"apples": 2}
counts["bananas"] = counts.get("bananas", 0) + 1

# Fix 2: build a separate [] for every key with a loop
groups = {}
for k in ["odd", "even"]:
    groups[k] = []
groups["odd"].append(1)
print(groups)                   # {'odd': [1], 'even': []}
```

## Why it happens

1. `counts["bananas"] += 1` tries to _read_ `counts["bananas"]` before adding `1`, raising `KeyError` when absent.
2. `dict.fromkeys(keys, value)` stores the **same reference** to `value` under every key. When `value` is `0` or `None` (immutable), sharing is harmless. When `value` is `[]`, mutating any key mutates the shared list everywhere!
