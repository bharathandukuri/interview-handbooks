---
type: concept
title: "Looping over dicts: keys(), values(), items() and live views"
difficulty: easy
tags: [dicts, loops, views, edge-cases]
related: [python.dictionaries-and-sets.what-is-a-dictionary]
revision:
  - "`for k in d:` iterates keys; `.values()` gives values; `.items()` yields `(key, value)` pairs"
  - "`.keys()`, `.values()`, `.items()` return **live view objects** that reflect later dict edits"
  - "Never add or delete keys while looping directly over a dict (`RuntimeError` — loop over `list(d.keys())` instead)"
---

Dictionaries give you three methods to loop through their contents:

```python
prices = {"apple": 20, "milk": 50}

for item in prices:                      # same as prices.keys()
    print(item, end=" ")
print()

for item, cost in prices.items():        # unpacks each (key, value) tuple!
    print(f"{item}=${cost}", end="  ")
```

The screen shows:

```text
apple milk
apple=$20  milk=$50
```

**Two subtle details to know:**

1. **Dictionary views stay live:** Calling `keys_view = prices.keys()` does not copy a list — it creates a dynamic **view**. If you add `prices["bread"] = 30`, `keys_view` immediately sees `"bread"` too!
2. **Edge case — changing size mid-loop:** Never write `for k in prices: del prices[k]`! Adding or deleting keys while iterating raises **`RuntimeError: dictionary changed size during iteration`**. To delete conditionally while looping, iterate over a snapshot copy `for k in list(prices.keys()):`. (Updating an existing value like `prices[k] += 5` is completely fine!)
