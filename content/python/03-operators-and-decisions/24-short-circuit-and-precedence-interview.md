---
type: question
title: "How does short-circuit evaluation work in and/or?"
difficulty: medium
mostAsked: true
tags: [interview, logic, short-circuit, operators]
related:
  [
    python.operators-and-decisions.and-or-not,
    python.operators-and-decisions.short-circuit-values,
  ]
revision:
  - "Python stops checking `and` / `or` as soon as the left side guarantees the final result"
  - "Both `and` and `or` return the **last evaluated operand**, not always a `bool`"
---

## Answer

**Short-circuit evaluation** means Python evaluates logical expressions left to right and stops the moment the overall answer cannot change:

- For **`A and B`**: if `A` is falsy, Python returns `A` immediately and **never evaluates `B`**. If `A` is truthy, Python returns `B`.
- For **`A or B`**: if `A` is truthy, Python returns `A` immediately and **never evaluates `B`**. If `A` is falsy, Python returns `B`.

```python
# 1. Guarding against ZeroDivisionError:
b = 0
print(b != 0 and 10 / b > 2)    # prints False safely; 10 / 0 never runs!

# 2. Fallback default value:
raw_name = ""
display = raw_name or "Guest"    # "Guest"
```

A short answer for an interview: "Python short-circuits `and` and `or` left to right and returns the deciding operand itself, not necessarily `True` or `False`. We use this to put safety checks first and provide fallback values cleanly."

## Why interviewers ask

It tests whether you understand how `and`/`or` protect against crashes (`ZeroDivisionError`, `None` checks) and why `display = raw_name or "Guest"` can be dangerous if `0` or `""` is a legitimate value!

## Follow-ups

- What does `0 or 5 and 8` return, and why?
- When is `count = user_count or 10` a bug?
