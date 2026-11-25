---
type: pitfall
title: "Why 0.1 + 0.2 is not 0.3"
difficulty: easy
mostAsked: true
tags: [float, gotchas, numbers]
revision:
  - "Decimals are stored in binary, so some are slightly off: `0.1 + 0.2` gives `0.30000000000000004`"
  - "Use `round(x, 2)` before you compare or show a decimal"
---

## The trap

```python
print(0.1 + 0.2)
print(0.1 + 0.2 == 0.3)
```

The screen shows `0.30000000000000004` and then `False`. That looks wrong!

## The fix

```python
print(round(0.1 + 0.2, 2))
print(round(0.1 + 0.2, 2) == 0.3)
```

The screen shows `0.3` and then `True`.

## Why it happens

Computers store decimal numbers in binary (1s and 0s). Some decimals, like 0.1, cannot be stored perfectly in binary. It is like writing 1/3 as a decimal: you get `0.3333...` and it never ends. So there is a tiny error.

This is **not** a Python bug. Almost every language does this.

`round(number, digits)` cuts the number to the digits you ask for. For money, there is a safer tool called `Decimal`. You will meet it later.
