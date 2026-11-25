---
type: pitfall
title: "Security traps: `pickle`, `eval()`, and SQL f-strings"
difficulty: medium
tags: [security, pitfalls, sql]
---

## The trap

```python
# 1. Arbitrary code execution via untrusted pickle or eval
user_obj = pickle.loads(untrusted_bytes)   # RCE via __reduce__!
val = eval(user_input)                     # runs arbitrary Python code!

# 2. SQL injection via f-strings
cursor.execute(f"SELECT * FROM users WHERE name = '{name}'")
```

## The fix

```python
import ast, json

# 1. Use JSON (data-only) or ast.literal_eval for safe Python literals
data = json.loads(untrusted_text)
safe_val = ast.literal_eval("[1, 2, 3]")   # only parses literals, never calls functions

# 2. Always use parameterized SQL queries
cursor.execute("SELECT * FROM users WHERE name = %s", (name,))
```

## Why it happens

`pickle` is a stack-machine protocol capable of importing modules and invoking arbitrary callables during deserialization — never unpickle untrusted network or user data. `eval()`/`exec()` execute arbitrary expressions with full process privileges. Parameterized queries keep SQL structure separate from user-supplied values at the driver/DB protocol level.
