---
type: compare
title: "in vs .find() vs .index() for searching strings"
difficulty: easy
left: "in (membership)"
right: ".find() / .index() (position)"
tags: [strings, methods, search]
related: [python.strings.find-count-and-replace]
revision:
  - "Use `in` / `not in` when you only need `True` or `False`"
  - "Use `.find()` when you want the index (`-1` on miss); compare `!= -1` because `0` is falsy!"
---

All three tools look for a substring inside a string, but they differ in return value and failure behavior:

| Feature                       | `"py" in text`    | `text.find("py")`             | `text.index("py")`                |
| ----------------------------- | ----------------- | ----------------------------- | --------------------------------- |
| Return value                  | `True` or `False` | First starting index, or `-1` | First starting index              |
| When missing                  | Returns `False`   | Returns `-1`                  | Raises `ValueError`               |
| Tells exact index?            | No                | Yes                           | Yes                               |
| Safe in `if cond:` directly?  | ✅ Yes            | ❌ Trap when index is `0`!    | Raises instead of returning falsy |
| Also supports reverse search? | No                | `.rfind("py")`                | `.rindex("py")`                   |

## Verdict

Always prefer **`in`** (or **`not in`**) when you only care whether a substring exists — `if "error" in log:` reads cleanly and has zero edge-case traps. Use **`.find()`** only when you need the character index, and **always write `if text.find(...) != -1:`** (because index `0` is falsy and `if text.find(...)` would wrongly skip matches at the very start of the string!). Use `.index()` when a missing substring indicates an unexpected error that should crash loudly.
