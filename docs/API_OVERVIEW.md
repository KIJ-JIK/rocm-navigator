# ROCm Navigator: API Overview

Exposed FastAPI gateway endpoints list.

* `POST /api/v1/auth/session-handshake` - Verifies credentials and signs JWT keys.
* `GET /api/v1/dashboard/metrics` - Returns system metrics.
* `POST /api/v1/migrate/upload` - Commences multi-agent code compilation.
* `GET /api/v1/migrate/status/:id` - Polls current agent execution statuses.
