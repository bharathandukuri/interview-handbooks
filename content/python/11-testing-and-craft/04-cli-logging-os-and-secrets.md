---
type: concept
title: "CLI (`argparse`), `logging`, `shutil`, and `secrets`"
difficulty: medium
tags: [stdlib, logging, security, cli]
---

Key production stdlib modules every Python engineer uses:

```python
import argparse, logging, secrets, hashlib

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
logger = logging.getLogger(__name__)
logger.info("Processed %d items for user=%s", 42, "ada")   # lazy % formatting!

token = secrets.token_urlsafe(32)          # crypto-safe (NEVER `random` for tokens!)
digest = hashlib.sha256(b"payload").hexdigest()
```

- **`logging` vs `print`:** `logging` supports severity levels (`DEBUG`→`CRITICAL`), timestamps, and file/JSON handlers. Use lazy `logger.info("x=%s", x)` so strings aren't formatted when `DEBUG` is disabled.
- **`argparse`:** Standard CLI parser (`parser.add_argument("--port", type=int, default=8000)`).
- **`shutil` & `tempfile`:** `shutil.copytree`, `shutil.rmtree`, `tempfile.TemporaryDirectory()` for safe cross-platform temp files.
- **`secrets` vs `random`:** `random` uses Mersenne Twister (predictable!); always use `secrets` for API keys, tokens, and password resets.
