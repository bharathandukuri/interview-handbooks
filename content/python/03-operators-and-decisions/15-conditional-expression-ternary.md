---
type: concept
title: "Conditional expressions (ternary): a if cond else b"
difficulty: easy
tags: [decisions, ternary, operators, syntax]
related:
  [
    python.operators-and-decisions.if-and-else,
    python.operators-and-decisions.operator-precedence,
  ]
revision:
  - "A **conditional expression** (**ternary operator**) picks between two values on one line: `x if cond else y`"
  - "Only the winning branch runs (**lazy**), and both `if` and `else` are required"
  - "Ternary expressions associate **right to left** (`a if c1 else b if c2 else d`)"
---

When an `if / else` only chooses between two values to save or print, Python lets you write it as one expression called a **conditional expression** (often called the **ternary operator** because it has **three operands**):

```text
value_when_true  if  condition  else  value_when_false
```

```python
age = 20
status = "Adult" if age >= 18 else "Minor"
print(status)

a, b = 12, 5
bigger = a if a > b else b
print("Max is:", bigger)

divisor = 0
safe = 0 if divisor == 0 else 100 / divisor
print(safe)
```

The screen shows:

```text
Adult
Max is: 12
0
```

Look closely at how this works and its key **edge cases**:

- **Lazy evaluation:** Python evaluates `condition` **first**, then computes **only** the winning branch. That is why `0 if divisor == 0 else 100 / divisor` stays safe when `divisor` is `0` — `100 / 0` never runs!
- **`else` is mandatory:** Writing `x = 1 if ok` without `else` raises `SyntaxError`, because every expression must evaluate to some value.
- **Right-associativity & readability:** Chaining (`"A" if s >= 90 else "B" if s >= 80 else "C"`) groups right to left, though a multi-line `if / elif / else` is much clearer when you have 3 or more cases.
