---
type: pitfall
title: "Race conditions despite the GIL (counter += 1 is NOT atomic)"
difficulty: medium
mostAsked: true
tags: [concurrency, threading, gil, gotchas]
related:
  [
    python.concurrency.threading-locks-and-queue,
    python.how-python-works-inside.gil-and-free-threaded-python,
  ]
revision:
  - "The GIL protects **CPython interpreter internals**, NOT your program's compound `counter += 1` invariants!"
  - "`x += 1` executes multiple bytecode instructions (load -> add -> store); threads can switch mid-update and silently lose counts"
---

## The trap

```python
# Unsafe check-then-act / read-modify-write shared across threads:
import threading, time

state = {"balance": 100}

def withdraw_unsafe(amount):
    if state["balance"] >= amount:
        time.sleep(0.01)              # yields GIL between checking and writing!
        state["balance"] -= amount

t1 = threading.Thread(target=withdraw_unsafe, args=(80,))
t2 = threading.Thread(target=withdraw_unsafe, args=(80,))
t1.start(); t2.start()
t1.join(); t2.join()
print("Overdrawn balance:", state["balance"])   # -60! Both threads passed `>= 80`!
```

## The fix

```python
import threading, time

state = {"balance": 100}
lock = threading.Lock()

def withdraw_safe(amount):
    with lock:                        # entire check + update becomes atomic!
        if state["balance"] >= amount:
            time.sleep(0.01)
            state["balance"] -= amount

t1 = threading.Thread(target=withdraw_safe, args=(80,))
t2 = threading.Thread(target=withdraw_safe, args=(80,))
t1.start(); t2.start()
t1.join(); t2.join()
print("Safe balance:", state["balance"])        # 20 (second thread saw 20 < 80!)
```

## Why it happens

Developers frequently assume _"Since standard CPython has the GIL, only one thread runs at a time, so my shared variables need no locks."_ **Wrong!**

1. Even without `time.sleep()`, CPython switches threads periodically between bytecode instructions! A compound statement like `counter += 1` compiles to `LOAD -> BINARY_OP += -> STORE` — if Thread 1 loads `10` and switches _before_ storing `11`, Thread 2 also loads `10` and both write `11` (**lost update**!).
2. Compound **check-then-act** business rules (`if balance >= 80: ...; balance -= 80`) can interleave at `time.sleep` or I/O, corrupting invariants into `-60`. Always protect shared state invariants with `with lock:` (or keep data isolated inside each thread / process / async task).
