---
type: predict
title: "Equal keys in dicts and sets (1, True, 1.0) and dict merging"
difficulty: medium
mostAsked: true
tags: [dicts, sets, hashing, edge-cases, predict]
related:
  [
    python.dictionaries-and-sets.what-is-a-dictionary,
    python.dictionaries-and-sets.reading-updating-and-deleting,
  ]
revision:
  - "Equal keys with equal hashes (`1 == True == 1.0`) occupy **one slot**: dict keeps the **first key** and updates to the **latest value**"
  - "Merging `a | b` updates matching keys with the right dict's values"
options:
  - "2 bool 3 {'a': 1, 'b': 2}"
  - "1 bool 1 {'a': 1, 'b': 9, 'c': 3}"
  - "1 int 1 {'a': 1, 'b': 2, 'c': 3}"
  - "2 int 3 {'a': 1, 'b': 9, 'c': 3}"
answer: 1
---

Remember from Chapter 3 that `1 == True == 1.0`! Predict how Python's dict and set handle all three together.

```python
d = {1: "int", True: "bool"}
s = {1, True, 1.0}
merged = {"a": 1, "b": 2} | {"b": 9, "c": 3}

print(len(d), d[1], len(s), merged)
```

## Output

```text
1 bool 1 {'a': 1, 'b': 9, 'c': 3}
```

## Explanation

1. **In Python, `1 == True == 1.0` AND all three share the exact same hash (`hash(1) == hash(True) == hash(1.0) == 1`).**
   - In **`d = {1: "int", True: "bool"}`**: `1` is added first. When `True: "bool"` arrives, Python sees `True == 1`, so it **keeps the original key (`1`)** and **overwrites the value with `"bool"`**! Length is `1`, and `d[1]` is **`bool`**.
   - In **`s = {1, True, 1.0}`**: `1` is added first; `True` and `1.0` match the already-present `1`, so both are ignored -> length is **`1`**.
2. **`{"a": 1, "b": 2} | {"b": 9, "c": 3}`:** The merge operator combines keys and lets the **right-hand dict win** on conflicts (`"b": 9`), giving `{'a': 1, 'b': 9, 'c': 3}`.
