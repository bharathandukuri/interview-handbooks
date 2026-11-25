---
type: concept
title: "Arguments: positional, keyword, defaults, / and *"
difficulty: easy
mostAsked: true
tags: [functions, arguments, syntax, edge-cases]
related: [python.functions.defining-and-calling-functions]
revision:
  - "**Positional** arguments match by order; **keyword** arguments (`port=8080`) match by name"
  - "Non-default parameters must come **before** default parameters in `def`, and positional args before keyword args at call sites"
  - "`/` marks **positional-only** params before it; `*` marks **keyword-only** params after it (Python 3.8+)"
---

Python offers flexible ways to define **parameters** and pass **arguments**:

```python
def connect(host, port=5432, ssl=True):
    return f"{host}:{port} ssl={ssl}"

print(connect("db.local"))                # uses defaults for port and ssl
print(connect("db.local", ssl=False))     # positional + keyword!
print(connect(port=3306, host="mysql"))   # all keyword (any order works!)
```

The screen shows:

```text
db.local:5432 ssl=True
db.local:5432 ssl=False
mysql:3306 ssl=True
```

**Three strict syntax rules and modern signature separators:**

1. **Default parameters come after required ones:** `def bad(port=80, host):` raises `SyntaxError`.
2. **Positional arguments come before keyword arguments when calling:** `connect(host="a", 80)` raises `SyntaxError`.
3. **Positional-only (`/`) and keyword-only (`*`) parameters (Python 3.8+):**
   ```python
   def api_call(user_id, /, *, strict=True):
       pass
   ```
   Parameters before `/` **must** be passed positionally (`api_call(user_id=1)` fails!); parameters after `*` **must** be passed by keyword (`api_call(1, False)` fails!). This keeps public library APIs clean and readable.
