---
title: "Security Hardening Checklist"
description: "Baseline controls for servers and workstations to reduce common risks."
date: 2025-01-04
tags: ["windows", "security"]
draft: false
---

## Accounts and access
- Enforce strong password policy and lockout thresholds.
- Disable or rename the built-in Administrator account when possible.
- Use LAPS for local admin password rotation.
- Require MFA for remote access paths (RDP/VPN).

## Services and protocols
- Disable legacy protocols (SMBv1, TLS 1.0/1.1).
- Restrict RDP to jump hosts; enable NLA.
- Review auto-start services: `Get-Service | Where-Object {$_.StartType -eq 'Automatic'}`

## Patching
- Configure Windows Update for automatic security updates.
- Track WSUS/SCCM compliance for servers.

## Logging and auditing
- Enable PowerShell transcription and module logging.
- Collect logs centrally (Sentinel, Splunk, ELK).
- Audit logon events, account changes, and object access.

## Endpoint protection
- Ensure Defender or EDR agent is installed and healthy.
- Confirm real-time protection and cloud-based protection are on.
- Run `Get-MpComputerStatus` for quick health check.

## Network
- Use host firewalls with allow-lists.
- Limit inbound rules to required ports and subnets.
- Enable DNS logging for investigative context.
