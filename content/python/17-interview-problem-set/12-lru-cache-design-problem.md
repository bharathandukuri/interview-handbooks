---
type: problem
title: "Design pattern: O(1) LRU Cache (Hash Map + Doubly-Linked List)"
difficulty: hard
mostAsked: true
complexity:
  time: "O(1) for both get(key) and put(key, value)"
  space: "O(capacity) for dict + doubly-linked nodes"
approach: "Combine a dict for O(1) lookup with dummy-sentinel doubly-linked nodes for O(1) move-to-front and tail eviction"
tags: [interviews, design, lru-cache, data-structures]
related:
  [
    python.dictionaries-and-sets.why-dict-and-set-are-fast,
    python.interview-problem-set.sliding-window-and-lru-predict,
  ]
revision:
  - "Dict alone gives `O(1)` lookup, **not** recency removal; doubly-linked list alone gives `O(1)` eviction, **not** lookup — pair them together!"
  - "Use dummy `head` and `tail` sentinel nodes so adding/removing nodes never needs messy `None` pointer checks!"
---

## Problem

Design an **`LRUCache(capacity)`** supporting two operations in **`O(1)` average time**:

- `get(key) -> int`: returns value if present (and marks key **Most Recently Used**), otherwise returns `-1`.
- `put(key, value) -> None`: inserts/updates `key` as **Most Recently Used**; if adding exceeds `capacity`, evicts the **Least Recently Used** key first!

Guard `capacity <= 0` with `ValueError` (note also the classic bug trap: updating an _existing_ key when cache is full must **not** accidentally evict another key!).

## Hint

- Store `cache: dict[int, _Node]`.
- Keep two dummy sentinel nodes: `head <-> ... <-> tail`, where `head.next` is **MRU** and `tail.prev` is **LRU**.
- Factor two tiny 4-line helpers cleanly: `_remove(node)` unlinks any node in `O(1)`, and `_insert_front(node)` inserts right after `head` in `O(1)`.
- _(Bonus standard-library note: `collections.OrderedDict` gives `.move_to_end(k)` + `.popitem(last=False)`, though interviewers usually ask you to implement the linked-list nodes yourself!)_

## Solution

```python
class _Node:
    __slots__ = ("key", "val", "prev", "next")

    def __init__(self, key: int = 0, val: int = 0) -> None:
        self.key, self.val = key, val
        self.prev: "_Node | None" = None
        self.next: "_Node | None" = None

class LRUCache:
    def __init__(self, capacity: int) -> None:
        if capacity <= 0:
            raise ValueError("capacity must be >= 1")
        self.capacity = capacity
        self.map: dict[int, _Node] = {}
        self.head, self.tail = _Node(), _Node()
        self.head.next, self.tail.prev = self.tail, self.head

    def _remove(self, node: _Node) -> None:
        prev_n, next_n = node.prev, node.next
        assert prev_n is not None and next_n is not None
        prev_n.next, next_n.prev = next_n, prev_n

    def _insert_front(self, node: _Node) -> None:
        first = self.head.next
        assert first is not None
        node.prev, node.next = self.head, first
        self.head.next = first.prev = node

    def get(self, key: int) -> int:
        if key not in self.map:
            return -1
        node = self.map[key]
        self._remove(node)
        self._insert_front(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.map:
            node = self.map[key]
            node.val = value
            self._remove(node)
            self._insert_front(node)
            return
        if len(self.map) == self.capacity:
            lru = self.tail.prev
            assert lru is not None and lru is not self.head
            self._remove(lru)
            del self.map[lru.key]
        node = _Node(key, value)
        self.map[key] = node
        self._insert_front(node)

lru = LRUCache(2)
lru.put(1, 10); lru.put(2, 20)
print("get 1:", lru.get(1))          # refreshes key 1 -> key 2 becomes LRU
lru.put(3, 30)                       # evicts key 2!
print("get 2:", lru.get(2), "| get 3:", lru.get(3), "| get 1:", lru.get(1))
```

## Walkthrough

Notice why storing **`node.key`** inside `_Node` is essential: when capacity overflows, you grab `lru = self.tail.prev`, and you need `lru.key` to delete it from `self.map` (`del self.map[lru.key]`) in **`O(1)`**! Without `node.key`, you could not find which dictionary entry pointed to `lru`.

Meanwhile, dummy `head` and `tail` sentinels eliminate every boundary `if head is None:` branch inside `_remove` and `_insert_front` — shrinking bug risk down to nearly zero!
