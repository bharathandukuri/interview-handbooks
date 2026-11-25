---
type: problem
title: "Valid Parentheses"
difficulty: easy
complexity:
  time: "O(n)"
  space: "O(n)"
approach: "Stack"
tags: [stack, strings]
---

## Problem

Given a string `s` containing only `'('`, `')'`, `'{'`, `'}'`, `'['`, `']'`, return `True` if every bracket is closed in the right order.

```
Input:  s = "({[]})"  -> True
Input:  s = "([)]"    -> False
```

## Hint

- Push opening brackets onto a stack; pop and verify when you encounter a closing bracket.

## Solution

```python
def is_valid(s: str) -> bool:
    stack: list[str] = []
    close_to_open = {")": "(", "}": "{", "]": "["}
    for ch in s:
        if ch in close_to_open:
            if not stack or stack[-1] != close_to_open[ch]:
                return False
            stack.pop()
        else:
            stack.append(ch)
    return not stack
```

## Walkthrough

Opening brackets are pushed to `stack`. Any closing bracket must match `stack[-1]`; otherwise the string is invalid. At the end, `not stack` ensures no unmatched openers remain.
