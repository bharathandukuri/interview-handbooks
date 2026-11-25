---
type: pitfall
title: "Security traps: eval(), pickle on untrusted input, and SQL/shell injection"
difficulty: medium
mostAsked: true
tags: [security, sql, pickle, eval, gotchas]
related: [python.errors-and-files.json-and-csv-files]
revision:
  - "Never run **`eval()`**, **`exec()`**, or **`pickle.loads()`** on untrusted user/network input — all three allow **arbitrary code execution**"
  - "Never format SQL queries with f-strings (`f'... {user}'`); always use **parameterized queries (`?` / `%s`)**"
  - "Avoid `subprocess.run(..., shell=True)` with user text; pass argument lists cleanly with `shell=False`"
---

## The trap

```python
# Dangerous patterns — NEVER pass user strings to any of these three:
# 1. eval(user_text) / exec(user_text) -> runs ANY Python code (`__import__('os')...`)!
# 2. pickle.loads(untrusted_bytes)     -> runs arbitrary `__reduce__` code on decode!
# 3. f"SELECT * FROM users WHERE name = '{name}'" -> SQL injection (`' OR '1'='1`)!
# 4. subprocess.run(f"cat {filename}", shell=True) -> shell injection (`a.txt; rm -rf /`)!
```

## The fix

```python
import ast, json, sqlite3

# 1. Parse simple Python literals safely (`ast.literal_eval`) or use JSON for data interchange:
safe_config = ast.literal_eval("{'retries': 3, 'ports': [80, 443]}")
json_data = json.loads('{"user": "ada"}')

# 2. Parameterized SQL queries bind values safely without touching SQL syntax:
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE users (name TEXT, role TEXT)")
conn.execute("INSERT INTO users VALUES (?, ?)", ("ada", "admin"))

malicious_input = "ada' OR '1'='1"
rows = conn.execute("SELECT name, role FROM users WHERE name = ?", (malicious_input,)).fetchall()
print("Safe query matched:", rows, "| parsed:", safe_config["retries"], json_data["user"])
```

## Why it happens

1. **`eval()` & `pickle.loads()`:** Neither is a pure data parser! `eval` compiles and executes arbitrary expressions, and `pickle`'s binary VM calls object constructors (`__reduce__`) immediately during deserialization — even if you never call methods on the result afterward. Use **`json`** across service boundaries, or **`ast.literal_eval()`** strictly when evaluating trusted-syntax Python literals (`dict`, `list`, `int`, `str`, `bool`).
2. **String-built SQL / shell commands:** Joining user strings into SQL mixes **code** and **data** — attackers inject quotes (`' OR '1'='1`) to rewrite query logic or drop tables. Parameterized placeholders (`?` in `sqlite3`, `%s` in PostgreSQL drivers) keep query structure separate from literal values automatically.
