---
type: concept
title: "Comments: notes for humans (# and # inside strings)"
difficulty: easy
tags: [comments, clean-code, basics]
revision:
  - "Anything after `#` on a line (outside quotes) is a **comment** and Python ignores it"
  - "A `#` **inside** quotes (`'Item #1'`) is normal text, NOT a comment!"
  - "Python has no `/* ... */` block comment syntax — put `#` at the start of each commented line"
---

A **comment** is a note written for human readers (including your future self 6 months later!). Python skips comments completely when running your program.

Every comment starts with the hash symbol **`#`** and stops at the end of that line:

```python
# Whole-line comment: Python ignores everything here
print("Run this")              # inline comment: code before `#` STILL runs!
# print("Switched off!")       # temporarily disabled without deleting

print("Order #402 is #1!")     # `#` INSIDE quotes is plain text, NOT a comment!
```

The screen shows:

```text
Run this
Order #402 is #1!
```

**Important details and edge cases:**

- **`#` inside strings:** Python only treats `#` as a comment when it sits **outside** string quotes. In `"Order #402"`, both `#` symbols print normally!
- **Multi-line comments:** Unlike C, Java, or JavaScript (`/* ... */`), Python has no special block-comment marker — start each commented line with `#` (most editors toggle `#` on multiple highlighted lines at once with `Ctrl+/` or `Cmd+/`). Note that standalone triple-quoted strings (`"""..."""`) _inside_ functions/files act as **docstrings** (Chapter 09), though Python still reads them as string objects unless optimized away — so always prefer `#` for regular comments!
- **Write _why_, not _what_:** Do not write `# print hi` above `print("Hi")`; use comments to explain _reasons_, business rules, or tricky edge cases (for example `# Skip tax for tax-exempt orders`).
