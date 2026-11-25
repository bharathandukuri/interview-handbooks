---
type: compare
title: "`typing.Protocol` vs `abc.ABC`"
difficulty: medium
left: "typing.Protocol"
right: "abc.ABC"
tags: [typing, oop, architecture]
---

| Feature                 | `typing.Protocol`                 | `abc.ABC`                                        |
| ----------------------- | --------------------------------- | ------------------------------------------------ |
| Subtyping style         | Structural (duck typing)          | Nominal (explicit inheritance)                   |
| Requires inheriting?    | ❌ No                             | ✅ Yes                                           |
| Missing method error    | Caught statically by mypy/pyright | Caught at runtime on instantiation (`TypeError`) |
| Shared concrete methods | Minimal (focuses on shape)        | ✅ Great for template methods & shared state     |
| Third-party classes     | ✅ Works without touching them    | ❌ Cannot easily retrofit                        |

## Verdict

Use **`Protocol`** when defining **consumer-side interfaces** (e.g., "give me anything with `.read()`" or "any logger with `.info()`") — it keeps coupling zero. Use **`abc.ABC`** when building a framework base class that shares concrete helper logic or needs strict runtime instantiation guards.
