---
type: concept
title: "Text (str): join, repeat and count"
difficulty: easy
tags: [strings, text, basics]
revision:
  - "Text is called a `str`, and it lives inside quotes"
  - "`+` joins text, `*` repeats it, `len()` counts the characters"
---

Text is called a **string**, or `str` for short. It always lives inside quotes.

```python
first = "Ada"
last = "Lovelace"
full = first + " " + last
print(full)
print(len(full))
print("ha" * 3)
```

The screen shows:

```text
Ada Lovelace
12
hahaha
```

- `+` **joins** pieces of text together.
- `len()` tells you how many characters there are. The space counts too.
- `*` **repeats** text.

Text has a lot more tricks. The Strings chapter covers them.

:::tip[Text and numbers do not mix]
`"Age: " + 20` is an error, because you cannot join text and a number. Two cards from now you will see how to fix it.
:::
