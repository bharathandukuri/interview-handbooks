---
type: concept
title: "Regular expressions (`re`) essentials"
difficulty: medium
tags: [regex, strings, stdlib]
---

Always use **raw strings** (`r"..."`) for regex patterns so backslashes (`\d`, `\w`, `\b`) aren't consumed by Python string escapes.

```python
import re

EMAIL_RE = re.compile(r"(?P<user>[\w.+-]+)@(?P<domain>[\w-]+\.[\w.-]+)")
m = EMAIL_RE.search("Contact: ada.lovelace@example.org!")
if m:
    print(m.group("user"), m.group("domain"))   # ada.lovelace example.org
```

**Methods to distinguish:**

- `re.match()`: anchors at **start** of string only.
- `re.fullmatch()`: entire string must match (ideal for validation!).
- `re.search()`: finds the **first** match anywhere in the string.
- `re.finditer()` / `re.findall()`: yields all matches; `re.sub(pat, repl, text)` replaces matches.

:::pitfall[Greedy vs lazy quantifiers]
`.*` is **greedy** (matches as much as possible). Use `.*?` for **lazy** matching, and compile hot regexes once at module level with `re.compile()`.
:::
