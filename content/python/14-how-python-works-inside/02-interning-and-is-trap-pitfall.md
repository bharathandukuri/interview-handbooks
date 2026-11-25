---
type: pitfall
title: "Small-integer (-5 to 256) and string interning trap with 'is'"
difficulty: medium
mostAsked: true
tags: [internals, interning, is, gotchas]
related:
  [
    python.how-python-works-inside.names-objects-and-id,
    python.operators-and-decisions.equals-vs-is,
  ]
revision:
  - "CPython pre-allocates small integers **`-5` to `256`** and interns short identifier-like strings as a memory optimization"
  - "Using `is` on numbers or strings (`x is 256` vs `x is 257`) works by accident for small values and breaks unpredictably for larger/runtime-created ones — always use `==`!"
---

## The trap

```python
a = int("256")
b = int("256")
print("256 is 256:", a is b)         # True (cached small int -5..256!)

x = int("257")
y = int("257")
print("257 is 257:", x is y)         # False! Two separate objects with value 257!
```

## The fix

```python
a = int("256")
b = int("256")
x = int("257")
y = int("257")

print("use == for values:", a == b, x == y)    # always True True!
print("use is ONLY for None/sentinels:", (x is None))
```

## Why it happens

Because small numbers (`-5` through `256`) and identifier-shaped strings (`"hello"`, variable names) appear constantly, CPython creates them **once** at startup (**interning**) and reuses those exact objects whenever requested at runtime. Any integer outside `-5..256` created dynamically (like `int("257")` or user input) allocates a fresh object with a different `id()`!

_(Subtle compiler detail: writing two identical literals like `x = 257; y = 257` inside the **same** compiled code block can still share one object via CPython's compile-time constant table — which makes bugs using `is` instead of `==` even trickier because tests with literals might accidentally pass while runtime inputs fail!)_
