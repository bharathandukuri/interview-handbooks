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

Given a string `s` containing only `'('`, `')'`, `'{'`, `'}'`, `'['`, `']'`, return `True` if the brackets are valid (properly opened and closed in order).

```
Input:  s = "({[]})"  → True
Input:  s = "([)]"    → False
```

## Hint

- When you see an opening bracket, what do you need to remember?
- What data structure lets you match the most-recent unmatched opener?

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

Push every opening bracket onto the stack. When you see a closing bracket, check that the top of the stack is its matching opener. If not (or the stack is empty), the string is invalid. After processing all characters, the stack must be empty — any leftover opener means unmatched brackets. The `close_to_open` mapping keeps the matching logic clean and extensible.
