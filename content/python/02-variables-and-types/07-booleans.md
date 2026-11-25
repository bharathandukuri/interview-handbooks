---
type: concept
title: "Booleans: True and False"
difficulty: easy
tags: [booleans, basics]
revision:
  - "A `bool` is either `True` or `False`, with a capital first letter"
  - "`=` saves a value, `==` asks if two values are equal"
---

A **boolean** (or `bool`) has only two possible values: `True` and `False`. Use it for yes-or-no answers.

```python
is_student = True
has_pet = False
print(is_student)
print(5 > 3)
print(5 == 3)
```

The screen shows:

```text
True
True
False
```

Comparing two things gives you a boolean. `5 > 3` asks "is 5 bigger than 3?", and the answer is `True`.

Be careful with the equals signs:

- One `=` **saves** a value.
- Two `==` **ask** "are these equal?".

:::tip[Capital letters]
Write `True` and `False` with a capital first letter. If you write `true`, Python gives a `NameError`.
:::
