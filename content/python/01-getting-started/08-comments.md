---
type: concept
title: "Comments: notes for humans"
difficulty: easy
tags: [comments, basics]
revision:
  - "A comment starts with `#` and Python ignores it"
  - "Good comments explain why, not what"
---

A **comment** is a note for people who read your code. Python ignores it completely. A comment starts with `#`.

```python
# This whole line is a comment
print("Hi")   # a comment can also come after code
```

The screen shows only:

```text
Hi
```

You can also use `#` to switch a line off for a moment, without deleting it:

```python
print("This runs")
# print("This does not run")
```

:::tip[Explain the why]
A good comment says **why** you did something. It does not repeat what the code already says. Too many comments make code harder to read, not easier.
:::
