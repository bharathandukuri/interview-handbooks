---
type: concept
title: "input(): ask the user a question and read text"
difficulty: easy
tags: [input, strings, basics]
revision:
  - "`input(prompt)` prints `prompt`, pauses for the user to press Enter, and returns what they typed"
  - "`input()` **always** returns text (`str`) — even if the user types digits (`25` -> `'25'`) or presses Enter immediately (`''`)"
  - "Put a trailing space inside the prompt string (`'Name: '`) so the user's typing does not touch your question"
---

Programs become interactive when they read keyboard input from the user. **`input()`** displays an optional prompt message, pauses until the user presses **Enter**, and hands back whatever they typed (without the trailing Enter newline).

```python
name = input("What is your name? ")
print("Hello,", name)
```

When someone runs that script and types `Asha` then Enter, the screen shows:

```text
What is your name? Asha
Hello, Asha
```

Look closely at three details and edge cases every beginner should know:

1. **Leave a space at the end of your prompt:** Writing `input("Name: ")` leaves a clean gap before the user types (`Name: Asha`), whereas `input("Name:")` jams them together (`Name:Asha`).
2. **Pressing Enter with nothing typed gives `""` (empty text):** If the user hits Enter right away, `input()` returns an empty string `""` (NOT `None` and NOT an error). Leading/trailing spaces typed by mistake (`"  Asha  "`) also stay inside the text until you clean them (using `.strip()` in Chapter 04).
3. **`input()` ALWAYS returns text (`str`):** Even if someone types `25`, Python gives your program the characters `"25"`, **not** the number `25`. The next card shows the classic bug that happens if you try to do math on `input()` directly!
