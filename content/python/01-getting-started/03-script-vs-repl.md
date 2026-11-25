---
type: compare
title: "Script vs REPL: two ways to run Python"
difficulty: easy
left: "Script (.py file)"
right: "REPL (Interactive prompt)"
tags: [intro, running-code, basics]
revision:
  - "A **script** saves code in a `.py` file you can edit, share, and run repeatedly"
  - "The **REPL** (**Read–Evaluate–Print Loop**) runs one command at a time and forgets everything when closed"
  - "In the REPL, bare expressions like `2 + 3` auto-print; inside a script you MUST use `print(...)` to see output!"
---

Python runs in two completely different modes: writing a **script** file (`python hello.py`) or chatting directly line-by-line inside the **REPL** (**R**ead–**E**valuate–**P**rint **L**oop).

When you type `python` (or `python3`) with **no filename**, the terminal opens the `>>>` prompt (interactive mode):

```text
>>> 2 + 3
5
>>> "Hi " * 3
'Hi Hi Hi '
>>> exit()
```

Notice an **important surprise** when moving from the REPL to a saved `.py` script:

| Feature                 | Script (`python app.py`)                | REPL (`>>>`)                                    |
| ----------------------- | --------------------------------------- | ----------------------------------------------- |
| What it is              | A saved `.py` file with many lines      | Interactive prompt running one snippet at once  |
| How `2 + 3` behaves     | Calculates silently (**shows nothing**) | Automatically prints `5` on screen!             |
| Code saved when closed? | ✅ Yes, stored safely on disk           | ❌ No, lost when you quit (`exit()` / `Ctrl+D`) |
| Multi-line indentation  | Easy to edit and move lines in editor   | Uses `...` continuation; awkward for long code  |
| Best used for           | Real programs, exercises, automation    | Quick math checks, testing how a method works   |

## Verdict

Use the **REPL** whenever you want instant answers (`"What does round(2.5) give?"` or `"2 + 3"`). Write everything you want to keep in a saved **`.py` script** — and always wrap outputs in **`print(...)`** inside scripts so values appear on the screen!
