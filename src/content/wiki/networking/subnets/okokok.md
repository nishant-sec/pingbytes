---
category: networking
title: "Subnettinggggggggggggggggggggggggggggggggggggg"
description: "CIDR math with examples to build muscle memory."
date: 2025-01-04
tags: ["networking", "subnetting"]
draft: false
---
##### Core DNS Components
**Domain Name System (DNS):** A hierarchical and decentralized naming system used to translate human-readable domain names (e.g., netflix.com) into machine-readable IP addresses (e.g., 142.250.x.x).

**Recursive Resolver (Recursive Server):** A DNS server, typically operated by an ISP or public provider (like 8.8.8.8), that accepts a query from a client and assumes the full responsibility of finding the answer by querying other DNS servers.

**Root Server (.):** A name server operating at the root of the DNS hierarchy. It does not resolve specific domain names but provides referrals to the appropriate Top-Level Domain (TLD) servers.

**TLD (Top-Level Domain) Server:** A DNS server responsible for managing all domains sharing a common top-level extension (e.g., .com, .org, .net). It directs queries to the Authoritative Name Server for the requested domain.

**Authoritative Name Server (NS):** A server that holds the definitive DNS records (the "zone file") for a specific domain. It provides the final, official answer to queries about that domain.

##### DNS Processes & Queries
**DNS Resolution:** The end-to-end process of translating a domain name into its corresponding IP address by querying the DNS hierarchy.

**Recursive Query:** A DNS query sent from a client to a Recursive Resolver, demanding a complete answer (either the IP address or an error). The resolver must perform all subsequent work.

**Iterative Query:** A DNS query, typically between servers, where the queried server provides the best answer it currently has, which is often a referral (a pointer) to the next server in the chain.

### DNS Zone File: The Data Container
All DNS data for a domain is stored in a plain text file called a DNS Zone File. This file is the authoritative source of information for that domain. It has a specific format:

**Directives:** Control settings for the file. They always start with a `$` sign.
- `$TTL` (Time To Live): Sets the default cache time for all records in the file that do not have an explicit TTL.
- `$ORIGIN`: Sets the base domain name (e.g., `example.com.`) that is appended to any non-qualified (relative) domain names.

**Comments:** Lines beginning with a semicolon (`;`) are ignored and used for human notes.

**Resource Records:** The actual data. They follow a standard syntax:
- `[name] [ttl] [class] [type] [data]`
- `name`: The hostname for the record (e.g., `www`, `ftp`).
- `ttl`: The explicit Time To Live (cache time) for this specific record. If blank, it uses the `$TTL` default.
- `class`: The "class" of the record. For all modern internet purposes, this is always `IN` (Internet).
- `type`: The type of DNS record (e.g., `A`, `MX`, `CNAME`).
- `data`: The actual value of the record (e.g., an IP address, a hostname).

##### Zone File Naming Shortcuts
- **The `@` Symbol:** A special shortcut that means "this domain itself." It is a placeholder for the current `$ORIGIN` value.
	- `$ORIGIN` sets the **base domain** → `gmail.com.`
	- `@` refers to **the current origin `$ORIGIN`** which is `gmail.com.` (so `@` = `gmail.com.`).

```
$ORIGIN gmail.com. // www.google.com.

@   IN  SOA  ns1.gmail.com. admin.gmail.com. (1 7200 3600 1209600 3600)
```

**Fully Qualified vs. Relative Names:**
- **Fully Qualified Domain Name (FQDN):** A name that ends with a final dot (e.g., `www.example.com.`). This is an absolute, complete address.
- **Relative Name:** A name that does not end with a dot (e.g., `www`). The DNS server automatically appends the `$ORIGIN` to it. (e.g., `www` becomes `www.example.com.`).

![[image-5.jpeg]]

**So how does DNS “know” about www?**
Example zone file:

```
$ORIGIN example.com.
@       IN A 192.0.2.1          ; example.com
www     IN A 192.0.2.2          ; www.example.com
mail    IN A 192.0.2.3          ; mail.example.com
```

**Here:**
- `@` means `$ORIGIN` → example.com.
- `www` and `mail` are relative names that DNS appends `$ORIGIN` to.
- So DNS “knows” about www because it’s declared there.
- If you remove the line for `www`, DNS simply won’t find it.

