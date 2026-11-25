---
type: concept
title: "Run your first program"
difficulty: easy
tags: [intro, setup, running-code]
revision:
  - "Check that Python is installed with `python --version`"
  - "Run a file with `python hello.py`"
---

First, check that Python is on your computer. Open a **terminal** (on Windows it is called Command Prompt or PowerShell) and type:

```bash
python --version
```

If you see something like `Python 3.12.3`, you are ready.

Now make a file called `hello.py` and put this one line in it:

```python
print("Hello, Python!")
```

Run the file from the terminal:

```bash
python hello.py
```

The terminal shows:

```text
Hello, Python!
```

:::tip[Command not found?]
On Mac and Linux, try `python3` instead of `python`. On Windows, try `py`.
:::
