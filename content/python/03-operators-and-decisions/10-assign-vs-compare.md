---
type: pitfall
title: "Writing = instead of =="
difficulty: easy
mostAsked: true
tags: [operators, gotchas, syntax]
related: [python.operators-and-decisions.comparing-values]
revision:
  - "`=` is **assignment** (save a value); `==` is **equality comparison** (ask a question)"
  - "Using `=` inside an `if` condition triggers a `SyntaxError` immediately"
---

## The trap

```python
age = 18
if age = 18:
    print("Adult")
```

Python refuses to run the file and stops with:

```text
SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?
```

## The fix

```python
age = 18
if age == 18:
    print("Adult")
```

## Why it happens

In Python, `=` is an **assignment statement**, not an expression that returns `True` or `False`. Inside `if`, Python expects an expression it can test.

Unlike C or C++ (where `if (age = 18)` quietly overwrites `age` and bugs your program!), Python stops straight away with `SyntaxError` to protect you from that classic bug. Notice Python even hints at `:=` (the **walrus operator**, taught later), which is the only explicit way to assign _and_ test a value inside an expression.