**Details:**
- `example.com` → **relative** (can be expanded)
- `example.com.` → **absolute / FQDN** (final form, nothing added)

### DNS Records: The Data Itself
Here are the definitions for the most common and important DNS record types, including many not in the diagram.
##### A Record (Address) 
The most fundamental record. It maps a hostname to a 32-bit IPv4 address.
- `www IN A 93.184.216.34`
##### AAAA Record (Quad-A)
The modern equivalent of the A record. It maps a hostname to a 128-bit IPv6 address.
- `www IN AAAA 2606:2800:220:1::c`
##### CNAME Record (Canonical Name)
Creates an alias for one name to another. It points a hostname to *another hostname*, never to an IP address. It's used to point `www.example.com` to `example.com`
- `www IN CNAME example.com.`

##### MX Record (Mail Exchange)
MX Record tells where **emails to your domain should be delivered** (to which server).

`@` = Refers current `$ORIGIN` domain which is `google.com.`

```bash
MX records for google.com (e.g., using Google Workspace)

@ IN MX 10 aspmx.l.google.com. // google.com. IN MX 10 aspmx.l.google.com. 
@ IN MX 20 alt1.aspmx.l.google.com.
@ IN MX 20 alt2.aspmx.l.google.com.

// Emails sent to `google.com` should be delivered to `alt1.aspmx.l.google.com` server, with priority 10.
```

**Priority:** You'll always see a number (e.g., 10, 20) next to an MX record. This is the priority. Servers will always try to deliver to the server with the lowest number first. If that server is down, they will try the next lowest (e.g., 20), which acts as a backup.

**It Must Point to a Hostname:** MX record cannot point to an IP address. It must point to a hostname (like mx1.google.com), which in turn must have an A or AAAA record that provides the actual IP address. If there is no MX record, then email sent to you bounces back with "Address unknown."

> **Important:** The MX record only _points to_ the mail servers (hosts) that run MTAs.

**Additional Details**
SPF verifies **who is allowed to _send_ mail for a domain**, not who is allowed to _receive_ it.
- **MX records** = where mail _is delivered_ (receiving servers).
- **SPF (TXT record)** = who’s allowed to _send_ mail on behalf of the domain.

```
📧 alice@abc.com (Outlook) → bob@xyz.com

Step 1: MUA (Outlook) → Compose email

Step 2: MUA → Submit to Sending MTA Server (mail.abc.com) via SMTP:587

Step 3a: Sending MTA (mail.abc.com) → Query DNS for MX records of xyz.com
         DNS returns: mail.xyz.com (priority 10) - hostname

Step 3b: Sending MTA → Query DNS for A record of mail.xyz.com
         DNS returns: 203.0.113.50 - IP address

Step 4: Sending MTA → Sign email with DKIM (d=abc.com, s=selector1) // Cant
        be seen in senders recieved header

Step 5: Sending MTA → Connect to Receiving MTA (203.0.113.50 / mail.xyz.com) via SMTP:25

Step 6: Receiving MTA (mail.xyz.com) → Performs SPF/DKIM/DMARC validation
        - SPF: Check sender IP against abc.com's SPF record
        - DKIM: Verify signature using abc.com's public key from DNS
        - DMARC: Check alignment and enforce policy

Step 7: Receiving MTA → Delivers to bob@xyz.com's mailbox
```
#### TXT Record (Text): The Who and What
The **TXT (Text)** record is a simple, flexible record that just holds text. For email, this "text" is machine-readable code that creates the three pillars of email authentication.
##### SPF (Sender Policy Framework)
Specifies which mail servers are authorized to send email on behalf of your domain.
Each domain has its own SPF record
- **Its Question:** "This email says it's from ceo@example.com, but it came from a random server (IP 1.2.3.4). Is that server allowed to send email for example.com?"
- **How it works:** The receiving server checks the TXT record for example.com's SPF policy. This policy is a list of all the IP addresses and domains that are authorized to send email on its behalf.
- The _connecting IP_ is **not fixed per email**, it’s **different at each MTA hop** in the mail’s journey.

