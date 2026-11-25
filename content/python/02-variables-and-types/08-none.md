---
type: concept
title: "None: no value"
difficulty: easy
tags: [none, basics]
revision:
  - "`None` means there is no value here"
  - "`None` is not the same as `0` or an empty string"
---

`None` is a special value that means **"nothing is here"**.

```python
result = None
print(result)
print(type(result))
```

The screen shows:

```text
None
<class 'NoneType'>
```

Use `None` when a variable exists, but you do not have a real value for it yet. Think of an empty seat in a cinema. The seat is there, but nobody is sitting in it.

`None` is **not** the same as `0` or `""` (empty text). Zero is a real number, and empty text is a real string. `None` means no value at all.

:::tip[You will meet it again]
Functions that do not give anything back also give back `None`. You will see this in the Functions chapter.
:::
