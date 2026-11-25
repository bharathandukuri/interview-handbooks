---
type: predict
title: "What is score now?"
difficulty: easy
tags: [variables, assignment]
related: [python.variables-and-types.what-is-a-variable]
options:
  - "10"
  - "15"
  - "5"
  - "It shows an error"
answer: 1
---

A variable can get a new value at any time. Read the code and guess what the screen shows.

```python
score = 10
score = score + 5
print(score)
```

## Output

```text
15
```

## Explanation

Python always works out the **right** side first. On the right, `score` is 10, so `score + 5` is 15.

Then Python saves that 15 under the name `score`. The old value, 10, is forgotten.

So a line like `score = score + 5` is not a maths puzzle. It means "take the current score, add 5, and save it back as score".
