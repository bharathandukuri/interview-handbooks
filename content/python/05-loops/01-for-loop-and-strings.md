---
type: concept
title: "for loops: iterating over text one character at a time"
difficulty: easy
tags: [loops, for, strings, iteration]
revision:
  - "**Iteration** means repeating the **loop body** once per item inside an **iterable**"
  - "In `for letter in word:`, `letter` is the **loop variable** holding one character per turn"
  - 'Iterating over an empty string `""` skips the loop body safely without raising an error'
---

Instead of copying and pasting the same code over and over, a **loop** lets Python repeat a block of lines automatically.

In Python, a string (`str`) is an **iterable** — an object you can step through one item (**character**) at a time. Each pass through the loop is called an **iteration**:

```python
word = "cat"

for letter in word:      # `letter` is the loop variable
    print(letter)        # indented loop body runs once per character

print("After loop, last letter:", letter)
```

The screen shows:

```text
c
a
t
After loop, last letter: t
```

Look closely at what happens step by step:

1. Python takes `"c"` (index `0`), assigns it to the **loop variable** `letter`, and runs the 4-space indented **loop body** (`print(letter)`).
2. Next iteration: `letter` becomes `"a"`, then `"t"`.
3. When no characters remain, the loop ends cleanly and Python runs the unindented code below. Notice `letter` keeps its final value (`"t"`) after the loop!

**Edge case — empty string (`""`):** If `word = ""`, the loop body executes **0 times** cleanly without an error (and in that case `letter` is never assigned!).
