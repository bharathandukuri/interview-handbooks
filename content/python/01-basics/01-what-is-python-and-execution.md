---
type: concept
title: "What is Python? Execution, REPL, and basic I/O"
difficulty: easy
tags: [basics, execution, repl]
revision:
  - "CPython compiles `.py` source into bytecode (`.pyc`) and runs it on the Python Virtual Machine"
  - 'Use 4-space indentation for blocks and `if __name__ == "__main__":` for script entry points'
---

Python is a high-level, dynamically typed language. When you run a `.py` file, CPython compiles your source into **bytecode** (`.pyc`) and executes it on the **Python Virtual Machine (PVM)**.

**Running Python:**

- **REPL:** Run `python` (or `python3`) in your terminal to test expressions interactively.
- **Script:** Save code in `hello.py` and run `python hello.py`.

```python
# Comments start with `#` — ignored by Python
name = input("Your name: ")           # reads a string from stdin
print("Hello", name, sep=", ", end="!\n")
```

**Three rules from Day 1:**

1. **Indentation defines blocks** — use 4 spaces (never mix tabs and spaces). No `{}` braces or semicolons.
2. **Case-sensitive** — `Name` and `name` are different identifiers.
3. **PEP 8 naming** — `snake_case` for variables and functions, `PascalCase` for classes, `UPPER_CASE` for constants.

:::tip[Quick script entry point]
Use `if __name__ == "__main__":` at the bottom of scripts so importing the file in tests doesn't auto-run top-level code.
:::
