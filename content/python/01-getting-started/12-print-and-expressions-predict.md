---
type: predict
title: "What does this print? (# in quotes, bare math, and single-item sep)"
difficulty: easy
tags: [print, comments, sep, trace]
related:
  [
    python.getting-started.comments,
    python.getting-started.sep-and-end,
    python.getting-started.script-vs-repl,
  ]
options:
  - "Item #1\n3 1 + 2\nX"
  - "Item \n3 3\nX-"
  - "Item #1\n5\n3 1 + 2\nX-"
  - "Item #1\n3 3\nX"
answer: 0
---

Look closely at quotes, comments, and `sep` in a saved script before choosing:

```python
print("Item #1")
2 + 3
print(1 + 2, "1 + 2")
print("X", sep="-")
```

## Output

```text
Item #1
3 1 + 2
X
```

## Explanation

Each line tests one subtle beginner rule:

1. **`print("Item #1")`:** Because `#` is **inside quotes**, it is plain text, NOT a comment — so **`Item #1`** prints completely.
2. **`2 + 3`:** Inside a `.py` script (unlike the interactive REPL), Python calculates `5` silently and shows **nothing** because there is no `print(...)`!
3. **`print(1 + 2, "1 + 2")`:** The first argument is real maths (`3`), while `"1 + 2"` in quotes is literal text (`1 + 2`). Separated by a default space, Python prints **`3 1 + 2`**.
4. **`print("X", sep="-")`:** Since `sep` only sits **between** two or more items, a single argument prints plain **`X`** with no dash!