**Example**: `@ IN TXT "v=spf1 include:_spf.google.com ~all"`
- **Translation:**
	- `v=spf1`: "This is an SPF record."
	- `include: spf.google.com`: Allow all servers listed in Google's SPF record (for Gmail/Workspace).
	- `~all`: "Soft Fail." If the email comes from anywhere else (all), mark it as suspicious but probably let it through (good for testing).
	- `-all`: "Hard Fail." This is the secure version. It means "If the email is from anywhere else, reject it.
	- When you add `include:_spf.google.com` to your SPF record, you are **trusting ALL the IP addresses** that Google publishes in their SPF infrastructure.

**Scenario 1: SPF Record Added (Legitimate Record with SPF)**
- **Step 1:** SPF Record Setup
	- ABC.com organization adds an SPF record to their public DNS with IP address 1.2.3.4 listed as `v=spf1 ip4:1.2.3.4 -all`
- **Step 2:** Email Sent with Headers
	- Bob@abc.com sends email to John@xyz.com. ABC.com's mail server processes it and adds headers with connecting IP 1.2.3.4 and return path Bob@abc.com.
- **Step 3:** Recipient Validates via SPF
	- XYZ.com's mail server receives the email, extracts domain "abc.com" from return path, and queries DNS for abc.com's SPF record.
- **Step 4:** SPF Check Pass
	- Recipient server retrieves SPF record, compares connecting IP `1.2.3.4` against authorized IPs, finds a match, and SPF validation passes.
- **Step 5:** Email Delivered
	- Email is delivered to John's inbox with spf=pass authentication header as a trusted, verified message.

**Scenario 2: SPF Limitation - Email Forwarding**
- **Step 1: Email Forwarded** [John@xyz.com](mailto:John@xyz.com) forwards the email to [Alice@external.com](mailto:Alice@external.com). XYZ.com's server processes it with XYZ.com's IP as connecting IP, but return path remains [Bob@abc.com](mailto:Bob@abc.com).
- **Step 2: SPF Check Fails on Forward** External.com's server queries abc.com's SPF record, compares XYZ.com's forwarding server IP against authorized IPs, finds no match, and SPF validation fails.
- **Step 3: SPF Forwarding Limitation** SPF breaks on forwarded emails because the forwarding server's IP is not in the original sender's SPF record. This is a known SPF weakness.

- **SPF Process Diagram**:
	- ![[image-1.jpeg|580x877]]

##### DKIM (DomainKeys Identified Mail) (The Tamper-Proof Seal)
DKIM ensure emails are not altered during transmission between source and destination.
- **Its Question:** "Was this email actually written by example.com? And, more importantly, has anyone changed it in transit?"
- **How it works:** This is a cryptographic signature.
	- **Sending Server:** Your outbound MTA mail server (e.g., Google) creates a unique hash based on mails content and header and uses a private key to encrypt it. This signature is added to the email as a header.
	- **DNS (TXT Record):** You publish the matching public key in a special TXT record.
	- **Receiving Server:** It fetches the public key from your DNS, finds the signature in the email, and does the math.
	- **Result:** If the signature is valid, it proves two things: 1) The email definitely came from a server with your private key, and 2) Not a single word or header was altered in transit.
- **Example:** `google._domainkey IN TXT "v=DKIM1; k=rsa; p=MIIBIjANBg...[a very long public key]...AQAB"`
- **DKIM Authentication Diagram:**
	- ![[image-2.jpeg]]


**How DKIM Works**
As soon as an email is sent from the sending server, DKIM signs that email using a private key. The private key is securely stored on Microsoft servers, and all emails sent from that organization are digitally signed using this private key. DKIM adds digital signatures within the email header, and even if the email is forwarded to a different organization, the signatures are preserved within the email header.

**Advantage Over SPF**
If emails are forwarded to external users, SPF fails because the return path value changes and the SPF check is performed against the domain who forwarded that email. However, DKIM signatures remain intact in the email header regardless of forwarding.

**DNS Configuration**
To enable DKIM for a domain, we add two CNAME records in public DNS. Microsoft uses two selectors (selector1 and selector2) for key rotation and redundancy purposes - this allows seamless key updates without service interruption. These CNAME records are used as a public key by recipient email servers to verify if the email's body hasn't changed during transmission.

