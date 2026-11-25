---
type: predict
title: "Do Python type hints raise TypeError at runtime?"
difficulty: easy
mostAsked: true
tags: [typing, runtime, dynamic-typing, trace]
related: [python.testing-typing-clean-code.type-hints-basics-and-unions]
revision:
  - "Python ignores function type annotations at call time — wrong types only fail if an operation inside the body fails (or a runtime library like Pydantic validates them)"
options:
  - "py3"
  - "TypeError: a and b must be int"
  - "SyntaxError"
  - "None"
answer: 0
---

```python
def add(a: int, b: int) -> int:
    return a + b

print(add("py", "3"))
```

## Output

```text
py3
```

## Explanation

Python stores `: int` and `-> int` inside `add.__annotations__` purely as metadata for static type checkers (**`mypy`**, **`pyright`**), editors, and runtime libraries (like `pydantic` or `FastAPI`). Python's interpreter itself **never validates argument types when calling `add(...)`**! Since `"py" + "3"` is valid string concatenation, Python calmly returns `"py3"` with zero errors at runtime.
