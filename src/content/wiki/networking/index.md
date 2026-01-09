---
category: networking
title: "Networking Fundamentals"
description: "Subnetting, routing, and monitoring workflows for on-call triage."
date: 2025-01-04
tags: ["networking"]
draft: false
---
## Overview
Use this folder to explore network basics with enough length to exercise the wiki navigation. The nested folders cover subnetting practice and lightweight monitoring.

### What’s inside
- `subnets/subnetting-guide` — CIDR math walkthroughs.
- `monitoring/network-monitoring` — Quick checks and packet samples.

## Quick reference
- `ipcalc 10.10.12.0/23` — visualize a block
- `traceroute` / `mtr` — path checks
- `dig +trace example.com` — DNS path

## Baseline checklist
1. Confirm IP/gateway/DNS on the host.
2. Test path to dependency endpoints.
3. Check ACLs/firewall rules on both sides.
4. Inspect recent network changes.






