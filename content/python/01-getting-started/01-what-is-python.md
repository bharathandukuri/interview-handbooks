---
type: concept
title: "What is Python?"
difficulty: easy
tags: [intro, basics]
revision:
  - "Python is a high-level **programming language** designed to be readable like plain English"
  - "A **program** is an ordered list of **statements** (steps) Python executes from top to bottom"
  - "Modern Python is **Python 3** (3.12+); Python 2 was retired in 2020"
---

A computer processor only natively understands raw binary instructions (`0`s and `1`s called **machine code**). A **programming language** lets humans write instructions using readable words and symbols instead — and **Python** is famous for looking closer to plain English than almost any other language.

When you write a Python file, you write a sequence of **statements** (single instructions). All those instructions saved together form a **program**, and Python runs them **from top to bottom, one line after another**:

```python
print("Step 1: Start")
print("Step 2: Work")
print("Step 3: Finish")
```

The screen shows:

```text
Step 1: Start
Step 2: Work
Step 3: Finish
```

**Why Python is used everywhere (from beginners to production systems):**

- **Clean grammar (**syntax**):** Every language has grammar rules called **syntax**. Python skips noisy semicolons `;` and curly braces `{ }` so you focus on solving the problem.
- **Massive ecosystem:** Engineers use Python for web backends (Django, FastAPI), automation scripts, data science, and AI/machine learning — using built-in tools (**standard library**) plus third-party packages.
- **Cross-platform:** The same `.py` code runs on Windows, macOS, and Linux.
- **Python 3 vs Python 2 note:** Always use **Python 3** (3.12+ today). Old tutorials with `print "Hello"` (no parentheses) are from retired Python 2 and fail with `SyntaxError` in modern Python.

:::tip[You do not need advanced maths to start]
Programming is mostly breaking one big goal into tiny, clear steps. You will learn each step in order from scratch.
:::
