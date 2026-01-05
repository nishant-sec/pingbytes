---
title: "Incident Response Playbook Basics"
description: "A small, repeatable flow for triaging beginner-level alerts."
date: 2025-01-04
tags: ["security", "incident-response"]
draft: false
---

## Intake
- Confirm alert source, severity, and timestamp.
- Identify asset owner and business criticality.
- Check if there is an open change or maintenance window.

## Triage
- Validate the signal: find a second data point (log, metric, packet).
- Scope impact: users affected, systems touched, lateral movement signs.
- Preserve evidence: copy relevant logs and note hashes where possible.

## Containment
- Prefer reversible steps: disable accounts, isolate network segments, stop services with a rollback plan.
- Communicate what changed and why to stakeholders.

## Eradication and recovery
- Remove malicious artifacts (files, registry keys, scheduled tasks).
- Patch vulnerabilities or rotate credentials involved.
- Restore services and monitor closely for recurrence.

## Post-incident
- Write a brief timeline with UTC timestamps.
- List root cause (if known) or most probable cause.
- Capture lessons learned and follow-up tasks.
