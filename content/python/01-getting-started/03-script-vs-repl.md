---
type: compare
title: "Script vs REPL: two ways to run Python"
difficulty: easy
left: "Script"
right: "REPL"
tags: [intro, running-code]
revision:
  - "A script is a `.py` file you can save and run again"
  - "The REPL runs one line at a time and forgets everything when you close it"
---

You can run Python code in two ways. The **REPL** is a prompt where you type a line and see the answer straight away:

```text
>>> 2 + 3
5
>>> print("Hi")
Hi
```

| Feature             | Script                         | REPL                             |
| ------------------- | ------------------------------ | -------------------------------- |
| What it is          | A file with many lines of code | A prompt where you type one line |
| How to start        | `python hello.py`              | Type `python` and press Enter    |
| Is your code saved? | Yes, in the file               | No, it is gone when you close it |
| Best for            | Real programs you want to keep | Quick tests and learning         |
| How to leave        | It stops by itself at the end  | Type `exit()` and press Enter    |

## Verdict

Use the **REPL** to try small ideas fast. Use a **script** when you want to keep your work and run it again later.
