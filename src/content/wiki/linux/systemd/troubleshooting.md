---
category: linux
title: "Systemd Troubleshooting"
description: "Quick flow to debug failing services with systemctl and journalctl."
date: 2025-01-04
tags: ["linux", "systemd", "troubleshooting"]
draft: false
---
## Fast status pass
- `systemctl status app.service` — check unit state and last log lines
- `systemctl list-dependencies app.service` — ensure wants/requires are present
- `systemctl cat app.service` — confirm the shipped unit
- `systemctl show app.service -p FragmentPath,User,Group,ExecStart,Environment` — verify runtime props

## Logs to inspect
- `journalctl -u app.service -b -n 50` — last 50 lines this boot
- `journalctl -u app.service --since "20 min ago"` — recent errors
- `journalctl -xe` — broader context for recent issues

## Common pitfalls
### Permissions
- ExecStart path missing execute bit.
- WorkingDirectory not readable by service user.
- Files written to directories without correct ownership.

### Environment
- Missing `EnvironmentFile=` contents; confirm with `systemctl show -p EnvironmentFiles`.
- Wrong `PATH` when using binaries from custom prefixes.

### Networking
- Port already bound: check `ss -tulpn | grep :PORT`.
- Dependency order: add `After=network-online.target` and ensure `systemd-networkd-wait-online.service` is enabled if needed.

## Restart safely
- `systemctl daemon-reload` after unit edits.
- `systemctl restart app.service` and watch `journalctl -fu app.service`.
- Use `systemctl revert app.service` to drop overrides.

## Escalation notes
Capture:
1. Exact failure timestamp.
2. Unit file (including drop-ins).
3. Relevant journal excerpt.
4. Recent config diff or deployment notes.






