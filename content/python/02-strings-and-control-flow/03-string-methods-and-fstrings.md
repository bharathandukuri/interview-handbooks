---
type: concept
title: "String methods and f-strings"
difficulty: easy
mostAsked: true
tags: [strings, f-strings, formatting]
revision:
  - 'Use `"sep".join(parts)` to concatenate many strings in O(n), not `+=` in a loop'
  - "f-strings evaluate expressions at runtime and support format specs (`:.2f`, `,`, `=`)"
---

Essential string methods to know cold:

```python
line = "  alice, bob ,charlie  "
parts = [p.strip() for p in line.split(",")]  # ['alice', 'bob', 'charlie']
joined = " | ".join(parts)                     # 'alice | bob | charlie'

"hello.py".removesuffix(".py")   # 'hello' (Python 3.9+)
"abc123".isalnum()               # True (also .isalpha(), .isdigit())
"hi there".replace("hi", "hey")  # 'hey there'
```

**f-strings (Python 3.6+ / nested quotes improved in 3.12):**

```python
price, count = 1234.5, 3
print(f"Total: ${price * count:,.2f}")   # Total: $3,703.50
print(f"{price=}, {count=}")             # price=1234.5, count=3 (debug helper)
```

Use `.find(sub)` when you want `-1` on miss, or `.index(sub)` when missing should raise `ValueError`. Prefer `in` for simple substring checks (`"py" in "python"`).
