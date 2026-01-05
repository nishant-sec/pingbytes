---
title: "CLI Essentials"
description: "Navigation, file operations, process inspection, and networking commands you’ll use every day."
date: 2025-01-04
tags: ["linux", "cli"]
draft: false
---

## Navigation and files
- `pwd` — show working directory
- `ls -lha` — list with permissions and sizes
- `cd -` — toggle between last two directories
- `find . -maxdepth 2 -type f -name '*.log'` — locate logs quickly
- `du -sh ./* | sort -h` — see directory sizes

## Editing safely
- `sudo cp file{,.bak}` — make a quick backup
- `sudo tee /etc/app/config.yaml <<'EOF' ... EOF` — safe overwrite
- `sudoedit /etc/app/config.yaml` — respect sudoers editor

## Processes and resources
- `ps -eo pid,ppid,%cpu,%mem,cmd --sort=-%cpu | head` — hot processes
- `top`/`htop` — live view
- `free -h` — memory snapshot
- `uptime` — load averages
- `journalctl -f -u app.service` — follow service logs

## Networking
- `ip a` / `ip r` — addresses and routes
- `ss -tulpn | head` — listening sockets
- `curl -v http://127.0.0.1:8080/health` — local health check
- `traceroute` / `mtr` — path checks
- `tcpdump -i eth0 port 443 -c 20` — capture samples (requires sudo)

## Compression and archives
- `tar -czf backup.tar.gz /srv/app` — create archive
- `tar -xzf backup.tar.gz -C /restore` — extract
- `zip -r files.zip dir/` — zip directory

## Quality-of-life aliases (examples)
```bash
alias ll='ls -lha --group-directories-first'
alias cls='clear && printf "\\033c"'
alias ktop='kubectl top pod'
```
