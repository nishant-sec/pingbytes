---
title: "Linux Operations Hub"
description: "Command-line fundamentals, service management, and troubleshooting workflows for Linux hosts."
date: 2025-01-04
tags: ["linux", "ops"]
draft: false
---

## Overview
This hub collects practical Linux notes you can reference during on-call and project work. The two nested folders cover shell essentials and systemd troubleshooting with longer walkthroughs to exercise the navigation and TOC.

### What’s inside
- `cli/essentials` — Daily driver shell commands, file ops, networking, and process inspection.
- `systemd/troubleshooting` — Service checks, log review, and restart strategies.

## Quick sanity checks
- `uname -a` — confirm kernel and architecture
- `lsb_release -a` or `/etc/os-release` — confirm distro
- `whoami && id` — confirm user and group membership
- `df -h` and `lsblk` — confirm disks and mounts

## Common tasks
### Package management
- Debian/Ubuntu: `sudo apt update && sudo apt upgrade`
- RHEL/Fedora: `sudo dnf check-update && sudo dnf upgrade`
- Alpine: `sudo apk update && sudo apk upgrade`

### Logs to grab first
- `journalctl -p err -b` — errors since last boot
- `dmesg -T | tail -n 30` — kernel hints
- `/var/log/auth.log` or `/var/log/secure` — auth anomalies

### Networking triage
- `ip a` — addresses
- `ip r` — routes
- `ss -tulpn | head` — listening sockets
- `dig example.com @resolver` — DNS sanity

## File permissions refresher
- `chmod u+rwx,g+rx,o-rwx file` — explicit mode
- `chown appuser:appgroup /srv/app` — ownership
- `setfacl -m u:deploy:rw /srv/app` — ACL for one user

## Troubleshooting checklist
1. Reproduce and timestamp the issue.
2. Check service status and logs.
3. Validate dependencies (network, disk, env vars).
4. Apply smallest safe change; capture the diff/command.
5. Re-test, roll back if needed, and document the fix.
