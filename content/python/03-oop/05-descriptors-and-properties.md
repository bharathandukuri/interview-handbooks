---
type: pitfall
title: "Property setter infinite recursion"
difficulty: hard
tags: [descriptors, properties, oop]
---

## The trap

```python
class Circle:
    @property
    def radius(self):
        return self.radius   # calls the getter → infinite recursion!

    @radius.setter
    def radius(self, value):
        self.radius = value  # calls the setter → infinite recursion!
```

Both the getter and setter call themselves because `self.radius` triggers descriptor lookup, which calls the property again.

## The fix

```python
class Circle:
    def __init__(self, radius: float) -> None:
        self._radius = radius   # store on the _private_ attribute

    @property
    def radius(self) -> float:
        return self._radius

    @radius.setter
    def radius(self, value: float) -> None:
        if value < 0:
            raise ValueError("Radius cannot be negative")
        self._radius = value
```

## Why it happens

A `@property` is a **descriptor** — an object on the **class** that intercepts attribute access on instances. When you write `self.radius = value` inside the setter, Python finds the property descriptor on the class and calls its `__set__`, which calls the setter again, looping forever. Storing data on a private backing attribute (`self._radius`) bypasses the descriptor. Using `__slots__` with `_radius` can further prevent accidental attribute creation.
