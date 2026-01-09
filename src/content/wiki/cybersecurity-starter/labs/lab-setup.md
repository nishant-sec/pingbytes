---
category: security
title: "Lab Setup"
description: "Build a small home lab for safe practice with logging and attacks."
date: 2025-01-04
tags: ["security", "labs"]
draft: false
---
## Lab goals
- Isolated playground to avoid touching production.
- Repeatable builds using snapshots.
- Centralized logging so you can review actions later.

## Minimal topology
- 1x attacker VM (Kali or similar).
- 1x target VM (Windows or Linux) with vulnerable services.
- 1x logger (ELK, Wazuh, or Zeek) on a bridged or internal network.

## Build steps
1. Create an internal-only network in your hypervisor.
2. Install the attacker VM and update packages.
3. Install the target VM; enable SSH/RDP and a sample web app.
4. Deploy the logger; configure syslog/Winlogbeat/Filebeat to ingest.
5. Snapshot all VMs before testing.

### Minimal topology
- 1x attacker VM (Kali or similar).
- 1x target VM (Windows or Linux) with vulnerable services.
- 1x logger (ELK, Wazuh, or Zeek) on a bridged or internal network.

## Safety checks
- Keep host-only networking unless you need internet for updates.
- Rate-limit or firewall outbound traffic from the lab.
- Change default creds on all images.

## Exercises
- Capture a login attempt in the logs and find it by timestamp.
- Run a simple Nmap scan and observe alerts in your logger.
- Practice restoring from a snapshot after making changes.

## Lab goals
- Isolated playground to avoid touching production.
- Repeatable builds using snapshots.
- Centralized logging so you can review actions later.

## Minimal topology
- 1x attacker VM (Kali or similar).
- 1x target VM (Windows or Linux) with vulnerable services.
- 1x logger (ELK, Wazuh, or Zeek) on a bridged or internal network.

## Build steps
1. Create an internal-only network in your hypervisor.
2. Install the attacker VM and update packages.
3. Install the target VM; enable SSH/RDP and a sample web app.
4. Deploy the logger; configure syslog/Winlogbeat/Filebeat to ingest.
5. Snapshot all VMs before testing.

### Minimal topology
- 1x attacker VM (Kali or similar).
- 1x target VM (Windows or Linux) with vulnerable services.
- 1x logger (ELK, Wazuh, or Zeek) on a bridged or internal network.

## Safety checks
- Keep host-only networking unless you need internet for updates.
- Rate-limit or firewall outbound traffic from the lab.
- Change default creds on all images.

## Lab goals
- Isolated playground to avoid touching production.
- Repeatable builds using snapshots.
- Centralized logging so you can review actions later.

## Minimal topology
- 1x attacker VM (Kali or similar).
- 1x target VM (Windows or Linux) with vulnerable services.
- 1x logger (ELK, Wazuh, or Zeek) on a bridged or internal network.

## Build steps
1. Create an internal-only network in your hypervisor.
2. Install the attacker VM and update packages.
3. Install the target VM; enable SSH/RDP and a sample web app.
4. Deploy the logger; configure syslog/Winlogbeat/Filebeat to ingest.
5. Snapshot all VMs before testing.

### Minimal topology
- 1x attacker VM (Kali or similar).
- 1x target VM (Windows or Linux) with vulnerable services.
- 1x logger (ELK, Wazuh, or Zeek) on a bridged or internal network.

## Safety checks
- Keep host-only networking unless you need internet for updates.
- Rate-limit or firewall outbound traffic from the lab.
- Change default creds on all images.

## Lab goals
- Isolated playground to avoid touching production.
- Repeatable builds using snapshots.
- Centralized logging so you can review actions later.

## Minimal topology
- 1x attacker VM (Kali or similar).
- 1x target VM (Windows or Linux) with vulnerable services.
- 1x logger (ELK, Wazuh, or Zeek) on a bridged or internal network.

## Build steps
1. Create an internal-only network in your hypervisor.
2. Install the attacker VM and update packages.
3. Install the target VM; enable SSH/RDP and a sample web app.
4. Deploy the logger; configure syslog/Winlogbeat/Filebeat to ingest.
5. Snapshot all VMs before testing.

### Minimal topology
- 1x attacker VM (Kali or similar).
- 1x target VM (Windows or Linux) with vulnerable services.
- 1x logger (ELK, Wazuh, or Zeek) on a bridged or internal network.

## Safety checks
- Keep host-only networking unless you need internet for updates.
- Rate-limit or firewall outbound traffic from the lab.
- Change default creds on all images.

## Lab goals
- Isolated playground to avoid touching production.
- Repeatable builds using snapshots.
- Centralized logging so you can review actions later.

## Minimal topology
- 1x attacker VM (Kali or similar).
- 1x target VM (Windows or Linux) with vulnerable services.
- 1x logger (ELK, Wazuh, or Zeek) on a bridged or internal network.

## Build steps
1. Create an internal-only network in your hypervisor.
2. Install the attacker VM and update packages.
3. Install the target VM; enable SSH/RDP and a sample web app.
4. Deploy the logger; configure syslog/Winlogbeat/Filebeat to ingest.
5. Snapshot all VMs before testing.

### Minimal topology
- 1x attacker VM (Kali or similar).
- 1x target VM (Windows or Linux) with vulnerable services.
- 1x logger (ELK, Wazuh, or Zeek) on a bridged or internal network.

## Safety checks
- Keep host-only networking unless you need internet for updates.
- Rate-limit or firewall outbound traffic from the lab.
- Change default creds on all images.

## Lab goals
- Isolated playground to avoid touching production.
- Repeatable builds using snapshots.
- Centralized logging so you can review actions later.

## Minimal topology
- 1x attacker VM (Kali or similar).
- 1x target VM (Windows or Linux) with vulnerable services.
- 1x logger (ELK, Wazuh, or Zeek) on a bridged or internal network.

## Build steps
1. Create an internal-only network in your hypervisor.
2. Install the attacker VM and update packages.
3. Install the target VM; enable SSH/RDP and a sample web app.
4. Deploy the logger; configure syslog/Winlogbeat/Filebeat to ingest.
5. Snapshot all VMs before testing.

### Minimal topology
- 1x attacker VM (Kali or similar).
- 1x target VM (Windows or Linux) with vulnerable services.
- 1x logger (ELK, Wazuh, or Zeek) on a bridged or internal network.

## Safety checks
- Keep host-only networking unless you need internet for updates.
- Rate-limit or firewall outbound traffic from the lab.
- Change default creds on all images.

## Lab goals
- Isolated playground to avoid touching production.
- Repeatable builds using snapshots.
- Centralized logging so you can review actions later.

## Minimal topology
- 1x attacker VM (Kali or similar).
- 1x target VM (Windows or Linux) with vulnerable services.
- 1x logger (ELK, Wazuh, or Zeek) on a bridged or internal network.

## Build steps
1. Create an internal-only network in your hypervisor.
2. Install the attacker VM and update packages.
3. Install the target VM; enable SSH/RDP and a sample web app.
4. Deploy the logger; configure syslog/Winlogbeat/Filebeat to ingest.
5. Snapshot all VMs before testing.

### Minimal topology
- 1x attacker VM (Kali or similar).
- 1x target VM (Windows or Linux) with vulnerable services.
- 1x logger (ELK, Wazuh, or Zeek) on a bridged or internal network.

## Safety checks
- Keep host-only networking unless you need internet for updates.
- Rate-limit or firewall outbound traffic from the lab.
- Change default creds on all images.






