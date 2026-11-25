---
type: question
title: "OOP deep dive: __new__ vs __init__, MRO, dunder contracts, and dataclasses"
difficulty: medium
mostAsked: true
tags: [oop, mro, dunder, dataclasses, interviews]
related:
  [
    python.oop.classes-objects-self-and-init,
    python.oop.mro-and-multiple-inheritance,
    python.oop.dunder-methods-and-hashability,
    python.oop.dataclasses-and-enums,
  ]
revision:
  - "`__new__` constructs and returns the object; `__init__` initializes its state and returns `None`"
  - "Python resolves multiple inheritance with **C3 Linearization** (`__mro__`) and cooperative **`super()`**"
  - "Defining `__eq__` sets **`__hash__ = None`** unless `__hash__` is implemented too; prefer composition over deep inheritance"
---

## Answer

Core Python OOP interview questions revolve around Python's object lifecycle and protocol contracts:

1. **`__new__` vs `__init__` and `self`:**
   - `__new__(cls, ...)` allocates and returns the instance (rarely customized except for immutable subclasses like `str`/`int` or singletons); `__init__(self, ...)` receives the already-created instance (`self`) and sets its attributes. Calling `obj.method(x)` translates directly to `Class.method(obj, x)`.
2. **Class vs instance attributes & `@classmethod`/`@staticmethod`:**
   - Attributes in the `class` body live on the class and are shared by every instance — never initialize mutable containers like `[]` or `{}` at class scope. `@classmethod` receives `cls` (respecting subclasses in alternate constructors), whereas `@staticmethod` takes neither `self` nor `cls`.
3. **MRO and `super()`:**
   - Multiple inheritance uses **C3 Linearization** (`Class.__mro__`) so children come before parents and base order is respected without running shared diamond ancestors twice. `super()` forwards to the **next class in the dynamic instance's MRO**, not necessarily the direct lexical parent.
4. **Dunder contracts & `@dataclass`:**
   - `__repr__` targets developers (and acts as `str()`'s fallback); returning `NotImplemented` in `__eq__` / `__add__` lets Python try the reflected operator (`__radd__`). Custom `__eq__` sets `__hash__ = None` to keep `set`/`dict` invariants safe. `@dataclass(frozen=True, slots=True)` eliminates boilerplate cleanly — always use `field(default_factory=list)` for mutable defaults.

**A short answer for an interview:** `__new__` creates the instance and `__init__` initializes it; `super()` traverses C3 MRO dynamically across subclasses; custom `__eq__` disables hashing unless `__hash__` matches equal values; and `@dataclass` (with `default_factory`) plus composition keep object hierarchies clean and bug-free.

## Why interviewers ask

OOP in Python looks familiar on the surface, **but** shared mutable class attributes, diamond `super()` chains, `@property` setter recursion, and unhashable `__eq__` objects trip up developers coming from Java or C++ all the time.

## Follow-ups

- **"Why does defining `__eq__` automatically make a class unhashable (`TypeError`)?"** Because sets and dict keys require the hash invariant (`a == b => hash(a) == hash(b)`). Python's default `object.__hash__` hashes memory identity (`id`), which would violate that invariant once value-based `__eq__` is introduced — so Python disables hashing until you provide a matching `__hash__`.
- **"When would you choose composition over inheritance?"** Whenever relationship semantics are `"has-a"` rather than strictly `"is-a"`, when behaviors must be swapped/mocked independently in tests, or whenever inheritance would deepen past 2 levels.
