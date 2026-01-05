---
title: "PowerShell Automation"
description: "Remoting, scripting hygiene, and transcript logging for repeatable Windows operations."
date: 2025-01-04
tags: ["windows", "powershell", "automation"]
draft: false
---

## Remoting basics
- Enable: `Enable-PSRemoting -Force`
- Test: `Enter-PSSession -ComputerName server1`
- Non-domain auth: use `New-PSSessionOption -SkipCACheck -SkipCNCheck -NoEncryption` only in labs.

## Scripting hygiene
- Add `Set-StrictMode -Version Latest` to catch typos.
- Use `param()` blocks and `CmdletBinding()` for clarity.
- Prefer `Write-Verbose` and `Write-Error` over `Write-Host`.
- Validate inputs with `ValidateSet`, `ValidatePattern`, or `ValidateRange`.

## Logging and transcripts
- `Start-Transcript -Path C:\Logs\script.log -Append`
- `Stop-Transcript` when done.
- Use `-Verbose` on `Invoke-Command` to capture detail.

## Secure secrets
- `Get-Credential` for interactive prompts.
- `ConvertFrom-SecureString | Set-Content` for local secure storage.
- Use `Microsoft.PowerShell.SecretManagement` with vault extensions in production.

## Example: restart a flaky service on several hosts
```powershell
$servers = 'app01','app02','app03'
$svc = 'Spooler'

Invoke-Command -ComputerName $servers -ScriptBlock {
  param($svc)
  $svcObj = Get-Service -Name $svc -ErrorAction Stop
  Restart-Service -InputObject $svcObj -Force
  $svcObj.Status
} -ArgumentList $svc -Verbose
```
