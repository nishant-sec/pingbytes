---
title: "Subnetting Guide"
description: "CIDR math with examples to build muscle memory."
date: 2025-01-04
tags: ["networking", "subnetting"]
draft: false
---

## Core concepts
- CIDR notation expresses network/prefix length (e.g., `/24`).
- Borrow bits from host portion to create smaller subnets.
- Network = base address AND mask; broadcast = base OR inverted mask.

## Example: split a /24 into four /26s
- Base block: `192.168.10.0/24`
- New mask: `/26` -> 255.255.255.192
- Subnets:
  - `192.168.10.0/26` (hosts .1–.62)
  - `192.168.10.64/26` (hosts .65–.126)
  - `192.168.10.128/26` (hosts .129–.190)
  - `192.168.10.192/26` (hosts .193–.254)

## Quick math steps
1. Determine block size: `256 - last_octet_of_mask` (for IPv4).
2. Walk the block size to enumerate ranges.
3. Keep network and broadcast reserved; others are usable.

## IPv6 reminder
- No broadcasts; use solicited-node multicast.
- Subnet on nibble boundaries when possible (e.g., /56 -> /60 -> /64).

## Practice drill
- Carve `10.20.0.0/22` into /24s. Answer: `.0/24`, `.1/24`, `.2/24`, `.3/24`.
- Carve `172.16.32.0/20` into /22s. Answer increments by 4 in the third octet.