**Validation Process**
When an organization like abc.com sends an email to xyz.com, the email is digitally signed during the sending process. The xyz.com email server extracts the DKIM signatures from the email header and reaches the public DNS to retrieve the public key published by abc.com domain. Once the recipient server has the public key, it validates the email using this key. If email validation is successful, DKIM passes and the email is treated as authentic. If the email was altered during transmission, DKIM fails.

##### DKIM vs SPF Trust Model - 4 Key Points
1. **SPF = Shared IP Pool**: When you include `_spf.google.com`, you trust ALL of Google's mail server IPs (hundreds of addresses shared across all Google Workspace customers)
2. **DKIM = Unique Cryptographic Keys**: Each domain gets its own unique private/public key pair - `shopping.com` and `coco.com` both use Google SPF records but have completely different DKIM keys
3. **SPF Limitation**: Multiple domains using Google share the same authorized IP ranges, so IP-based authentication alone is less secure
4. **DKIM Security**: Cryptographic signatures are domain-specific and unforgeable - you cannot sign emails for `shopping.com` without `shopping.com`'s private key, even if you're using the same email provider

**TL;DR**: SPF trusts infrastructure (broad), DKIM trusts cryptography (narrow & secure) 🔐
##### DMARC (Domain-based Message Authentication) (The Boss Policy)
DMARC helps recipient email servers determine what action they should take on emails if SPF or DKIM checks fail. DMARC works with SPF and DKIM.

- **Name:** DMARC (Domain-based Message Authentication, Reporting, and Conformance)
- **Its Question:** "OK, I've checked SPF and DKIM. As the receiving server, what should I do if one of them fails? And who should I send the incident report to?"
- **How it works:** DMARC is the final policy that enforces SPF and DKIM.
	- **Example:** `_dmarc IN TXT "v=DMARC1; p=reject; rua=mailto:reports@example.com"`
	- **Translation:**
		- `v=DMARC1`: "This is a DMARC record."
		- `p=reject`: "My policy is reject. If an email claims to be from me and fails both SPF and DKIM, drop it. Do not deliver it."
		- `rua=mailto...`: "Send aggregate reports of all the email (good and bad) you see from my domain to this email address."
- **DMAR Process Diagram:**
	- ![[image-3.jpeg]]

**Prerequisites**
Before you enable DMARC for your domains, you must have SPF and DKIM records published for that domain.

**How DMARC Works**
When abc.com sends an email to xyz.com, the xyz.com email server performs validation checks to determine if the email is legitimate.

> **Alignment** = comparing the domain in the `From:` header with the domain used in SPF or DKIM.

**SPF Alignment Check**
The recipient server extracts the domain name from the `Return-Path`, then extracts the domain name from the `From` address and matches both domain names. This is called SPF alignment. If both domain names match, SPF passes. If domain names do not match, SPF fails.

**Example:**

```
From: alice@abc.com
Return-Path: bounce@abc.com
Match: abc.com = abc.com → ✅ SPF Alignment PASS

From: alice@abc.com
Return-Path: forwarded@forwarder.com
Match: abc.com ≠ forwarder.com → ❌ SPF Alignment  FAIL

Alignment types (per DMARC) & it decide how closely those domains must match.
1. Relaxed (aspf=r) 
Subdomains are allowed (mail.abc.com aligns with abc.com ✅)

2. Strict (aspf=s)	 
Must match exactly (mail.abc.com ≠ abc.com ❌)
```

It only matters if:
- Your sending domain uses **subdomains** (e.g., `mail.abc.com`, `marketing.abc.com`, etc.), **and**
- Your “From” address uses the **parent domain** (`abc.com`).
If you always send from the same exact domain (no subdomains), alignment type doesn’t really affect you, both strict and relaxed will pass.

**DKIM Alignment Check**
If SPF alignment fails, the recipient server checks DKIM validation. The recipient server checks the domain name within the `d = attribute` (found within DKIM signatures, indicating which domain signed the email) and matches it with the domain name from the `From` address. If both domain names match, DKIM passes, else DKIM fails.

**Example:**

```
From: alice@abc.com
DKIM d=: abc.com
Match: abc.com = abc.com → ✅ DKIM PASS
```

**DMARC Pass Requirement**
DMARC requires only **one ALIGNED pass** (either SPF or DKIM).

