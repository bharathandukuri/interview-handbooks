---
type: compare
title: "Generators vs iterators"
difficulty: medium
left: "Generator"
right: "Iterator (class)"
tags: [generators, iterators, memory]
---

| Feature         | Generator (`yield`)                           | Custom Iterator Class                                 |
| --------------- | --------------------------------------------- | ----------------------------------------------------- |
| Syntax          | `yield` function or `(x for x in ...)`        | `__iter__` + `__next__` methods                       |
| Boilerplate     | Minimal                                       | Explicit class & state attributes                     |
| Memory          | Lazy — one item at a time                     | Lazy (if implemented without buffering)               |
| Coroutine hooks | ✅ Supports `.send()`, `.throw()`, `.close()` | ❌ Manual if needed                                   |
| Reusable?       | ❌ Exhausted after one pass                   | ✅ Can reset or return fresh iterator from `__iter__` |

## Verdict

Prefer **generators** for almost all lazy streams and pipelines — they're concise and readable. Reach for a **custom class** only when callers need to inspect state/attributes mid-stream or re-iterate the same object multiple times.
