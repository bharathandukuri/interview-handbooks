---
type: pitfall
title: "input() gives text, not numbers ('3' + '4' is '34')"
difficulty: easy
mostAsked: true
tags: [input, gotchas, types, conversions]
related: [python.getting-started.input-gives-text]
revision:
  - "`input()` always returns a `str`, so `'3' + '4'` **joins** strings to `'34'` instead of adding to `7`"
  - "Wrap with `int(...)` for whole numbers or `float(...)` for decimals — remember `int('3.5')` fails with `ValueError`!"
---

## The trap

```python
a = input("First number: ")
b = input("Second number: ")
print(a + b)
# If user types 3 and 4 -> prints 34 (NOT 7!)
```

## The fix

```python
a = int(input("First number: "))
b = int(input("Second number: "))
print(a + b)
# If user types 3 and 4 -> prints 7!
```

## Why it happens

`input()` **always** hands back text (**string** / `str`), even when every character is a digit!

- For two strings, `+` performs **concatenation** (joining end-to-end), turning `"3" + "4"` into `"34"` — just like `"foot" + "ball"` becomes `"football"`.
- Wrapping with **`int(...)`** converts numeric text into a real whole number so `+` adds `3 + 4 -> 7`.

**Watch two important edge cases:**

- **Decimals (`"3.5"`):** Calling `int("3.5")` crashes with **`ValueError`**! Use **`float(input(...))`** whenever users might type decimal values.
- **Letters or blank Enter (`"abc"`, `""`):** Calling `int("abc")` or `int("")` also raises **`ValueError`** — in Chapter 10 you will learn how to catch and handle bad user typing gracefully with `try` / `except`!
