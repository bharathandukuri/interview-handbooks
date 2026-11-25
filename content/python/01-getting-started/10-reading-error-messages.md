---
type: concept
title: "Reading error messages"
difficulty: easy
tags: [errors, debugging, basics]
revision:
  - "Read the last line of an error first: it says what went wrong"
  - "The line number tells you where to look"
---

Errors happen to everyone, even experts. An error message is Python telling you what to fix. Do not be afraid of it.

```python
print(greeting)
```

```text
Traceback (most recent call last):
  File "hello.py", line 1, in <module>
    print(greeting)
NameError: name 'greeting' is not defined
```

Read it in this order:

1. **Last line first.** `NameError: name 'greeting' is not defined` says what went wrong.
2. **Then the line number.** `line 1` tells you where to look.
3. Fix it, save, and run again.

Here we never made anything called `greeting`, so Python does not know it.

| Error              | What it usually means                          |
| ------------------ | ---------------------------------------------- |
| `SyntaxError`      | You broke a grammar rule, like a missing quote |
| `NameError`        | You used a name Python does not know (a typo?) |
| `IndentationError` | The spaces at the start of a line are wrong    |
| `TypeError`        | You mixed things that do not fit together      |

:::tip[Your message may look a little different]
Your computer will show the full path to your file, and newer Python versions add small arrows (`^^^^`) under the problem. The last line is the part to read.
:::
