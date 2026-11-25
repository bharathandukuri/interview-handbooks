---
type: concept
title: "type(): what kind of value is this?"
difficulty: easy
tags: [types, basics]
revision:
  - "`type(x)` tells you what kind of value `x` holds"
  - "The basic types are `int`, `float`, `str`, `bool` and `NoneType`"
---

Every value in Python has a **type**. The `type()` function tells you what it is.

```python
print(type(42))
print(type("hi"))
```

The screen shows:

```text
<class 'int'>
<class 'str'>
```

Read `<class 'int'>` as "this is an int".

Here are the five basic types you know so far:

| Type       | Example   | What it holds                |
| ---------- | --------- | ---------------------------- |
| `int`      | `42`      | Whole numbers                |
| `float`    | `3.14`    | Numbers with a decimal point |
| `str`      | `"hello"` | Text                         |
| `bool`     | `True`    | Yes or no                    |
| `NoneType` | `None`    | No value                     |

:::tip[Quotes make it text]
`7` is an `int`, but `"7"` is a `str`. The quotes are what change the type.
:::
