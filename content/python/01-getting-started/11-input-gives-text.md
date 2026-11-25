---
type: concept
title: "input(): ask the user a question"
difficulty: easy
tags: [input, basics]
revision:
  - "`input()` shows a message and waits for the user to type"
  - "`input()` always gives you text, even if the user types digits"
---

`input()` asks the user to type something. Whatever they type comes back to your program.

```python
name = input("What is your name? ")
print("Hello,", name)
```

When someone runs it and types `Asha`, the screen shows:

```text
What is your name? Asha
Hello, Asha
```

The line `name = ...` saves the answer under the label `name`. This is called a **variable**. The next chapter explains variables in full.

Here is the most important fact about `input()`: **it always gives you text**. Even if the user types `25`, you get the text `"25"`, not the number 25. The next card shows why this matters.
