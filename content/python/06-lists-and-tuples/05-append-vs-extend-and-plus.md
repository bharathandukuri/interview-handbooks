---
type: compare
title: ".append() vs .extend() vs + vs +="
difficulty: easy
mostAsked: true
left: ".append() / +"
right: ".extend() / +="
tags: [lists, methods, mutability]
related: [python.lists-and-tuples.list-methods-add-remove-find]
revision:
  - "`.append(x)` adds `x` as **one element** (even if `x` is another list); `.extend(seq)` unpacks and adds each item"
  - "`a + b` creates a **new list**; `a += b` mutates `a` in place just like `a.extend(b)`"
---

Adding elements to a list works very differently depending on which operation you pick. Watch what happens when adding `[3, 4]` to `a = [1, 2]`:

| Operation          | Result in `a`                 | Mutates `a` in place?      | Accepts any iterable (like `"hi"`)?                   |
| ------------------ | ----------------------------- | -------------------------- | ----------------------------------------------------- |
| `a.append([3, 4])` | `[1, 2, [3, 4]]` (length `3`) | ✅ Yes                     | Adds object whole as 1 item                           |
| `a.extend([3, 4])` | `[1, 2, 3, 4]` (length `4`)   | ✅ Yes                     | ✅ Yes (`a.extend("hi")` -> `['h', 'i']`)             |
| `a + [3, 4]`       | New list `[1, 2, 3, 4]`       | ❌ No (`a` stays `[1, 2]`) | ❌ Both sides must be `list` (`TypeError` otherwise!) |
| `a += [3, 4]`      | `[1, 2, 3, 4]`                | ✅ Yes (mutates aliases!)  | ✅ Yes (`a += "hi"` works!)                           |

## Verdict

Use **`.append(item)`** to push one item onto the end, and **`.extend(seq)`** (or `+=`) to add every element from another sequence in place. Be careful with **`a += b`** on lists: unlike `a = a + b` (which creates a brand-new list), `a += b` mutates the original list in place, so any other variable pointing to `a` sees the added elements too!