| SPF Alignment | DKIM Alignment | DMARC Result |
| ------------- | -------------- | ------------ |
| ✅ PASS        | ✅ PASS         | ✅ **PASS**   |
| ✅ PASS        | ❌ FAIL         | ✅ **PASS**   |
| ❌ FAIL        | ✅ PASS         | ✅ **PASS**   |
| ❌ FAIL        | ❌ FAIL         | ❌ **FAIL**   |

**DMARC Policy Enforcement**
If both SPF and DKIM checks fail, the recipient server treats the email as per the action specified by the sending server within the DMARC records.

|Policy|Action|
|---|---|
|`p=none`|Monitor only, no action on failures|
|`p=quarantine`|Move failed emails to spam|
|`p=reject`|Block failed emails entirely|

**Example DMARC Record:**

```
_dmarc.abc.com  IN  TXT  "v=DMARC1; p=reject; rua=mailto:dmarc@abc.com"
```
##### Authoritative & Structural Records
**SOA Record (Start of Authority):** This record is mandatory in every zone file. It declares that this server is the authoritative source for the domain and contains critical administrative information such as:
- `MNAME`: The primary name server for the zone.
- `RNAME`: The email address of the administrator (with the `@` replaced by a dot).
- `Serial`: The version number of the zone file.
- `Refresh`: How long a secondary server waits before checking for updates.
- `Retry`: How long a secondary server waits before retrying a failed update.
- `Expire`: How long a secondary server will keep using its old data if it can't reach the primary.
- `Minimum TTL`: The time used to cache negative results (i.e., "this record does not exist").

**NS Record (Name Server):** Delegates a DNS zone to a specific authoritative name server. This is the record that "points" a domain to the servers that hold its DNS records.
- `@ IN NS ns1.nameserver.com.`
- `@ IN NS ns2.nameserver.com.`

**PTR Record (Pointer):** The opposite of an A record. It maps an IP address back to a hostname. This is used for reverse DNS lookups, often for spam filtering and network troubleshooting.
- `34.216.184.93.in-addr.arpa. IN PTR server.example.com`

##### Service & Security Records
**SRV Record (Service):** Locates specific services. It's more detailed than an MX record and specifies a service (e.g., `_sip`), protocol (e.g., `_tcp`), priority, weight, port, and target hostname. It is heavily used by protocols like VOIP (SIP) and instant messaging (XMPP).
- `_sip._tcp IN SRV 10 5 5060 sipserver.example.com.`

**CAA Record (Certification Authority Authorization):** A security record that specifies which Certificate Authorities (CAs) are permitted to issue SSL/TLS certificates for the domain.
- `@ IN CAA 0 issue "letsencrypt.org"`

**DNSSEC Records (DNSKEY, DS, RRSIG, NSEC):** A suite of records used to cryptographically sign a DNS zone, ensuring that the data received by a user is authentic and has not been tampered with (i.e., preventing DNS spoofing).

## Mermaid Code for DMIK

