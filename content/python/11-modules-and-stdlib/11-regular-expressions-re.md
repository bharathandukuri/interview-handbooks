---
type: concept
title: "Pattern matching with regular expressions (re)"
difficulty: medium
mostAsked: true
tags: [regex, strings, stdlib, validation]
related:
  [
    python.strings.escape-sequences-and-raw-strings,
    python.modules-and-stdlib.regex-vs-string-methods,
  ]
revision:
  - "Always write regex patterns as **raw strings** (`r'\\d+'`) so Python does not eat backslashes before `re` sees them"
  - "`re.match()` checks **only the start** of a string; `re.search()` finds anywhere; `re.fullmatch()` validates the **entire** string"
  - "`.*` is **greedy** (matches as much as possible); `.*?` is **lazy** (stops at the first match)"
---

A **regular expression** (**regex**) describes a pattern in text — helpful for extracting dates, validating IDs, or replacing structured tokens.

Always prefix regex strings with **`r"..."`** (raw string, Chapter 04) so escapes like `\d` reach the `re` engine intact instead of Python interpreting backslashes first:

```python
import re

text = "Order #402 shipped on 2026-11-25 for $49.99"

# 1. search (first match anywhere) vs fullmatch (entire string must match)
m = re.search(r"#(\d+)", text)
print("order id:", m.group(1) if m else None)
print("valid date '2026-11-25'?", bool(re.fullmatch(r"\d{4}-\d{2}-\d{2}", "2026-11-25")))
print("match vs fullmatch on '2026-11-25xyz':",
      bool(re.match(r"\d{4}-\d{2}-\d{2}", "2026-11-25xyz")),
      bool(re.fullmatch(r"\d{4}-\d{2}-\d{2}", "2026-11-25xyz")))

# 2. Greedy `.*` vs lazy `.*?`
html = "<b>first</b> and <b>second</b>"
print("greedy:", re.findall(r"<b>.*</b>", html))
print("lazy:  ", re.findall(r"<b>.*?</b>", html))

# 3. Compile once if reusing inside a big loop, and substitute with re.sub
DATE_RE = re.compile(r"(\d{4})-(\d{2})-(\d{2})")
print("masked:", DATE_RE.sub(r"\3/\2/\1", text))
```

The screen shows:

```text
order id: 402
valid date '2026-11-25'? True
match vs fullmatch on '2026-11-25xyz': True False
greedy: ['<b>first</b> and <b>second</b>']
lazy:   ['<b>first</b>', '<b>second</b>']
masked: Order #402 shipped on 25/11/2026 for $49.99
```

**Core regex syntax cheat sheet & edge cases:**

- `\d` digit, `\w` word char (letters/digits/`_`), `\s` whitespace; uppercase `\D`, `\W`, `\S` mean the opposite.
- `+` (1 or more), `*` (0 or more), `?` (0 or 1), `{m,n}` (between `m` and `n`), `[a-z0-9]` (character class), `^` / `$` (start/end).
- **`re.findall()` trap with groups:** If your pattern has capturing parentheses `(...)`, `re.findall()` returns **only the captured groups**, not the whole match! Use non-capturing `(?:...)` when you just need grouping without altering `findall()`.
- **Greedy vs lazy:** `.*` eats up to the _last_ `</b>`, spanning both tags; `.*?` stops at the _first_ `</b>`.
- **ReDoS edge case:** Deeply nested quantifiers like `(a+)+b` can stall exponentially on malformed untrusted input — keep regexes simple and flat!
