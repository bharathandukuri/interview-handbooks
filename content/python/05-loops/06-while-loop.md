---
type: concept
title: "while loops: repeating until a condition turns False"
difficulty: easy
tags: [loops, while, control-flow]
related: [python.operators-and-decisions.if-and-else]
revision:
  - "A `while` loop tests its **loop condition** *before* every turn and repeats while it stays `True`"
  - "If the condition starts out `False`, the body runs **0 times**"
  - "Ideal for **input validation loops** and **sentinel loops** when you do not know how many turns it will take"
---

Use a **`while` loop** when you do **not** know ahead of time how many turns are needed. Python checks the **loop condition** before every turn — if it is `True`, the loop body runs; if it is `False`, Python exits the loop.

```python
tries = 3

while tries > 0:
    print(f"{tries} tries left")
    tries -= 1

print("Done!")
```

The screen shows:

```text
3 tries left
2 tries left
1 tries left
Done!
```

**When `while` shines — sentinel and validation loops:**

```python
# Keep asking until the user enters non-empty text (validation loop)
name = ""
while not name:
    name = input("Enter your name: ").strip()
```

**Edge case — condition false at the start:** Unlike `do...while` in C/Java, Python has **no** loop that runs first and checks later. If `tries = 0` from the start, `while tries > 0:` evaluates `False` immediately and runs **0 times**, jumping straight to `print("Done!")`.
