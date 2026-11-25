---
type: concept
title: "Run your first program"
difficulty: easy
tags: [intro, setup, running-code]
revision:
  - "Verify installation in your terminal with `python --version` (`python3` on macOS/Linux, `py` on Windows)"
  - "Save code inside a `.py` file and execute it from that folder with `python hello.py`"
  - "Common early mistakes: forgetting to save the file before running, or running from the wrong folder"
---

To run a saved Python program, you use a text-based window called a **terminal** (or **shell** — PowerShell / Command Prompt on Windows, Terminal on macOS and Linux).

First, confirm Python 3 is installed:

```bash
python --version
```

If you see `Python 3.12.x` (or `3.13` / `3.14`), you are ready.

Next, create a plain text file named **`hello.py`** (`.py` is the standard extension for Python files — never use Word `.docx`, always use a plain code editor like VS Code!), type this line, and **save the file**:

```python
print("Hello, Python!")
```

In your terminal, make sure your **working directory** (current folder) matches where `hello.py` lives (`cd path/to/folder`), then run:

```bash
python hello.py
```

The terminal shows:

```text
Hello, Python!
```

**Beginner edge cases & quick troubleshooting:**

- **`'python' is not recognized` or `command not found`:** Try **`python3 --version`** on macOS/Linux, or the Windows Python Launcher **`py --version`** (`py hello.py`). On Windows installs, remember to tick **"Add python.exe to PATH"**.
- **`can't open file 'hello.py': No such file or directory`:** Your terminal is currently inside a different folder than `hello.py`! Run `pwd` (or `cd` on Windows cmd) and `ls` / `dir` to check which folder you are in, then `cd` into the right one.
- **Program shows old output after edits:** Most editors do not auto-save unless enabled — press **`Ctrl+S` / `Cmd+S`** before running `python hello.py` again!
