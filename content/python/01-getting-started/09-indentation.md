---
type: concept
title: "Indentation: why leading spaces change Python's meaning"
difficulty: easy
tags: [indentation, syntax, clean-code, basics]
revision:
  - "**Indentation** is the **whitespace** (spaces) at the beginning of a line — in Python it defines **code blocks**"
  - "At top level, code starts at column 0 (no leading spaces); unexpected spaces raise **`IndentationError`** before running"
  - "Always indent blocks by **4 spaces** and never mix **Tabs** and **Spaces** (`TabError`)"
---

**Indentation** means the leading whitespace (spaces or tabs) at the start of a line. In languages like C, Java, or JavaScript, curly brackets `{ ... }` group lines into a **code block** and indentation is purely decorative. In Python, **indentation IS the grouping rule**!

Right now, all your top-level statements belong to the main file body, so they must start cleanly at the **very left edge** (0 spaces). Adding accidental spaces triggers an error _before_ a single line executes:

```python
# Incorrect top-level spacing (raises IndentationError at parse time):
# print("Hello")
#     print("World")   # <- IndentationError: unexpected indent!

# Preview: inside an `if` block (covered in Chapter 03), 4 spaces group lines together:
if True:
    print("Inside the block (4 spaces)")
    print("Still inside the block (must align at 4 spaces!)")
print("Back outside at 0 spaces")
```

The screen shows:

```text
Inside the block (4 spaces)
Still inside the block (must align at 4 spaces!)
Back outside at 0 spaces
```

**Indentation rules and edge cases:**

- **Use 4 spaces per level (PEP 8 standard):** Your editor's `Tab` key should automatically insert 4 spaces.
- **Never mix Tabs and Spaces (`TabError`):** Even if a Tab character looks 4 spaces wide on screen, Python treats `\t` and `"    "` as incompatible and raises **`TabError: inconsistent use of tabs and spaces in indentation`**.
- **Consistent within every block:** Every line belonging to the same block must align cleanly at the exact same column (`4` spaces, then `8` if nested deeper — never `4` spaces on line 1 and `3` spaces on line 2!). Notice Python ignores leading spaces inside open parentheses `( ... )` across lines (useful for wrapping long code cleanly!).
