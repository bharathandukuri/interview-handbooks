---
type: concept
title: "Encapsulation, name mangling, and @property"
difficulty: medium
mostAsked: true
tags: [oop, property, encapsulation, pythonic]
related:
  [python.oop.classes-objects-self-and-init, python.oop.bank-account-problem]
revision:
  - "`_name` is a **convention** meaning internal ('handle with care'); `__name` triggers **name mangling** (`_Class__name`)"
  - "`@property` turns methods into attribute access (`obj.price`) and pairs with `@price.setter` for validation"
  - "Store the backing value in `self._price` inside the property — writing `self.price = ...` inside the setter causes infinite **`RecursionError`**!"
---

In Java or C++, you write verbose `getPrice()` and `setPrice()` methods from day one because making a field public locks you out of adding validation later. In Python, you start with simple attributes like `item.price` — and whenever you need validation or computed values later, **`@property`** lets you upgrade seamlessly without breaking a single caller!

**1. Visibility conventions in Python (`_` vs `__`):**
Python has no rigid `private` compiler wall ("we are all consenting adults"):

- **`_internal`** (single underscore): signals "internal helper/attribute — please use the public API instead."
- **`__secret`** (double leading underscore, no trailing `__`): Python rewrites (**name-mangles**) it to **`_ClassName__secret`** so subclasses cannot accidentally overwrite it! It prevents naming collisions, not determined inspection (`obj._ClassName__secret` still reads it).

**2. Validated & computed attributes with `@property`:**

```python
class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price                # calls @price.setter automatically on init!

    @property
    def price(self):
        return self._price

    @price.setter
    def price(self, value):
        if value < 0:
            raise ValueError("price cannot be negative")
        self._price = round(value, 2)     # MUST store in `_price`, NOT `self.price`!

    @property
    def cents(self):                      # read-only computed property (no setter!)
        return int(round(self._price * 100))

item = Product("Book", 19.995)
print("price:", item.price, "| cents:", item.cents)
item.price = 12.5
print("updated:", item.price)
```

The screen shows:

```text
price: 20.0 | cents: 2000
updated: 12.5
```

**Two critical `@property` rules & edge cases:**

- **Setter recursion trap:** Inside `@price.setter`, always assign to **`self._price`**. Writing `self.price = round(value, 2)` calls `@price.setter` again, looping infinitely until **`RecursionError`**!
- **Read-only properties:** If you define `@property` (`cents`) _without_ a `.setter`, attempting `item.cents = 500` raises **`AttributeError: property 'cents' of 'Product' object has no setter`**. And because `__init__` sets `self.price = price`, even initial construction validates negative prices!
