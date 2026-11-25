---
type: compare
title: "String methods vs re: simple checks vs pattern matching"
difficulty: easy
left: "str methods (.startswith, split, in)"
right: "re module (regular expressions)"
tags: [strings, regex, clean-code, performance]
related: [python.modules-and-stdlib.regular-expressions-re]
---

Because `re` is powerful, beginners sometimes reach for regexes when built-in string methods already solve the job in half the code:

| Task                        | `str` methods                                    | `re` module                                          |
| --------------------------- | ------------------------------------------------ | ---------------------------------------------------- |
| Prefix/suffix check         | `s.startswith("https://")` (**instant & clear**) | Overkill + easy to forget escaping `.` or `/`        |
| Fixed delimiter split       | `line.split(",")`                                | Needed only for multi-delimiter `re.split(r"[,;]+")` |
| Validate complex pattern    | Messy manual `if` chains                         | Clean `re.fullmatch(r"[A-Z]{2}\d{4}", code)`         |
| Extract all prices / dates  | Fragile manual loops                             | Simple `re.findall(...)` or `re.finditer(...)`       |
| Parsing nested HTML or JSON | ❌ Wrong tool                                    | ❌ Wrong tool too! Use `json` or an HTML parser      |

## Verdict

Follow this simple rule of thumb: **if you know the exact substring or separator**, use built-in **`str` methods** (`in`, `.startswith()`, `.endswith()`, `.replace()`, `.removeprefix()`, `.split()`). Reach for **`re`** when you need a _shape_ or _pattern_ (flexible digits, repeated whitespace, structured tokens). Never parse HTML or JSON with regex — use dedicated parsers (`json`, `xml`, HTML parsers).
