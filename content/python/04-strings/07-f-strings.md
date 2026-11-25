---
type: concept
title: "f-strings: string interpolation and formatting"
difficulty: easy
mostAsked: true
tags: [strings, f-strings, formatting]
related: [python.getting-started.greet-the-user]
revision:
  - "An **f-string** (**formatted string literal**) inserts expressions inside `{ }` placeholders (**interpolation**)"
  - "Use **format specifiers** after `:` — `{price:.2f}` for 2 decimals, `{n:,}` for commas, `{x:>6}` for width"
  - "Write double braces `{{` and `}}` when you want literal curly braces in output"
---

Back in Chapter 1, we used `sep=""` to stop unwanted spaces in `print()`. **f-strings** (officially **formatted string literals**) solve this everywhere — inside `print()` or saved into variables — using **string interpolation**.

Put `f` (or `F`) before the quotes and drop any Python expression inside `{ }` **placeholders**:

```python
name = "Ravi"
price = 1234.5
count = 3

msg = f"Hello, {name}! Total: ${price * count:,.2f}"
print(msg)
print(f"{count=}")             # debug shortcut: prints name AND value!
print(f"{{literal}}")          # double braces print literal { }
```

The screen shows:

```text
Hello, Ravi! Total: $3,703.50
count=3
{literal}
```

**Useful format specifiers (after `:` inside `{ }`):**

- `:.2f` rounds to 2 decimal places (`9.5` -> `"9.50"`).
- `:,` adds thousands separators (`1000000` -> `"1,000,000"`).
- `:4` or `:>6` pads with spaces to align columns (great for tables).
- `{var=}` prints `var=...` automatically for quick debugging.

:::tip[Edge case: missing `f` or unclosed braces]
If your screen prints `{name}` literally instead of `Ravi`, you forgot the `f` before the quotes! And if you need real `{` `}` characters in an f-string, double them: `{{` and `}}`.
:::
