---
type: question
title: "Do Python dicts preserve order, and what happens with duplicate or equal keys?"
difficulty: medium
mostAsked: true
tags: [interview, dicts, edge-cases]
related:
  [
    python.dictionaries-and-sets.what-is-a-dictionary,
    python.dictionaries-and-sets.dict-and-set-edge-cases-predict,
  ]
revision:
  - "Since Python 3.7 (guaranteed by language spec), `dict` preserves **insertion order**; `set` does **not**"
  - "Updating an existing key keeps its **original position**; equal keys like `1` and `True` share the same slot"
---

## Answer

1. **Yes, dictionaries keep insertion order (Python 3.7+):** Iterating over a `dict` always yields keys in the exact order they were first inserted. Updating `d["a"] = 99` changes `"a"`'s value in place **without** moving `"a"` to the end. (If you delete `del d["a"]` and re-insert `d["a"] = 99`, it moves to the end.)
2. **Equal keys (`1`, `True`, `1.0`):** Because `1 == True == 1.0` and they have the same hash, Python treats them as the **same key** — keeping the **first** key object inserted while overwriting the value with the latest one.
3. **Sets do NOT guarantee order:** A `set` never promises insertion order (and in fact varies across runs because string hashes randomize on every startup for security!).

A short answer for an interview: "Since Python 3.7+, dictionaries preserve key insertion order and updating an existing key leaves its position unchanged, whereas sets have no guaranteed order."

## Why interviewers ask

Many older tutorials still say "dicts are unordered" (which was true before Python 3.7!). Interviewers check up-to-date Python knowledge and whether you confuse `dict` order guarantees with `set` behavior.

## Follow-ups

- What does `{1: "a", True: "b", 1.0: "c"}` become? (`{1: 'c'}`)
- When would you still use `collections.OrderedDict` in modern Python? (For `move_to_end()` in LRU caches or order-sensitive `d1 == d2`!)
