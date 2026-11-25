---
type: concept
title: "Duck typing vs Abstract Base Classes (abc.ABC)"
difficulty: medium
mostAsked: true
tags: [oop, polymorphism, abc, duck-typing]
related:
  [python.oop.inheritance-and-super, python.oop.composition-vs-inheritance]
revision:
  - "**Duck typing:** 'If it walks like a duck and has `.speak()`, treat it like one' — Python cares about **behavior**, not strict inheritance"
  - "Use **`abc.ABC`** and **`@abstractmethod`** when a shared interface MUST enforce required methods **before** creating instances"
---

How do you write functions that accept multiple different object types cleanly? Python gives you **two** complementary approaches:

**1. Duck typing (Python's default):**
You do not require two classes to share a parent class at all — as long as an object provides the needed method (e.g., `.serialize()` or `.read()`), it works!

**2. Abstract Base Classes (`abc.ABC`):**
In large teams or plugin architectures, you often want a hard contract: if someone forgets to implement `.area()` on a new `Shape` subclass, Python refuses to even instantiate it (`TypeError`) instead of failing later in production!

```python
from abc import ABC, abstractmethod

class Exporter(ABC):
    @abstractmethod
    def export(self, data):
        """Convert data dict into output text."""

class JsonExporter(Exporter):
    def export(self, data):
        return f"{data!r}"

def run_export(exporter, data):      # works with JsonExporter OR any duck-typed object with .export()!
    return exporter.export(data)

print(run_export(JsonExporter(), {"ok": True}))

try:
    Exporter()                       # abstract base class cannot be instantiated directly!
except TypeError as err:
    print("Blocked:", err)
```

The screen shows:

```text
{'ok': True}
Blocked: Can't instantiate abstract class Exporter without an implementation for abstract method 'export'
```

**When to choose each (plus `Protocol` preview):**

- Choose **duck typing** for small utilities and standard Python interfaces (anything iterable works in `for x in obj:`, any file-like object with `.write()` works with `json.dump()`).
- Choose **`abc.ABC`** when defining explicit plugin/framework base classes that require concrete subclasses to implement specific methods (and you can combine `@abstractmethod` with shared concrete helper methods inside the `ABC`!).
- Later in Chapter 16, you will also meet **`typing.Protocol`** — static **structural subtyping** (duck typing checked by tools like `mypy`/`pyright` _before_ running the code, without forcing runtime inheritance!).
