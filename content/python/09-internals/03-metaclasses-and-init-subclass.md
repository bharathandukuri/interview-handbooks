---
type: concept
title: "Metaclasses vs `__init_subclass__`"
difficulty: hard
tags: [metaclasses, oop, internals]
---

In Python, **classes are objects too** — and `type` is the default metaclass (the factory that builds class objects).

```python
# Every `class Foo:` executes type("Foo", bases, namespace_dict)
class PluginMeta(type):
    def __new__(mcs, name, bases, ns):
        cls = super().__new__(mcs, name, bases, ns)
        return cls
```

**Prefer `__init_subclass__` (Python 3.6+):** 95% of real-world metaclass use cases (auto-registering plugins, validating subclass attributes) don't need a metaclass at all:

```python
class Plugin:
    registry: dict[str, type["Plugin"]] = {}

    def __init_subclass__(cls, *, key: str, **kwargs: object) -> None:
        super().__init_subclass__(**kwargs)
        Plugin.registry[key] = cls

class JsonPlugin(Plugin, key="json"):
    pass
```

`__init_subclass__` avoids metaclass conflicts when mixing third-party base classes (e.g. `ABC` + custom metaclass). Reserve true metaclasses for altering `__prepare__` namespaces or intercepting class instantiation (`__call__`).
