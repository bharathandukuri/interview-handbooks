---
type: concept
title: "Timezone-aware `datetime` and `zoneinfo`"
difficulty: medium
tags: [datetime, zoneinfo, stdlib]
---

Never mix **naive** datetimes (`tzinfo=None`) with **timezone-aware** datetimes (`TypeError`), and avoid deprecated `datetime.utcnow()` (which returns a naive object!).

```python
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo              # built-in since Python 3.9

now_utc = datetime.now(timezone.utc)       # always store & compute in UTC
ny_time = now_utc.astimezone(ZoneInfo("America/New_York"))
tomorrow = now_utc + timedelta(days=1)

iso = now_utc.isoformat()                  # "2026-03-15T10:30:00+00:00"
parsed = datetime.fromisoformat(iso)       # parses 'Z' suffix cleanly in 3.11+
```

**Best practices:**

- Store and compare all timestamps in **UTC** (`datetime.now(timezone.utc)`).
- Convert to a user's `ZoneInfo("Asia/Tokyo")` only at the display boundary.
- Use `time.monotonic()` or `time.perf_counter()` — never `datetime.now()` — for measuring elapsed durations or timeouts (wall clocks can jump backwards on NTP sync).
