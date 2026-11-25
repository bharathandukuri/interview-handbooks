---
type: question
title: "Is Python compiled or interpreted?"
difficulty: easy
mostAsked: true
tags: [interview, how-python-runs, internals]
related: [python.getting-started.script-vs-repl]
revision:
  - "Python is **both**: CPython **compiles** `.py` source automatically into **bytecode** (`__pycache__/*.pyc`), then **interprets** that bytecode on the CPython Virtual Machine"
  - "There is no separate manual build step like C/C++; everything happens seamlessly when running `python file.py`"
---

## Answer

Python is commonly described as an **interpreted language**, **but** the accurate technical answer is **both steps happen under the hood**:

1. **Compile step (automatic):** When you run `python app.py`, the standard **CPython** runtime first checks syntax and **compiles** your human-readable `.py` code into a compact intermediate format called **bytecode** (stored for imported modules inside **`__pycache__/*.pyc`** so future startups skip re-parsing).
2. **Interpret step (CPython Virtual Machine):** Python's runtime interpreter loop executes those bytecode instructions step-by-step on your CPU — without turning your script into a standalone native CPU `.exe` first!

Because compilation happens automatically inside the runtime without a separate build tool (`gcc`, `javac`), programmers enjoy the fast feedback loop of an interpreted language.

**A short answer for an interview:** Python is dynamically executed: CPython automatically compiles `.py` source code into intermediate bytecode (`.pyc`) first, and then the Python Virtual Machine interprets that bytecode instruction by instruction without needing a manual build step.

## Why interviewers ask

Beginners often think "interpreted" means Python reads raw text line-by-line during execution — which cannot explain why a `SyntaxError` on line 50 prevents line 1 from running! Mentioning the automatic `.py -> bytecode -> virtual machine` pipeline shows you understand why syntax is checked upfront _and_ why `.pyc` files speed up imports.

## Follow-ups

- **"Why does a `SyntaxError` on line 50 stop line 1 from running?"** Because CPython compiles the **entire file** into bytecode _before_ the virtual machine starts running line 1!
- **"Are there other Python implementations besides CPython?"** Yes: **PyPy** adds a JIT (Just-In-Time) compiler for faster pure-Python loops, Jython runs on the JVM, and **MicroPython** targets tiny microcontrollers.
