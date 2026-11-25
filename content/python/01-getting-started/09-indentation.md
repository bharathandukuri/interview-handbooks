---
type: concept
title: "Indentation: spaces at the start of a line"
difficulty: easy
tags: [indentation, basics, errors]
revision:
  - "Indentation means spaces at the start of a line, and in Python it has meaning"
  - "Use 4 spaces, and do not mix tabs and spaces"
---

**Indentation** means the spaces at the start of a line. In many languages it is just for looks. In Python it has **meaning**: it shows which lines belong together.

Right now, all your lines should start at the very left edge. If you add spaces by mistake, Python complains:

```python
print("Hello")
    print("World")
```

```text
  File "hello.py", line 2
    print("World")
IndentationError: unexpected indent
```

The extra spaces on line 2 are not allowed here, so nothing runs.

You will start to **use** indentation on purpose in the next chapters, with `if` and loops. The rules to remember now:

1. Use **4 spaces** for each level.
2. Never mix tabs and spaces in the same file.

:::insight[Why Python does this]
Other languages use curly brackets `{ }` to group lines. Python uses indentation instead. It forces everyone to write tidy code.
:::
