---
type: predict
title: "What happens to b when you reassign a? (b = a)"
difficulty: easy
mostAsked: true
tags: [variables, references, trace]
related: [python.variables-and-types.what-is-a-variable]
revision:
  - "Variables point directly to **value objects**, NOT to other variables!"
  - "After `b = a`, reassigning `a = 20` moves ONLY `a`'s sticky note — `b` still points to the old value `10`"
options:
  - "20 10"
  - "20 20"
  - "10 10"
  - "10 20"
answer: 0
---

Suppose you set `b = a` and later change `a`. Does `b` automatically change too? Trace the output carefully:

```python
a = 10
b = a
a = 20
print(a, b)
```

## Output

```text
20 10
```

## Explanation

This tests Python's core **label-to-object** model:

1. `a = 10` attaches label `a` to the integer object **`10`**.
2. `b = a` looks up what `a` currently points to (`10`) and sticks label `b` directly onto **`10`** too! Notice `b` points to the _value_ `10`, **not** to the variable `a`!
3. `a = 20` peels label `a` off `10` and sticks `a` onto the brand-new value **`20`**. Meanwhile, `b` was never touched and stays stuck to `10`!

So `print(a, b)` outputs **`20 10`**. _(Later in Chapter 06, you will see what happens instead when `a` points to a changeable `list` and you modify items inside that shared list!)_
