---
title: 'Subnetting Basics'
description: 'Understanding the fundamentals of IP subnetting and binary math.'
date: 2024-01-15
order: 1
tags: ['networking', 'ip', 'basics']
authors: ['nishant']
---

## What is an IP Address?

An IP address is a unique address that identifies a device on the internet. IP stands for "Internet Protocol," which is the set of rules governing the format of data sent via the internet or local network.

### Binary Representation

Computers communicate in binary. An IP address like `192.168.1.1` is actually just a human-readable representation of 32 binary bits.

| Octet 1 | Octet 2 | Octet 3 | Octet 4 |
| :---: | :---: | :---: | :---: |
| 192 | 168 | 1 | 1 |
| 11000000 | 10101000 | 00000001 | 00000001 |

## The Subnet Mask

A subnet mask is used to divide an IP address into two parts. One part identifies the host (computer), the other part identifies the network to which it belongs.