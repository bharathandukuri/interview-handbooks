---
type: concept
title: "Immutability: strings never change"
difficulty: easy
mostAsked: true
tags: [strings, immutability, memory]
related: [python.strings.indexing-pick-one-letter]
revision:
  - "Strings are **immutable**: once created in memory, their characters cannot be edited in place"
  - "Changing one letter requires creating a new string via concatenation (`+`) and slicing"
  - "**Reassigning** a variable (`name = 'bat'`) points the name to a new string without editing `'cat'`"
---

In Python, strings are **immutable** — once a string object is created in memory, the characters inside it can **never** be modified, added to, or deleted.

You cannot edit a slot in place (Python forbids **item assignment** on strings like `name[0] = "b"`). Instead, you build a **new string object** using slicing and **concatenation** (`+`), or reassign the variable to point to the new object:

```python
name = "cat"
alias = name                 # both sticky notes point to "cat"
name = "b" + name[1:]        # creates brand-new "bat" and moves `name`
print(name)                  # bat
print(alias)                 # cat (untouched!)
```

The screen shows:

```text
bat
cat
```

Look closely at `alias`: because strings never mutate, moving `name` onto `"bat"` leaves `"cat"` completely safe for `alias`!

:::insight[Looking ahead]
In Chapter 6 you will meet **lists**, which are **mutable** — modifying a list through one variable _does_ change what an alias sees. Knowing whether a type is mutable or immutable is one of the most tested ideas in Python interviews.
:::
