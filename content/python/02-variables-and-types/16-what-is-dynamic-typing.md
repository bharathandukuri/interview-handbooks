---
type: question
title: 'What does "dynamically typed" mean?'
difficulty: easy
mostAsked: true
tags: [interview, types, variables]
related: [python.variables-and-types.type-and-basic-types]
revision:
  - "In Python the value has a type, not the variable name"
  - "The same name can point to a different type later"
  - "Python is also strongly typed: it will not mix types silently"
---

## Answer

In Python you do **not** write down the type of a variable. The **value** has a type, and the name just points to it. So the same name can point to a different type later.

```python
x = 10        # x points to an int
x = "ten"     # now x points to text
```

This is called **dynamic typing**. Python works out the types while the program runs.

Python is also **strongly typed**. It will not quietly mix types that do not fit. For example, `"5" + 3` stops with a `TypeError`. You have to change the type yourself, like `int("5") + 3`.

## Why interviewers ask

It checks that you understand where types live in Python. A good answer says "the value has the type, not the name".

## Follow-ups

- What is the difference between dynamic and static typing?
- What happens if you run `"5" + 3`?
