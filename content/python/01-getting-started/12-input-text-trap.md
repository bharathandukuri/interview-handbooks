---
type: pitfall
title: "input() gives text, not numbers"
difficulty: easy
mostAsked: true
tags: [input, gotchas, types]
related: [python.getting-started.input-gives-text]
revision:
  - '`input()` always returns text, so `"3" + "4"` is `"34"`'
  - "Wrap it with `int()` to get a whole number"
---

## The trap

```python
a = input("First number: ")
b = input("Second number: ")
print(a + b)
# You type 3 and 4, and it shows 34 (not 7!)
```

## The fix

```python
a = int(input("First number: "))
b = int(input("Second number: "))
print(a + b)
# You type 3 and 4, and it shows 7
```

## Why it happens

`input()` always gives back **text**. So `a` is the text `"3"` and `b` is the text `"4"`.

With text, `+` does not add. It **joins** the pieces together, so `"3" + "4"` becomes `"34"`.

`int()` turns text into a whole number. After that, `+` adds the numbers the way you expect.
