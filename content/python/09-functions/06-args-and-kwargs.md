---
type: concept
title: "*args and **kwargs: packing and unpacking arguments"
difficulty: medium
mostAsked: true
tags: [functions, args, kwargs, syntax]
related:
  [
    python.functions.positional-keyword-and-defaults,
    python.lists-and-tuples.tuple-unpacking,
  ]
revision:
  - "In `def`, `*args` **packs** extra positional args into a `tuple`, and `**kwargs` packs extra keyword args into a `dict`"
  - "At a call site, `fn(*seq, **opts)` **unpacks** a sequence and dictionary into individual arguments"
  - "Full parameter order rule: `(positional, /, normal, *args, kw_only, **kwargs)`"
---

`*` and `**` work as opposites depending on whether you are **defining** a function or **calling** one:

- **Inside `def` (packing):**
  - `*args` collects any extra positional arguments into a **`tuple`**.
  - `**kwargs` collects any extra keyword arguments into a **`dict`**.
    (The names `args` and `kwargs` are just tradition — the stars `*` and `**` do the work!)

```python
def log(level, *args, **kwargs):
    print(level, args, kwargs)

log("INFO", "server", "ready", port=8080, debug=False)

# At a call site (unpacking!):
nums = (10, 20)
opts = {"port": 9000}
log("WARN", *nums, **opts)
```

The screen shows:

```text
INFO ('server', 'ready') {'port': 8080, 'debug': False}
WARN (10, 20) {'port': 9000}
```

**Edge cases:**

- If no extra arguments are passed, `args` is `()` (empty tuple) and `kwargs` is `{}` (empty dict).
- **Exact signature order rule:** Any parameters written _after_ `*args` automatically become **keyword-only** (`def f(a, *args, flag=True, **kwargs):`). `**kwargs` must always be the **very last** parameter in `def`.
- Unpacking `**opts` requires all dictionary keys to be `str` matching parameter names (unless accepted by `**kwargs`).
