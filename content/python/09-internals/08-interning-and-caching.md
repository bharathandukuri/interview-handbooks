---
type: predict
title: "Integer interning and identity"
difficulty: medium
tags: [interning, identity, cpython]
options:
  - "True True"
  - "True False"
  - "False True"
  - "False False"
answer: 1
---

```python
a, b = int("256"), int("256")
c, d = int("257"), int("257")
print(a is b, c is d)
```

## Output

```text
True False
```

## Explanation

CPython pre-allocates and **interns** small integers in **`-5` through `256`**. `a` and `b` both point to the exact same cached `256` object, so `a is b` is `True`.

`257` is outside that range, so Python constructs separate `int` objects at runtime (note: inside a single compiled code block/line, compiler constant-folding can sometimes share literals, which is why testing across statements or runtime expressions shows `False`).

:::pitfall[Always use `==` for numbers and strings]
Interning (`-5..256` and identifier strings) is a CPython optimization detail — never rely on `is` to compare numbers or strings.
:::
