---
type: compare
title: "`append` vs `extend` vs `+` vs `+=`"
difficulty: easy
left: "append / +"
right: "extend / +="
tags: [lists, mutability]
---

| Operation          | Effect on `[1, 2]` with `[3, 4]` | Mutates in place?   | Works with any iterable?        |
| ------------------ | -------------------------------- | ------------------- | ------------------------------- |
| `a.append([3, 4])` | `[1, 2, [3, 4]]` (adds 1 item)   | ✅ Yes              | Adds object as single element   |
| `a.extend([3, 4])` | `[1, 2, 3, 4]` (unpacks items)   | ✅ Yes              | ✅ Yes (generators, sets, etc.) |
| `a + [3, 4]`       | New list `[1, 2, 3, 4]`          | ❌ No               | ❌ Both must be `list`          |
| `a += [3, 4]`      | Mutates `a` like `extend`        | ✅ Yes (for lists!) | ✅ Yes (`a += (3, 4)` works!)   |

## Verdict

Use **`append(item)`** to add a single element, and **`extend(iterable)`** (or `+=`) to merge elements from another iterable in place. Remember that `a += b` mutates `a` in place for lists (affecting aliases!), whereas `a = a + b` creates a new list.
