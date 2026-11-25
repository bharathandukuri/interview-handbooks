---
type: concept
title: "`str` vs `bytes` and UTF-8 encoding"
difficulty: easy
tags: [strings, bytes, unicode]
---

Python 3 cleanly separates human-readable text (**`str`**, Unicode code points) from raw binary data (**`bytes`**, sequences of integers `0..255`).

```python
text = "café ☕"
raw = text.encode("utf-8")     # str -> bytes
print(type(raw), len(raw))     # <class 'bytes'> 9 (multi-byte UTF-8)

restored = raw.decode("utf-8") # bytes -> str
print(restored == text)        # True
```

**When you encounter `bytes`:**

- Reading binary files (`open(..., "rb")`), network sockets, HTTP bodies, cryptographic hashes (`hashlib`).
- Bytes literals have a `b` prefix: `b"hello"`.
- You cannot concatenate `str + bytes` directly — Python raises `TypeError` (strong typing). Always decode at the I/O boundary into `str`, process as `str`, and encode back on output.

:::pitfall[Default platform encoding]
Always pass `encoding="utf-8"` when opening text files, or Windows defaults may break on non-ASCII characters.
:::
