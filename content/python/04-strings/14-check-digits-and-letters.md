---
type: concept
title: "Input validation methods: isdigit, isalpha, isalnum, isspace"
difficulty: easy
tags: [strings, methods, validation, edge-cases]
related: [python.getting-started.input-text-trap]
revision:
  - "**Input validation** methods inspect every character and return `True` only when the string is non-empty and every character matches"
  - '`.isdigit()` rejects signs (`"-5"`) and decimal dots (`"3.14"`) — those characters are not digits!'
  - 'Empty strings (`""`) always return `False` for all `.is...()` checks'
---

Before calling `int(user_input)`, good programs perform **input validation** (checking that the text looks safe before converting it). Python's string validation methods check every character in a string:

| Method       | `True` when every character is...                  | Common `"gotcha"` (`False`!)           |
| ------------ | -------------------------------------------------- | -------------------------------------- |
| `.isdigit()` | A digit (`0`–`9`)                                  | `"-5"`, `"3.14"`, `"12 "` (has space!) |
| `.isalpha()` | An alphabet letter (`a–z`, `A–Z`, Unicode letters) | `"hi there"` (has space!), `"hi5"`     |
| `.isalnum()` | Either a letter or a digit                         | `"user_1"` (`_` fails!), `"a b"`       |
| `.isspace()` | Whitespace (`' '`, `\t`, `\n`)                     | `""` (empty string is `False`!)        |

```python
print("2026".isdigit())     # True
print("-5".isdigit())       # False (`-` is not a digit!)
print("3.14".isdigit())     # False (`.` is not a digit!)
print("Python".isalpha())   # True
print("hi 5".isalpha())     # False (space and digit 5)
print("abc123".isalnum())   # True
print("   ".isspace())      # True
print("".isdigit())         # False (edge case: empty string!)
```

The screen shows:

```text
True
False
False
True
False
True
True
False
```

Notice the two biggest **edge cases**:

1. **Empty strings return `False`:** `""` returns `False` for all four methods, which safely rejects blank Enter presses.
2. **Negative numbers and decimals fail `.isdigit()`:** If you want to accept `"-5"`, strip a leading `"-"` first before checking `.isdigit()`.
