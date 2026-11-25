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
    def radius(self) -> float:
        return self.radius   # calls the getter → RecursionError!

    @radius.setter
    def radius(self, value: float) -> None:
        self.radius = value  # calls the setter → RecursionError!
```

## The fix

```python
class Circle:
    def __init__(self, radius: float) -> None:
        self.radius = radius

    @property
    def radius(self) -> float:
        return self._radius  # read private backing attribute

    @radius.setter
    def radius(self, value: float) -> None:
        if value < 0:
            raise ValueError("Radius cannot be negative")
        self._radius = value
```

## Why it happens

`@property` installs a **data descriptor** named `radius` on the class. Writing `self.radius = value` inside the setter invokes `radius.__set__` again in an infinite loop. Storing the value on a private backing attribute (`self._radius`) bypasses the descriptor.
