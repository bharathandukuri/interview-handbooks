---
type: problem
title: "Implement Trie (Prefix Tree)"
difficulty: hard
complexity:
  time: "O(L) per operation"
  space: "O(total characters)"
approach: "Nested dict Trie"
tags: [trie, trees, design]
---

## Problem

Implement a `Trie` with `insert(word)`, `search(word)` (exact match), and `starts_with(prefix)` (prefix match).

```
trie = Trie()
trie.insert("python")
trie.search("py")       # False
trie.starts_with("py")  # True
```

## Hint

- In Python, a Trie node can be a compact `dict` of `{char: child_dict}` with a sentinel key like `"#"` marking end-of-word (or a lightweight class with `children: dict` and `is_end: bool`).

## Solution

```python
class Trie:
    def __init__(self) -> None:
        self.root: dict[str, dict | bool] = {}
    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node["#"] = True
    def _find(self, prefix: str) -> dict | None:
        node = self.root
        for ch in prefix:
            if (node := node.get(ch)) is None:
                return None
        return node
    def search(self, word: str) -> bool:
        return (node := self._find(word)) is not None and "#" in node
    def starts_with(self, prefix: str) -> bool:
        return self._find(prefix) is not None
```

## Walkthrough

Using `dict.setdefault` builds prefix branches lazily in O(L) where `L` is word length. Factoring `_find(prefix)` avoids duplicating traversal logic between `search` (which checks for the `"#"` end marker) and `starts_with`.
