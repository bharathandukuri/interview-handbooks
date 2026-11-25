---
type: concept
title: "Conditionals and structural `match`/`case`"
difficulty: easy
tags: [control-flow, conditionals, match-case]
---

Python uses `if`, `elif`, and `else` for branching, plus single-line conditional expressions:

```python
label = "adult" if age >= 18 else "minor"   # ternary expression
```

**Structural Pattern Matching (`match`/`case`, Python 3.10+):** Goes far beyond C-style `switch` — it destructures shapes (sequences, dicts, objects) and supports `if` guards:

```python
def handle_command(cmd: list[str]) -> str:
    match cmd:
        case ["quit" | "exit"]:
            return "Goodbye"
        case ["go", direction] if direction in {"north", "south"}:
            return f"Moving {direction}"
        case ["drop", *items]:
            return f"Dropped {len(items)} items"
        case _:
            return "Unknown command"
```

`_` is the wildcard default case. Notice no `break` is needed — Python only executes the first matching `case` block.
