---
type: concept
title: "`typing.Protocol` and structural subtyping"
difficulty: medium
mostAsked: true
tags: [typing, protocol, duck-typing]
revision:
  - "`Protocol` enables static duck typing — classes match by shape without inheriting from it"
  - "Add `@runtime_checkable` if you need `isinstance(obj, MyProtocol)` at runtime"
---

`typing.Protocol` brings Python's **duck typing** to static type checkers: any class with matching methods/attributes satisfies the protocol without inheriting from it.

```python
from typing import Protocol, runtime_checkable

@runtime_checkable
class Closable(Protocol):
    def close(self) -> None: ...

def shutdown(resource: Closable) -> None:
    resource.close()

class Socket:                   # does NOT inherit from Closable!
    def close(self) -> None:
        print("closed")

shutdown(Socket())              # valid statically AND isinstance(Socket(), Closable) == True
```

This decouples third-party classes from your interfaces: you can define a `Protocol` for someone else's library type without modifying their source code or writing adapter wrappers.
