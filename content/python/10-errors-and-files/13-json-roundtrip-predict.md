---
type: predict
title: "JSON serialization round-trip type changes"
difficulty: medium
tags: [json, types, tuples, gotchas]
related: [python.errors-and-files.json-and-csv-files]
options:
  - "['py', '3.12'] list\nFalse True None"
  - "('py', '3.12') tuple\nTrue True None"
  - "['py', '3.12'] tuple\nFalse true null"
  - "TypeError: keys must be str"
answer: 0
---

```python
import json

payload = {1: ("py", "3.12"), "ok": True, "missing": None}
encoded = json.dumps(payload)
decoded = json.loads(encoded)

print(decoded["1"], type(decoded["1"]).__name__)
print(1 in decoded, decoded["ok"], decoded["missing"])
```

## Output

```text
['py', '3.12'] list
False True None
```

## Explanation

Passing Python data through JSON changes two types that Python developers frequently overlook:

1. **JSON object keys are always strings (`str`):** When `json.dumps` converts `{1: ...}`, integer key `1` becomes `"1"` in JSON text! So after `json.loads`, `1 in decoded` is `False` while `decoded["1"]` exists.
2. **JSON has only arrays (`list`), not Python `tuple`s:** Your tuple `("py", "3.12")` is encoded as JSON `["py", "3.12"]` and comes back as a Python **`list`**, not a `tuple`!
3. **`True` <-> `true` and `None` <-> `null`:** `json.loads` converts JSON `true`/`null` back into Python's `True` and `None`.
