---
type: problem
title: "Design pattern: Implement Trie (Prefix Tree) with autocomplete"
difficulty: medium
mostAsked: true
complexity:
  time: "O(k) per insert, search, and starts_with on word of length k"
  space: "O(total characters across inserted words)"
approach: "Represent each node with a children dict + is_end flag, sharing common prefixes automatically"
tags: [interviews, design, trie, strings, data-structures]
related: [python.how-python-works-inside.slots-and-memory-optimization]
revision:
  - "Each `TrieNode` holds `children: dict[str, TrieNode]` and **`is_end: bool`** to distinguish complete words from mere prefixes (`'app'` vs `'apple'`)"
  - "Using `__slots__` on `TrieNode` cuts memory sharply when storing thousands of dictionary nodes"
---

## Problem

Implement a **Trie** (**Prefix Tree**) supporting:

- `insert(word: str) -> None`
- `search(word: str) -> bool` (exact full-word match)
- `starts_with(prefix: str) -> bool` (prefix match)
- `autocomplete(prefix: str, limit: int = 5) -> list[str]` (up to `limit` words starting with `prefix` in alphabetical order)

Edge cases: empty `""` (`insert("")` vs non-inserted `""`), prefix `"app"` after inserting `"apple"` (`starts_with("app") -> True`, `search("app") -> False`), unknown prefix (`[]`).

## Hint

- Write a private helper `_walk(text)` returning the final `TrieNode` or `None` — then `search` checks `node is not None and node.is_end`, `starts_with` checks `node is not None`, and `autocomplete` starts DFS from `node`!
- In `autocomplete`, iterate `sorted(node.children)` so results return deterministically in alphabetical order!

## Solution

```python
class _TrieNode:
    __slots__ = ("children", "is_end")

    def __init__(self) -> None:
        self.children: dict[str, "_TrieNode"] = {}
        self.is_end: bool = False

class Trie:
    def __init__(self) -> None:
        self.root = _TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = _TrieNode()
            node = node.children[ch]
        node.is_end = True

    def _walk(self, text: str) -> _TrieNode | None:
        node = self.root
        for ch in text:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node

    def search(self, word: str) -> bool:
        node = self._walk(word)
        return node is not None and node.is_end

    def starts_with(self, prefix: str) -> bool:
        return self._walk(prefix) is not None

    def autocomplete(self, prefix: str, limit: int = 5) -> list[str]:
        if limit <= 0:
            return []
        start_node = self._walk(prefix)
        if start_node is None:
            return []
        results: list[str] = []
        path = list(prefix)

        def dfs(node: _TrieNode) -> None:
            if len(results) >= limit:
                return
            if node.is_end:
                results.append("".join(path))
            for ch in sorted(node.children):
                path.append(ch)
                dfs(node.children[ch])
                path.pop()
                if len(results) >= limit:
                    return

        dfs(start_node)
        return results

trie = Trie()
for w in ["apple", "app", "application", "bat", "ball"]:
    trie.insert(w)
print("search('app'):", trie.search("app"), "| search('ap'):", trie.search("ap"))
print("starts_with('ap'):", trie.starts_with("ap"))
print("autocomplete('ap', 2):", trie.autocomplete("ap", limit=2))
```

## Walkthrough

Notice how factoring **`_walk(text)`** removes duplicated character-loop logic across `search`, `starts_with`, and `autocomplete`! Meanwhile:

1. Using `path.append(ch)` + `path.pop()` (backtracking on a mutable list) builds suggestions without allocating new string copies at every recursion step (`O(depth)` temporary strings).
2. **`__slots__ = ("children", "is_end")`** avoids a per-node `__dict__` on tens of thousands of prefix tree nodes.
