---
type: predict
title: "What does this print?"
difficulty: easy
tags: [print, sep, end]
related: [python.getting-started.sep-and-end]
options:
  - "A B C, then Go, then Done (3 lines)"
  - "A-B-C, then Go!Done (2 lines)"
  - "A-B-C, then Go!, then Done (3 lines)"
  - "It shows an error"
answer: 1
---

Read the code and guess what the screen shows. Try to work it out before you look at the answer.

```python
print("A", "B", "C", sep="-")
print("Go", end="!")
print("Done")
```

## Output

```text
A-B-C
Go!Done
```

## Explanation

The first `print()` puts `-` between the items, so you get `A-B-C`. Then it moves to a new line.

The second `print()` uses `end="!"`. So it adds `!` and does **not** move to a new line.

The third `print()` starts right where the second one stopped, so `Done` appears straight after `Go!`.
