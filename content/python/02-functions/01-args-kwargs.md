---
type: concept
title: "`*args` and `**kwargs`: unpacking vs packing"
difficulty: easy
tags: [functions, syntax]
mostAsked: false
revision:
  - "`*args` packs extra positional arguments into a `tuple`"
  - "`**kwargs` packs extra keyword arguments into a `dict`"
---

Think of `*` and `**` as two sides of the same coin: **packing** inside a function definition and **unpacking** at a call site.

In a signature, `*args` collects any leftover positional arguments into a `tuple`, while `**kwargs` collects leftover keyword arguments into a `dict`. The names `args` and `kwargs` are only convention — the stars do the real work.

```python
def log(level: str, *args: object, **kwargs: object) -> None:
    print(level, args, kwargs)

log("INFO", "started", port=8080)
# INFO ('started',) {'port': 8080}
```

At a call site, the same stars **unpack** a sequence or mapping back into individual arguments: `fn(*pair, **opts)`.

:::tip[Forwarding safely]
Use `def wrapper(*args, **kwargs):` when writing decorators so any wrapped function signature passes straight through. Press :kbd[Space] when practicing question cards to test yourself first.
:::
