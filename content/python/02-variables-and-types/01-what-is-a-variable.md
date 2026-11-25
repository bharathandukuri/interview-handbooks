---
type: concept
title: "Variables: labels pointing to values in memory"
difficulty: easy
tags: [variables, assignment, basics]
revision:
  - "A **variable** is a name (label) attached to a value — think of a sticky note pointing to an object, not a fixed box"
  - "`=` is the **assignment operator** (binds the value on the right to the name on the left), NOT maths equality"
  - "Python always evaluates the **right-hand expression first**, then points the left-hand name at that result"
---

A **variable** gives a memorable name to a value so your program can store, reuse, and update information.

Think of a variable in Python as a **sticky note (label)** stuck onto an object floating in your computer's memory — rather than a locked wooden box permanently sized for one kind of data:

```python
age = 20
city = "Pune"
next_year = age + 1              # evaluates right side (21), then binds `next_year`

print(age, city)
print("Next year:", next_year)
```

The screen shows:

```text
20 Pune
Next year: 21
```

**Important mechanics and beginner edge cases:**

- **Right side runs first, name goes on the left:** In maths, `x = 20` and `20 = x` look equivalent. In Python, `=` is the **assignment operator** ("bind the name on the left to the result on the right"). Writing `20 = age` fails immediately with `SyntaxError: cannot assign to literal`!
- **Reading before defining fails (`NameError`):** You must create a variable with `=` before using it (`print(salary)` before defining `salary = ...` raises **`NameError`**).
- **Reassigning moves only that sticky note:** If `a = 10; b = a` and later you write `a = 99`, `a`'s sticky note moves to `99`, while `b` still points cleanly to `10`! (Two cards ahead shows a trace of this exact rule!)