```bash
---
config:
  theme: redux-dark
  layout: elk
---
flowchart TD
 subgraph SenderLane["🧑 SENDER: alice(at)abc.com"]
    direction TB
        S1["📝 Compose Email<br>To: bob(at)xyz.com"]
        S2["📤 Submit SMTP:587"]
  end
 subgraph SendMTALane["📮 SENDING MTA: mail.abc.com"]
    direction TB
        MTAReceive["📨 Receive & Queue"]
        MTARequest["🔐 Request DKIM Signing<br>Domain: abc.com | Selector: selector1"]
        MTAAddHeader["✍️ Add DKIM-Signature<br>v=1, a=rsa-sha256, d=abc.com, s=selector1"]
        MTASend["📨 Send SMTP:25 → xyz.com"]
  end
 subgraph KeyLane["🔑 PRIVATE KEY STORAGE"]
    direction TB
        KeyRetrieve["🛡️ Retrieve Private Key<br>2048-bit RSA"]
        KeyHash["#️⃣ Generate Hash (SHA-256)<br>Headers: from, to, subject, date<br>Body: canonicalized content"]
        KeySign["✍️ Sign with Private Key<br>Create Digital Signature"]
        KeyReturn["📤 Return Signature"]
  end
 subgraph RecvMTALane["📬 RECEIVING MTA: mail.xyz.com"]
    direction TB
        RecvMTAReceive["📨 Receive Email"]
        RecvMTAParse["🔍 Parse DKIM Header<br>Extract: domain, selector, signature"]
        RecvMTAQueryDNS["🌐 DNS Query<br>selector1._domainkey.abc.com"]
        RecvMTARecompute["#️⃣ Recompute Body Hash<br>SHA-256"]
        RecvMTACompare{"⚖️ Compare Body Hashes"}
        RecvBodyFail["❌ DKIM FAIL<br>Body Altered<br>Reject/Quarantine"]
        RecvBodyPass["✅ Body Verified"]
        RecvMTAVerifySig{"🔐 Verify Signature<br>with Public Key"}
        RecvSigFail["❌ DKIM FAIL<br>Invalid Signature<br>Mark Suspicious"]
        RecvSigPass["✅ DKIM PASS<br>Authenticated"]
        RecvMTAAddAuth["📋 Add Auth-Results<br>dkim=pass"]
        RecvMTADeliver["✉️ Deliver to bob(at)xyz.com"]
  end
 subgraph DNSLane["🌐 DNS: abc.com zone<br>📝 2 CNAME Records: selector1 &amp; selector2"]
    direction TB
        DNSQuery["🔍 TXT Lookup<br>selector1._domainkey.abc.com"]
        DNSReturn["📤 Return Public Key<br>v=DKIM1, k=rsa, p=..."]
  end
 subgraph InboxLane["📥 INBOX: bob(at)xyz.com"]
    direction TB
        Inbox["✅ Email Delivered<br>DKIM: PASS ✓"]
  end
    S1 --> S2
    S2 --> MTAReceive
    MTAReceive --> MTARequest
    MTARequest --> KeyRetrieve
    KeyRetrieve --> KeyHash
    KeyHash --> KeySign
    KeySign --> KeyReturn
    KeyReturn --> MTAAddHeader
    MTAAddHeader --> MTASend
    MTASend --> RecvMTAReceive
    RecvMTAReceive --> RecvMTAParse
    RecvMTAParse --> RecvMTAQueryDNS
    RecvMTAQueryDNS --> DNSQuery
    DNSQuery --> DNSReturn
    DNSReturn --> RecvMTARecompute
    RecvMTARecompute --> RecvMTACompare
    RecvMTACompare -- ❌ Mismatch --> RecvBodyFail
    RecvMTACompare -- ✅ Match --> RecvBodyPass
    RecvBodyPass --> RecvMTAVerifySig
    RecvMTAVerifySig -- ❌ Invalid --> RecvSigFail
    RecvMTAVerifySig -- ✅ Valid --> RecvSigPass
    RecvSigPass --> RecvMTAAddAuth
    RecvMTAAddAuth --> RecvMTADeliver
    RecvMTADeliver --> Inbox
    RecvBodyFail -. Rejected .-> End1["⛔ Blocked"]
    RecvSigFail -. Quarantined .-> End2["⚠️ Quarantined"]
     S1:::senderStyle
     S2:::senderStyle
     MTAReceive:::mtaStyle
     MTARequest:::mtaStyle
     MTAAddHeader:::mtaStyle
     MTASend:::mtaStyle
     KeyRetrieve:::keyStyle
     KeyHash:::keyStyle
     KeySign:::keyStyle
     KeyReturn:::keyStyle
     RecvMTAReceive:::mtaStyle
     RecvMTAParse:::mtaStyle
     RecvMTAQueryDNS:::mtaStyle
     RecvMTARecompute:::mtaStyle
     RecvMTACompare:::processStyle
     RecvBodyFail:::failStyle
     RecvBodyPass:::successStyle
     RecvMTAVerifySig:::processStyle
     RecvSigFail:::failStyle
     RecvSigPass:::successStyle
     RecvMTAAddAuth:::mtaStyle
     RecvMTADeliver:::mtaStyle
     DNSQuery:::dnsStyle
     DNSReturn:::dnsStyle
     Inbox:::successStyle
     End1:::failStyle
     End2:::failStyle

```

### Mermaid Code for DMARC

```bash

```





