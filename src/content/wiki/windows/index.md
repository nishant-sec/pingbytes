---
category: windows
title: "Windows Operations Hub"
description: "Admin tips for PowerShell, services, and security hardening on Windows hosts."
date: 2025-01-04
draft: true
---
## Overview
This hub tracks common Windows operations tasks with two nested folders: automation via PowerShell and baseline hardening. Use it to check how the navigation tree behaves with deeper folders.

### What’s inside
- `powershell/automation` — Scripts, remoting, and logging.
- `security/hardening` — Baseline controls and quick checks.

## Quick checks
- `systeminfo | findstr /B /C:"OS Name" /C:"OS Version"`
- `Get-ComputerInfo | Select-Object CsName, WindowsProductName, WindowsVersion`
- `Get-Service | Sort-Object Status, DisplayName | Select-Object -First 10`
- `Get-EventLog -LogName System -Newest 20`

## Disk and network
- `Get-Volume | Sort-Object DriveLetter`
- `Get-NetIPAddress | Where-Object {$_.AddressFamily -eq "IPv4"}`
- `Test-NetConnection -ComputerName example.com -Port 443`

## Service triage
- `Get-Service -Name *app*`
- `Get-WinEvent -LogName Application -MaxEvents 20 | Where-Object { $_.LevelDisplayName -in "Error","Warning" }`

## Recovery steps
1. Capture error message and Event IDs.
2. Validate service account permissions.
3. Check recent Windows Updates or GPO changes.
4. Test restart and confirm dependent services.
5. Document the findings and remediation.






