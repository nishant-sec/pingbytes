---
title: "Network Monitoring Quickstart"
description: "Low-friction ways to capture signals when debugging connectivity."
date: 2025-01-04
tags: ["networking", "monitoring"]
draft: false
---

## Layered approach
- **Connectivity:** `ping -c 3 target`, `Test-NetConnection` on Windows.
- **Path:** `mtr -rw target` for loss/latency trends.
- **Resolution:** `dig target` and `dig +trace target`.
- **Ports:** `nc -vz target 443` or `Test-NetConnection -Port 443`.

## Packet captures
- Linux: `sudo tcpdump -i eth0 host target -c 50 -w capture.pcap`
- Windows: use `pktmon` or Wireshark; limit duration and scope.
- Filter down to avoid load; always note timestamps and interfaces.

## Logs worth collecting
- Firewall/ACL hits (on both ends).
- Application timeouts or connection reset messages.
- Device CPU/Memory if drops correlate with load.

## Metrics to watch
- Latency, jitter, packet loss per hop.
- Connection attempts vs. accepts.
- TLS handshake failures vs. app-layer errors.

## Escalation template
1. Affected endpoint, protocol, and port.
2. Source/destination IPs and timestamps.
3. Trace route or MTR snapshot.
4. Packet capture excerpt or summary.
5. Recent changes in DNS, ACLs, or deployments.
