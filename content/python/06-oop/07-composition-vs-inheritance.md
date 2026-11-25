---
type: compare
title: "Composition vs Inheritance"
difficulty: medium
left: "Composition (has-a)"
right: "Inheritance (is-a)"
tags: [oop, design, architecture]
---

| Dimension            | Composition ("has-a")                                   | Inheritance ("is-a")                            |
| -------------------- | ------------------------------------------------------- | ----------------------------------------------- |
| Coupling             | Loose — depends only on collaborator's public interface | Tight — subclass depends on parent internals    |
| Runtime flexibility  | ✅ Swap injected strategies/backends at runtime         | ❌ Fixed at class definition time               |
| Hierarchy complexity | Flat and modular                                        | Deep trees / diamond MRO risks                  |
| Method reuse         | Explicit delegation (`self.store.save(...)`)            | Automatic via MRO                               |
| Best suited for      | Dependency injection, plugins, services                 | True taxonomic specialization, `ABC` interfaces |

## Verdict

Favor **composition over inheritance** by default: pass dependencies (`storage`, `clock`, `logger`) into `__init__` rather than subclassing concrete classes just to reuse helper methods. Save inheritance for genuine "is-a" specialization or implementing abstract interfaces (`ABC` / `Protocol`).
