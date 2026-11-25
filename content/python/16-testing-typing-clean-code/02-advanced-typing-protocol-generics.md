---
type: concept
title: "Advanced typing: Protocol, PEP 695 generics, Literal, Self, and variance"
difficulty: hard
mostAsked: true
tags: [typing, protocol, generics, python312]
related:
  [
    python.testing-typing-clean-code.type-hints-basics-and-unions,
    python.oop.duck-typing-and-abc,
  ]
revision:
  - "**`typing.Protocol`** checks **structural duck typing** statically — classes do not need to inherit from the Protocol"
  - "Python 3.12+ (**PEP 695**) simplifies generics (`def first[T](xs: list[T]) -> T:`) and type aliases (`type UserId = int`)"
  - "Accept read-only **`Sequence[T]`** (covariant) or `Mapping` in parameters instead of invariant `list[T]` / `dict[K, V]`"
---

Modern Python 3.12+ solves three classic typing pain points cleanly: duck-typed interfaces without inheritance (`Protocol`), concise generic syntax (PEP 695), and variance-safe collection inputs!

```python
from collections.abc import Sequence
from typing import Literal, Protocol, Self, TypedDict

# 1. Protocol: ANY class with `.render() -> str` matches statically (no inheritance needed!)
class Renderable(Protocol):
    def render(self) -> str: ...

class Badge:
    def render(self) -> str:
        return "[PRO]"

# 2. PEP 695 clean generic function + `type` alias (Python 3.12+!)
type NonEmptyPair[T] = tuple[T, T]

def first_item[T](items: Sequence[T]) -> T | None:
    return items[0] if items else None

# 3. Fluent builder with `Self` + exact allowed choices via `Literal`
class Query:
    def __init__(self, sort_dir: Literal["asc", "desc"] = "asc"):
        self.sort_dir = sort_dir

    def reverse(self) -> Self:
        self.sort_dir = "desc" if self.sort_dir == "asc" else "asc"
        return self

def show(widget: Renderable) -> str:
    return widget.render()

print(show(Badge()), "| first:", first_item([10, 20]), "| sort:", Query().reverse().sort_dir)
```

The screen shows:

```text
[PRO] | first: 10 | sort: desc
```

**Why variance matters (`Sequence[Animal]` vs `list[Animal]`):**
Suppose `Dog` inherits from `Animal`. Can you pass a `list[Dog]` into `def count_animals(xs: list[Animal]):`? Type checkers say **NO (`list` is invariant)** — because if `count_animals` ran `xs.append(Cat())`, your `list[Dog]` would suddenly contain a `Cat`! Instead, type read-only function inputs as **`Sequence[Animal]`** or **`Iterable[Animal]`** (read-only types are **covariant** and accept `list[Dog]` safely!) while returning concrete `list[Dog]`.

_(Also know `@overload` for functions whose return type depends cleanly on inputs, `TypedDict` for typed JSON dict shapes, and `Final` for constants that must not be reassigned!)_
