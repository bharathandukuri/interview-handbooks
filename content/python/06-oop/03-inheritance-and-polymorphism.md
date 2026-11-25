---
type: concept
title: "Inheritance, duck typing, and `abc.ABC`"
difficulty: easy
tags: [oop, inheritance, abc]
---

Inheritance lets a subclass reuse and specialize a parent class. Use `isinstance(obj, Base)` and `issubclass(Sub, Base)` for runtime type checks.

```python
from abc import ABC, abstractmethod

class Storage(ABC):
    @abstractmethod
    def save(self, key: str, data: bytes) -> None: ...

class S3Storage(Storage):
    def save(self, key: str, data: bytes) -> None:
        print(f"Uploaded {len(data)} bytes to {key}")
```

Attempting to instantiate `Storage()` or a subclass that forgets to implement `save()` raises `TypeError` immediately at instantiation time.

**Duck typing:** Pythonic code often skips inheritance altogether — _"if it walks like a duck and quacks like a duck..."_. Any object with a `.read()` method works wherever a file-like object is expected, regardless of its base class (which `typing.Protocol` formalizes statically).
