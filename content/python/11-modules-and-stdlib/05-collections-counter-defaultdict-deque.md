---
type: concept
title: "Supercharged containers in collections: Counter, defaultdict, deque"
difficulty: medium
mostAsked: true
tags: [collections, counter, defaultdict, deque, stdlib]
related:
  [
    python.lists-and-tuples.stack-and-queue-with-lists,
    python.dictionaries-and-sets.word-counter,
  ]
revision:
  - "`Counter` counts hashable items fast, returns `0` for missing keys, and gives `.most_common(k)`"
  - "`defaultdict(list)` auto-initializes missing keys via a factory function (warning: reading a missing key inserts it!)"
  - "`deque` gives **`O(1)`** `.appendleft()` / `.popleft()` and supports bounded sliding windows with `maxlen=`"
---

Python's built-in `collections` module provides specialized containers that replace verbose manual boilerplate and fix `O(n)` performance bottlenecks:

```python
from collections import Counter, defaultdict, deque

# 1. Counter: instant frequency dictionary + multiset math
votes = Counter(["red", "blue", "red", "green", "red", "blue"])
print("Top 2:", votes.most_common(2))
print("Missing key count:", votes["purple"])  # returns 0 cleanly, does NOT insert!

# 2. defaultdict: pass a callable factory (`list`, `int`, `set`) — NEVER `list()`!
grouped = defaultdict(list)
for dept, person in [("eng", "Ada"), ("sales", "Bob"), ("eng", "Lin")]:
    grouped[dept].append(person)
print("Grouped:", dict(grouped))

# 3. deque: O(1) appends and pops on BOTH ends + automatic ring buffer via `maxlen`
history = deque(maxlen=3)
for page in ["home", "docs", "pricing", "checkout"]:
    history.append(page)                       # automatically drops oldest ("home")!
print("Recent 3:", list(history))
print("Pop left:", history.popleft(), "| remaining:", list(history))
```

The screen shows:

```text
Top 2: [('red', 3), ('blue', 2)]
Missing key count: 0
Grouped: {'eng': ['Ada', 'Lin'], 'sales': ['Bob']}
Recent 3: ['docs', 'pricing', 'checkout']
Pop left: docs | remaining: ['pricing', 'checkout']
```

**Critical edge cases to remember:**

- **`defaultdict` silent insertion trap:** Because `grouped["hr"]` calls the factory (`list()`), simply _reading_ `grouped["hr"]` inside a `print()` or condition creates `"hr": []` in the dict! Use `grouped.get("hr")` or `in` when probing without wanting to mutate. Also remember to pass `list` (the class/factory), **never** `list()` (an evaluated object -> `TypeError: first argument must be callable`).
- **`Counter` preserves zero/negative counts when doing arithmetic:** `Counter({"a": 2}) - Counter({"a": 3})` drops zero/negative counts cleanly, whereas explicit `c["a"] -= 1` can leave `0` or `-1`; `+c` strips non-positive items.
- **`deque` random indexing:** `d[0]` and `d[-1]` are `O(1)`, **but** middle indexing `d[n // 2]` is **`O(n)`** (not `O(1)` like `list`) because `deque` is stored as linked blocks!
