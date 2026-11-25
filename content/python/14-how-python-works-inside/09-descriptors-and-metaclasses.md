---
type: concept
title: "Descriptors, __init_subclass__, and how classes themselves are objects"
difficulty: hard
tags: [internals, descriptors, metaclasses, oop]
related:
  [python.oop.encapsulation-and-properties, python.oop.inheritance-and-super]
---

Ever wondered how `@property`, `@classmethod`, and normal instance methods (`ada.speak()`) all customize what `obj.attr` does? Under the hood, all three are built on Python's **descriptor protocol**!

**1. Descriptors (`__get__`, `__set__`, `__set_name__`):**
Any class attribute object that implements **`__get__`** (plus optionally **`__set__`**) intercepts attribute reads and writes across every instance — perfect for reusable field validators without repeating `@property` boilerplate 10 times!

**2. Classes are objects too (`type` & `__init_subclass__`):**
Every `class` statement runs code and creates a real object whose own type is **`type`**. When frameworks need to validate or register subclasses automatically, modern Python uses **`__init_subclass__`** cleanly — avoiding full custom metaclasses (`class Meta(type):`) unless deeply rewriting class construction itself:

```python
class PositiveNumber:
    def __set_name__(self, owner, name):
        self.private_name = "_" + name

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self                     # reading Class.attr returns descriptor itself!
        return getattr(obj, self.private_name)

    def __set__(self, obj, value):
        if value <= 0:
            raise ValueError(f"{self.private_name[1:]} must be > 0")
        setattr(obj, self.private_name, value)

class PluginBase:
    registry = {}
    def __init_subclass__(cls, plugin_name=None, **kwargs):
        super().__init_subclass__(**kwargs)
        if plugin_name:
            PluginBase.registry[plugin_name] = cls

class Order(PluginBase, plugin_name="order"):
    qty = PositiveNumber()
    price = PositiveNumber()
    def __init__(self, qty, price):
        self.qty = qty
        self.price = price

o = Order(3, 19.5)
print("qty:", o.qty, "| price:", o.price)
print("type of Order class:", type(Order).__name__, "| plugins:", list(PluginBase.registry))
```

The screen shows:

```text
qty: 3 | price: 19.5
type of Order class: type | plugins: ['order']
```

**Important subtleties to remember:**

- **Data vs non-data descriptors:** A descriptor defining `__set__` (like `PositiveNumber` or `@property`) is a **data descriptor** — Python checks it _before_ `obj.__dict__`! A descriptor with only `__get__` (like regular functions/methods) is a **non-data descriptor** and loses to `obj.__dict__` if an instance attribute has the same name.
- **`__init_subclass__` vs Metaclasses:** Always prefer `__init_subclass__` or a class decorator for validation and subclass registration; reserve `class Meta(type):` only for low-level framework magic.
