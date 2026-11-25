---
type: compare
title: "Generators vs iterators"
difficulty: medium
left: "Generator"
right: "Iterator (class)"
tags: [generators, iterators, memory]
---

| Feature              | Generator                                   | Iterator (class)                 |
| -------------------- | ------------------------------------------- | -------------------------------- |
| Syntax               | `yield` in a function or `(x for x in ...)` | `__iter__` + `__next__` methods  |
| Boilerplate          | Minimal                                     | Explicit class required          |
| Memory               | Lazy — one value at a time                  | Usually lazy, but up to you      |
| `send()` / `throw()` | ✅ Supported (coroutine-style)              | ❌ Not built-in                  |
| Reusable             | ❌ Exhausted after one pass                 | ✅ Can reset state in `__init__` |
| Debuggability        | Frame inspection via `gi_frame`             | Explicit state in attributes     |

## Verdict

Prefer generators for simple lazy sequences — they're concise and memory-efficient. Write a full iterator class when you need to reset state, expose multiple "current item" attributes, or compose several iteration strategies in a single object.
