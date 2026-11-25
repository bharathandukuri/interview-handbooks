---
type: compare
title: "Dynamic vs Static typing, and Strong vs Weak typing"
difficulty: easy
mostAsked: true
left: "Dynamic & Strong (Python)"
right: "Static / Weak (C++, Java, JS)"
tags: [types, theory, interviews, comparison]
related: [python.variables-and-types.what-is-dynamic-typing]
revision:
  - "**Dynamic vs Static** decides **when** types are checked (**runtime** vs **compile-time**); **Strong vs Weak** decides whether mismatched types auto-convert"
  - "Python is **dynamically AND strongly typed**: names can switch types freely, yet `'5' + 3` raises **`TypeError`** instead of guessing `'53'` or `8`"
---

People often confuse two **independent** axes when talking about type systems:

| Axis / Feature                | Dynamic + Strong (**Python**)                | Static + Strong (**Java / Go / Rust**) | Dynamic + Weak (**JavaScript**)      |
| ----------------------------- | -------------------------------------------- | -------------------------------------- | ------------------------------------ |
| Variable name has fixed type? | ❌ No — value carries type at runtime        | ✅ Yes (`int x = 10;` fixed!)          | ❌ No                                |
| When type mismatches fail     | At runtime when that line runs (`TypeError`) | Before running (compiler error)        | Silently coerces types!              |
| What `"5" + 3` does           | Raises **`TypeError`** (refuses to guess!)   | Compiler error                         | Coerces `3` -> `"3"`, yields `"53"`! |
| What `"5" - 3` does           | Raises **`TypeError`**                       | Compiler error                         | Coerces `"5"` -> `5`, yields `2`!!   |

## Verdict

Python chooses **Dynamic + Strong typing**: fast prototyping without writing type names everywhere, paired with safety against silent `"5" + 3 -> "53"` bugs! And in large Python teams (Chapter 16), adding optional **type hints (`age: int`)** checked by `mypy`/`pyright` lets you capture static checking benefits too without changing runtime behavior.
