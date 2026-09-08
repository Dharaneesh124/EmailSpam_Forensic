import { EmailIncident } from '../types';

export const SAMPLE_INCIDENTS: EmailIncident[] = [
  {
    id: 'inc-2026-8801',
    caseNumber: 'CASE-BEC-0982',
    subject: 'URGENT: Confidential Project Titan Acquisition Settlement - Wire Transfer Authorization',
    senderDisplay: 'David Sterling - Chief Executive Officer',
    senderAddress: 'david.sterling@acme-enterprises.corp-settlement.com',
    recipientAddress: 'cfo-office@acme-global.com',
    receivedAt: '2026-09-04T22:45:12Z',
    threatSeverity: 'critical',
    fraudScore: 97,
    classification: 'BEC_Fraud',
    status: 'quarantined',
    bodyText: `Arthur,

I am currently in an offsite closed-door executive arbitration regarding the Project Titan international asset acquisition. Due to non-disclosure restrictions, do not mention this through regular company chat.

We need to release the earnest escrow deposit of $482,500.00 USD immediately before 4:00 PM EST to secure the priority closing, otherwise penalties will apply under the Delaware covenant.

Wire Instructions:
Bank Name: Baltic Maritime Commercial Bank LLC
Beneficiary: Titan Capital Escrow Special Holdings
IBAN: LT89 3250 0124 9912 8841
Swift/BIC: BMCBLT2X
Amount: $482,500.00 USD
Reference: Escrow Deposit TX-9941-Titan

Send me the confirmed SWIFT MT103 wire receipt as soon as executed. I will be reachable via this priority email channel between sessions.

Regards,
David Sterling
Chief Executive Officer
Acme Global Holdings`,
    rawHeaders: `Received: from mail-relay-04.sec-gateway.net (mail-relay-04.sec-gateway.net [185.220.101.44])
    by mx.acme-global.com (Postfix) with ESMTPS id 4Z9Q8w1nNkz8yT
    for <cfo-office@acme-global.com>; Fri, 04 Sep 2026 22:45:12 +0000 (UTC)
Received: from vps-bulletproof-host.ru (vps-bulletproof-host.ru [194.26.29.118])
    by mail-relay-04.sec-gateway.net (Postfix) with ESMTP id 88A1B49902
    for <cfo-office@acme-global.com>; Fri, 04 Sep 2026 22:44:58 +0000 (UTC)
Received: from [102.89.23.14] (helo=win-desktop-bot.local)
    by vps-bulletproof-host.ru with esmtpsa (TLS1.2:ECDHE-RSA-AES256-GCM-SHA384:256)
    (Exim 4.94) (envelope-from <return-bounce@corp-settlement.com>)
    id 1sm829-0004xJ-9L; Fri, 04 Sep 2026 22:44:20 +0000
Authentication-Results: mx.acme-global.com;
    dkim=fail (bad signature) header.d=acme-enterprises.corp-settlement.com;
    spf=fail (sender IP 194.26.29.118 is not permitted by domain acme-global.com);
    dmarc=fail (p=reject dis=quarantine) header.from=acme-enterprises.corp-settlement.com
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
    d=acme-enterprises.corp-settlement.com; s=mail2026;
    h=From:To:Subject:Date:Message-ID:Reply-To;
    bh=wXq+5U8z99fklmN+1q40A9zFvLL21=;
    b=kQ92/xPP191mZ...[forged signature]
From: "David Sterling - Chief Executive Officer" <david.sterling@acme-enterprises.corp-settlement.com>
To: <cfo-office@acme-global.com>
Reply-To: "Executive Special Desk" <d.sterling.exec-desk@protonmail-portal-crypto.com>
Return-Path: <bounce-daemon@offshore-routing-node.org>
Subject: URGENT: Confidential Project Titan Acquisition Settlement - Wire Transfer Authorization
Date: Fri, 04 Sep 2026 22:44:11 +0000
Message-ID: <20260904224411.898127391823@win-desktop-bot.local>
X-Mailer: Microsoft Outlook 16.0 (Forged Custom Mailer)`,
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    sha1: '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8',
    md5: '098f6bcd4621d373cade4e832627b4f6',
    protocols: {
      spf: {
        status: 'fail',
        domain: 'acme-enterprises.corp-settlement.com',
        clientIp: '194.26.29.118',
        record: 'v=spf1 -all',
        aligned: false,
        explanation: 'Sending IP is completely unauthorized. Failed hard SPF check (-all).'
      },
      dkim: {
        status: 'fail',
        domain: 'acme-enterprises.corp-settlement.com',
        selector: 'mail2026',
        signatureHeaderValid: false,
        bodyHashValid: false,
        aligned: false,
        explanation: 'Forged DKIM signature header failed cryptographic validation against DNS public key.'
      },
      dmarc: {
        status: 'fail',
        policy: 'reject',
        alignment: 'unaligned',
        disposition: 'quarantine',
        explanation: 'DMARC alignment failed for organizational domain acme-global.com. Policy disposition enforced quarantine.'
      },
      returnPathMatch: false,
      returnPath: 'bounce-daemon@offshore-routing-node.org',
      fromHeader: 'david.sterling@acme-enterprises.corp-settlement.com',
      replyToHeader: 'd.sterling.exec-desk@protonmail-portal-crypto.com',
      replyToMismatch: true,
      messageIdAnomaly: true,
      messageId: '<20260904224411.898127391823@win-desktop-bot.local>',
      tlsVersion: 'TLSv1.2 (Outdated cipher suite)',
      cipherSuite: 'ECDHE-RSA-AES256-GCM-SHA384',
      forgedSenderSuspected: true
    },
    relayHops: [
      {
        hopNumber: 1,
        fromHost: 'win-desktop-bot.local',
        fromIP: '102.89.23.14',
        byHost: 'vps-bulletproof-host.ru',
        protocol: 'ESMTPSA',
        timestamp: '2026-09-04T22:44:20Z',
        delayMs: 1420,
        isOriginating: true,
        isAnomalous: true,
        anomalyNote: 'Earliest reliable origin node extracted: Residential Nigerian IP communicating over Exim authenticated relay.',
        geo: {
          ip: '102.89.23.14',
          country: 'Nigeria',
          countryCode: 'NG',
          city: 'Lagos',
          region: 'Lagos State',
          lat: 6.5244,
          lng: 3.3792,
          isp: 'MTN Nigeria Communications',
          asn: 'AS29465 MTN Nigeria',
          org: 'Residential Consumer Dial-up / Broadband',
          isTor: false,
          isVpn: false,
          isProxy: true,
          isCloudHosting: false,
          threatScore: 92
        }
      },
      {
        hopNumber: 2,
        fromHost: 'vps-bulletproof-host.ru',
        fromIP: '194.26.29.118',
        byHost: 'mail-relay-04.sec-gateway.net',
        protocol: 'ESMTP',
        timestamp: '2026-09-04T22:44:58Z',
        delayMs: 38000,
        isOriginating: false,
        isAnomalous: true,
        anomalyNote: 'Known bulletproof hosting provider known for hosting cybercrime command & control infrastructure.',
        geo: {
          ip: '194.26.29.118',
          country: 'Russia',
          countryCode: 'RU',
          city: 'Moscow',
          region: 'Central Federal District',
          lat: 55.7558,
          lng: 37.6173,
          isp: 'Bulletproof Server Networks Ltd',
          asn: 'AS44050 BPN-NET',
          org: 'Offshore Anonymous Hosting Provider',
          isTor: false,
          isVpn: true,
          isProxy: true,
          isCloudHosting: true,
          threatScore: 98
        }
      },
      {
        hopNumber: 3,
        fromHost: 'mail-relay-04.sec-gateway.net',
        fromIP: '185.220.101.44',
        byHost: 'mx.acme-global.com',
        protocol: 'ESMTPS',
        timestamp: '2026-09-04T22:45:12Z',
        delayMs: 14000,
        isOriginating: false,
        isAnomalous: true,
        anomalyNote: 'Transit via known Tor Exit Node / Tor Onion router proxy relay.',
        geo: {
          ip: '185.220.101.44',
          country: 'Germany',
          countryCode: 'DE',
          city: 'Frankfurt am Main',
          region: 'Hesse',
          lat: 50.1109,
          lng: 8.6821,
          isp: 'Tor Exit Node Relay Community',
          asn: 'AS60729 TorProject',
          org: 'Tor Exit Node Proxy Router',
          isTor: true,
          isVpn: false,
          isProxy: true,
          isCloudHosting: true,
          threatScore: 95
        }
      }
    ],
    originatingGeo: {
      ip: '102.89.23.14',
      country: 'Nigeria',
      countryCode: 'NG',
      city: 'Lagos',
      region: 'Lagos State',
      lat: 6.5244,
      lng: 3.3792,
      isp: 'MTN Nigeria Communications',
      asn: 'AS29465 MTN Nigeria',
      org: 'Residential Consumer Dial-up / Broadband',
      isTor: false,
      isVpn: false,
      isProxy: true,
      isCloudHosting: false,
      threatScore: 92
    },
    domainIntel: {
      domain: 'acme-enterprises.corp-settlement.com',
      registrar: 'NameCheap Inc.',
      creationDate: '2026-09-02T18:14:00Z',
      ageDays: 2,
      expiryDate: '2027-09-02T18:14:00Z',
      nameServers: ['dns1.bulletproofdns.ru', 'dns2.bulletproofdns.ru'],
      mxRecords: ['10 mail.corp-settlement.com'],
      threatReputationScore: 99,
      isLookalike: true,
      lookalikeTarget: 'acme-global.com (CEO/Enterprise Impersonation)',
      punycode: false,
      knownMaliciousHistory: true
    },
    urls: [
      {
        originalUrl: 'hxxps://protonmail-portal-crypto[.]com/exec-desk-auth',
        domain: 'protonmail-portal-crypto.com',
        isObfuscated: true,
        isShortened: false,
        threatCategory: 'Credential Phishing / Obfuscated Redirect',
        safetyScore: 6,
        suspiciousQueryParam: 'token=d.sterling.exec'
      }
    ],
    attachments: [],
    nlpAnalysis: {
      urgencyScore: 98,
      authorityImpersonationScore: 95,
      financialCoercionScore: 96,
      fearPressureScore: 88,
      detectedCues: [
        'Extreme urgency ("before 4:00 PM EST", "penalties will apply")',
        'Executive hierarchy coercion (CEO directly ordering CFO)',
        'Explicit instruction to bypass normal communication channels ("do not mention this through regular company chat")',
        'Large wire transfer payment diversion ($482,500.00 USD)',
        'Mismatched Reply-To forwarding to untrusted external mailbox'
      ],
      executiveImpersonated: 'David Sterling (CEO)',
      paymentDiversionDetails: {
        requestedAmount: '$482,500.00 USD',
        bankName: 'Baltic Maritime Commercial Bank LLC',
        accountReference: 'LT89 3250 0124 9912 8841 (Swift: BMCBLT2X)'
      }
    },
    attribution: {
      category: 'Direct Malicious Actor',
      confidenceScore: 94,
      probableActorOrSyndicate: 'SilverTerrier (FIN11 Sub-cluster / West African BEC Syndicate)',
      campaignCluster: 'OPERATION-TITAN-ESCROW-2026',
      reasoning: 'Originating IP correlates with documented Lagos ISP infrastructure previously active in BEC campaigns targeting manufacturing CFOs. Bulletproof VPS relay in Moscow matches known laundering proxy hops.',
      mitreAttackTechniques: [
        'T1566.002 - Spearphishing Link / Service',
        'T1585.002 - Email Accounts Infrastructure Creation',
        'T1656 - Impersonation / Social Engineering',
        'T1586.002 - Compromised Third-Party Relay Infrastructure'
      ],
      actorOriginEstimate: 'West Africa (Lagos, Nigeria) routing through Eastern European bulletproof relays'
    },
    chainOfCustody: [
      {
        id: 'coc-01',
        timestamp: '2026-09-04T22:45:13Z',
        actor: 'Enterprise Mail Gateway v8.4',
        action: 'Ingestion & Signature Hash Generation',
        details: 'Raw EML stream captured, SHA-256 evidence hash generated.',
        verificationHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
      },
      {
        id: 'coc-02',
        timestamp: '2026-09-04T22:45:15Z',
        actor: 'EmailForensics AI Engine',
        action: 'Automated Quarantine & High-Risk Alert Dispatch',
        details: 'DMARC rejection + Nigerian origin hop triggered immediate quarantine.',
        verificationHash: '8a12e881023f99aa123b7c891230192388ef112a'
      }
    ],
    mitigationHistory: [
      {
        id: 'mit-101',
        type: 'quarantine',
        target: 'cfo-office@acme-global.com inbox',
        executedAt: '2026-09-04T22:45:15Z',
        user: 'Automated Policy Engine (Rule BEC-STRICT-01)',
        status: 'active',
        txHash: '0x884019ab921c8172901827461928374619283746192837461928374619288172',
        smartContractEmitted: 'AutomatedSOARTrigger.triggerEmergencyConsortiumQuarantine()'
      },
      {
        id: 'mit-102',
        type: 'block_ip',
        target: '194.26.29.118 / 185.220.101.44',
        executedAt: '2026-09-04T22:46:02Z',
        user: 'SOC Analyst L2 (Security Admin)',
        status: 'active',
        txHash: '0x3c90e118928019ab00192837461928374619283746192837461928374619882e',
        smartContractEmitted: 'AutomatedSOARTrigger.nullRoutePerimeterIP()'
      }
    ],
    blockchainProof: {
      blockNumber: 1,
      blockHash: '00a4f9108b8812c30981726a992810a9c8b710293847102938471029384799a1',
      txHash: '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      merkleRoot: '0x71fa90218b8812c30981726a992810a9c8b7102938471029384710293847771a',
      timestamp: '2026-09-04T22:46:00Z',
      validatorNode: 'Cisco Talos Threat Intelligence Node',
      consensusSignatures: 5,
      isVerifiedOnChain: true,
      smartContractAddress: '0x3E11889a718290ccB382109848A1099238A792f4',
      smartContractAction: 'EvidenceChainOfCustody.sealEmailEvidence()',
      gasUsed: 42100,
      proofAlgorithm: 'SHA-256 Merkle Proof + ECDSA (secp256k1)'
    },
    detectedCryptoWallets: [
      {
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        currency: 'BTC',
        balance: '2.14 BTC (~$132,800 USD)',
        totalReceived: '12.60 BTC',
        txCount: 39,
        taintScore: 88,
        isOfacSanctioned: false,
        mixerTransactionsDetected: false,
        firstSeen: '2026-06-01T09:15:00Z',
        lastActive: '2026-09-04T22:15:00Z',
        riskVerdict: 'High Risk Extortion',
        clusterLabel: 'SilverTerrier BEC Wire & Crypto Escrow'
      }
    ]
  },
  {
    id: 'inc-2026-8802',
    caseNumber: 'CASE-HARVEST-0983',
    subject: 'Action Required: Microsoft 365 Security Notice - Multiple Failed MFA Logins Detected',
    senderDisplay: 'Microsoft 365 Identity Security Team',
    senderAddress: 'account-security@login-microsoft-portal.online',
    recipientAddress: 'devops-lead@acme-global.com',
    receivedAt: '2026-09-04T21:12:04Z',
    threatSeverity: 'high',
    fraudScore: 89,
    classification: 'Phishing',
    status: 'investigating',
    bodyText: `Microsoft Security Center Alert

We detected 6 unauthorized sign-in attempts to your Microsoft 365 Tenant account from IP 185.191.171.12 (St. Petersburg, Russian Federation) at 21:05 UTC.

Your multi-factor authentication (MFA) token has been temporarily placed on administrative hold to prevent credential compromise.

You must re-verify your identity and rotate your session key within 120 minutes or your Active Directory credentials will be suspended.

[Re-verify Microsoft 365 Access Now] -> hxxps://login.microsoftonline.portal-auth-id365.online/tenant/verify?user=devops-lead

Notice: This security message was generated automatically by Microsoft Defender for Cloud Apps. Do not reply.`,
    rawHeaders: `Received: from mail-node99.cloud-send-relay.com (mail-node99.cloud-send-relay.com [45.133.1.88])
    by mx.acme-global.com (Postfix) with ESMTPS id 3M0kL819aa
    for <devops-lead@acme-global.com>; Fri, 04 Sep 2026 21:12:04 +0000 (UTC)
Received: from localhost (unknown [193.106.191.22])
    by mail-node99.cloud-send-relay.com (Postfix) with ESMTP id 11A92B3
    for <devops-lead@acme-global.com>; Fri, 04 Sep 2026 21:11:45 +0000 (UTC)
Authentication-Results: mx.acme-global.com;
    dkim=none (no signature);
    spf=neutral (domain login-microsoft-portal.online does not specify permitted senders);
    dmarc=fail (p=none) header.from=login-microsoft-portal.online
From: "Microsoft 365 Identity Security Team" <account-security@login-microsoft-portal.online>
To: <devops-lead@acme-global.com>
Return-Path: <bounce@cloud-send-relay.com>
Subject: Action Required: Microsoft 365 Security Notice - Multiple Failed MFA Logins Detected
Date: Fri, 04 Sep 2026 21:11:30 +0000
Message-ID: <a89b1c77-3e11-4f10-9112-99a8b17c@login-microsoft-portal.online>
Content-Type: text/html; charset=UTF-8`,
    sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    sha1: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
    md5: '7d793037a0760186574b0282f2f435e7',
    protocols: {
      spf: {
        status: 'neutral',
        domain: 'login-microsoft-portal.online',
        clientIp: '45.133.1.88',
        record: 'v=spf1 ?all',
        aligned: false,
        explanation: 'SPF policy neutral (?all) used deliberately by attacker to evade hard SPF rejection.'
      },
      dkim: {
        status: 'none',
        domain: 'login-microsoft-portal.online',
        selector: 'default',
        signatureHeaderValid: false,
        bodyHashValid: false,
        aligned: false,
        explanation: 'No DKIM signature found on incoming message.'
      },
      dmarc: {
        status: 'fail',
        policy: 'none',
        alignment: 'unaligned',
        disposition: 'pass',
        explanation: 'DMARC alignment failed because domain is newly registered with permissive p=none policy.'
      },
      returnPathMatch: false,
      returnPath: 'bounce@cloud-send-relay.com',
      fromHeader: 'account-security@login-microsoft-portal.online',
      replyToHeader: 'account-security@login-microsoft-portal.online',
      replyToMismatch: false,
      messageIdAnomaly: false,
      messageId: '<a89b1c77-3e11-4f10-9112-99a8b17c@login-microsoft-portal.online>',
      tlsVersion: 'TLSv1.3',
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      forgedSenderSuspected: true
    },
    relayHops: [
      {
        hopNumber: 1,
        fromHost: 'unknown [193.106.191.22]',
        fromIP: '193.106.191.22',
        byHost: 'mail-node99.cloud-send-relay.com',
        protocol: 'ESMTP',
        timestamp: '2026-09-04T21:11:45Z',
        delayMs: 15000,
        isOriginating: true,
        isAnomalous: true,
        anomalyNote: 'Originating IP belongs to a VPS subnet frequently flagged for hosting Evilginx2 Adversary-in-the-Middle (AiTM) reverse proxies.',
        geo: {
          ip: '193.106.191.22',
          country: 'Romania',
          countryCode: 'RO',
          city: 'Bucharest',
          region: 'Bucuresti',
          lat: 44.4268,
          lng: 26.1025,
          isp: 'M247 Europe Cloud Services',
          asn: 'AS9009 M247 Ltd',
          org: 'Virtual Private Server Hosting Provider',
          isTor: false,
          isVpn: true,
          isProxy: false,
          isCloudHosting: true,
          threatScore: 88
        }
      },
      {
        hopNumber: 2,
        fromHost: 'mail-node99.cloud-send-relay.com',
        fromIP: '45.133.1.88',
        byHost: 'mx.acme-global.com',
        protocol: 'ESMTPS',
        timestamp: '2026-09-04T21:12:04Z',
        delayMs: 19000,
        isOriginating: false,
        isAnomalous: false,
        anomalyNote: 'Commercial bulk relay used as intermediary transit bounce.',
        geo: {
          ip: '45.133.1.88',
          country: 'Netherlands',
          countryCode: 'NL',
          city: 'Amsterdam',
          region: 'North Holland',
          lat: 52.3676,
          lng: 4.9041,
          isp: 'Serverius Holding B.V.',
          asn: 'AS50673 Serverius',
          org: 'Cloud Transit Hub',
          isTor: false,
          isVpn: false,
          isProxy: false,
          isCloudHosting: true,
          threatScore: 64
        }
      }
    ],
    originatingGeo: {
      ip: '193.106.191.22',
      country: 'Romania',
      countryCode: 'RO',
      city: 'Bucharest',
      region: 'Bucuresti',
      lat: 44.4268,
      lng: 26.1025,
      isp: 'M247 Europe Cloud Services',
      asn: 'AS9009 M247 Ltd',
      org: 'Virtual Private Server Hosting Provider',
      isTor: false,
      isVpn: true,
      isProxy: false,
      isCloudHosting: true,
      threatScore: 88
    },
    domainIntel: {
      domain: 'login-microsoft-portal.online',
      registrar: 'Hostinger Operations UAB',
      creationDate: '2026-09-03T14:22:10Z',
      ageDays: 1,
      expiryDate: '2027-09-03T14:22:10Z',
      nameServers: ['ns1.dns-parking.com', 'ns2.dns-parking.com'],
      mxRecords: ['10 mail.login-microsoft-portal.online'],
      threatReputationScore: 94,
      isLookalike: true,
      lookalikeTarget: 'login.microsoftonline.com (Brand Impersonation)',
      punycode: false,
      knownMaliciousHistory: false
    },
    urls: [
      {
        originalUrl: 'hxxps://login.microsoftonline.portal-auth-id365[.]online/tenant/verify?user=devops-lead',
        domain: 'portal-auth-id365.online',
        isObfuscated: true,
        isShortened: false,
        threatCategory: 'Evilginx2 AiTM Reverse Proxy Credential Harvester',
        safetyScore: 3,
        suspiciousQueryParam: 'user=devops-lead'
      }
    ],
    attachments: [],
    nlpAnalysis: {
      urgencyScore: 92,
      authorityImpersonationScore: 96,
      financialCoercionScore: 10,
      fearPressureScore: 94,
      detectedCues: [
        'Fear tactic: "Multiple Failed MFA Logins Detected"',
        'Brand impersonation of Microsoft 365 & Active Directory administration',
        'Artificial countdown urgency: "within 120 minutes or credentials suspended"',
        'Lookalike domain mimicking official Microsoft login domain',
        'Hidden tokenized URL designed to harvest 2FA session cookies'
      ],
      executiveImpersonated: 'Microsoft Security Team'
    },
    attribution: {
      category: 'Anonymized Infrastructure',
      confidenceScore: 88,
      probableActorOrSyndicate: 'Storm-0831 (AiTM Phishing-as-a-Service Syndicate)',
      campaignCluster: 'OPERATION-OFFICE365-HARVEST-Q3',
      reasoning: 'Reverse proxy infrastructure and template match known Evilginx2 configuration used in widespread M365 credential intercept campaigns.',
      mitreAttackTechniques: [
        'T1566.002 - Spearphishing Link',
        'T1556 - Modify Authentication Process',
        'T1539 - Steal Web Session Cookie'
      ],
      actorOriginEstimate: 'Eastern Europe / Romania relay cluster targeting DevOps & Cloud engineers'
    },
    chainOfCustody: [
      {
        id: 'coc-11',
        timestamp: '2026-09-04T21:12:05Z',
        actor: 'Enterprise Mail Gateway',
        action: 'Ingestion & Header Audit',
        details: 'Lookalike domain flagged by Domain Reputation Engine.',
        verificationHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'
      }
    ],
    mitigationHistory: [
      {
        id: 'mit-201',
        type: 'sinkhole_domain',
        target: 'portal-auth-id365.online',
        executedAt: '2026-09-04T21:15:22Z',
        user: 'DNS Firewall Automation',
        status: 'active',
        txHash: '0x118290abcc9102837461928374619283746192837461928374619283746100bc',
        smartContractEmitted: 'ThreatIntelligenceRegistry.broadcastMaliciousIOC()'
      }
    ],
    blockchainProof: {
      blockNumber: 2,
      blockHash: '0089f102837461928374619283746192837461928374619283746100bc1928ab',
      txHash: '0x8a12e881023f99aa123b7c891230192388ef112a99182390182390182390881a',
      merkleRoot: '0x33b19028a71928374619283746192837461928374619283746192837461991c',
      timestamp: '2026-09-04T21:13:00Z',
      validatorNode: 'Microsoft M365 Defender Node',
      consensusSignatures: 5,
      isVerifiedOnChain: true,
      smartContractAddress: '0x8F920b72c9182309A48F9E10823901bC4140a12e',
      smartContractAction: 'ThreatIntelligenceRegistry.broadcastMaliciousIOC()',
      gasUsed: 32000,
      proofAlgorithm: 'SHA-256 Merkle Proof + ECDSA (secp256k1)'
    },
    detectedCryptoWallets: [
      {
        address: 'bc1q9d842x9p8kmk281920384710293847192q84j',
        currency: 'BTC',
        balance: '14.82 BTC (~$920,400 USD)',
        totalReceived: '48.91 BTC',
        txCount: 84,
        taintScore: 98,
        isOfacSanctioned: true,
        mixerTransactionsDetected: true,
        firstSeen: '2025-11-14T08:12:00Z',
        lastActive: '2026-09-04T18:30:00Z',
        riskVerdict: 'Sanctioned Entity',
        clusterLabel: 'Scattered Spider / BlackCat Ransomware Consortium'
      }
    ]
  },
  {
    id: 'inc-2026-8803',
    caseNumber: 'CASE-INVOICE-0984',
    subject: 'RE: Updated Remittance Advice & Corrected Tax Invoice #INV-2026-90412',
    senderDisplay: 'Sarah Jenkins | Apex Logistics Global Accounting',
    senderAddress: 's.jenkins@apex-logistics-corp.com',
    recipientAddress: 'accounts-payable@acme-global.com',
    receivedAt: '2026-09-04T18:30:19Z',
    threatSeverity: 'critical',
    fraudScore: 94,
    classification: 'BEC_Fraud',
    status: 'quarantined',
    bodyText: `Hello Accounts Payable Team,

Please find attached the revised invoice #INV-2026-90412 for the Q3 freight container shipping and terminal handling fees ($114,890.00).

Kindly note that our primary banking partner is currently undergoing an annual SWIFT clearing audit. All remittance wires for outstanding August/September invoices must be redirected to our interim corporate depository at Standard Chartered Bank (Singapore Branch).

Please update your ERP payee record immediately prior to scheduling today's ACH/Wire payout.

Attached:
- Invoice_INV-2026-90412_Updated_Banking.pdf (628 KB)

Best regards,
Sarah Jenkins
Senior Accounting Manager
Apex Logistics Global`,
    rawHeaders: `Received: from mail.bullet-mail-mx.net (mail.bullet-mail-mx.net [185.177.126.11])
    by mx.acme-global.com (Postfix) with ESMTPS id 4K0qW1809a
    for <accounts-payable@acme-global.com>; Fri, 04 Sep 2026 18:30:19 +0000 (UTC)
Received: from authenticated-smtp-node.com (unknown [197.210.226.94])
    by mail.bullet-mail-mx.net (Postfix) with ESMTPA id 90BB2411
    for <accounts-payable@acme-global.com>; Fri, 04 Sep 2026 18:29:55 +0000 (UTC)
Authentication-Results: mx.acme-global.com;
    dkim=pass header.d=apex-logistics-corp.com;
    spf=pass (sender IP 185.177.126.11 is permitted by apex-logistics-corp.com);
    dmarc=pass header.from=apex-logistics-corp.com
From: "Sarah Jenkins | Apex Logistics Global Accounting" <s.jenkins@apex-logistics-corp.com>
To: <accounts-payable@acme-global.com>
Reply-To: "Sarah Jenkins" <s.jenkins.remittance@apex-logistics-corp.com>
Subject: RE: Updated Remittance Advice & Corrected Tax Invoice #INV-2026-90412
Date: Fri, 04 Sep 2026 18:29:40 +0000
Message-ID: <CABp=mX7_9401827419a@apex-logistics-corp.com>`,
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    sha1: '2fd4e1c67a2d28fced849ee1bb76e7391b93eb12',
    md5: 'd41d8cd98f00b204e9800998ecf8427e',
    protocols: {
      spf: {
        status: 'pass',
        domain: 'apex-logistics-corp.com',
        clientIp: '185.177.126.11',
        record: 'v=spf1 include:_spf.google.com ip4:185.177.126.11 ~all',
        aligned: true,
        explanation: 'SPF passed because attacker obtained legitimate credentials on authentic partner email infrastructure.'
      },
      dkim: {
        status: 'pass',
        domain: 'apex-logistics-corp.com',
        selector: 'google',
        signatureHeaderValid: true,
        bodyHashValid: true,
        aligned: true,
        explanation: 'Valid DKIM signature verified against legitimate corporate domain.'
      },
      dmarc: {
        status: 'pass',
        policy: 'none',
        alignment: 'aligned',
        disposition: 'pass',
        explanation: 'Protocol passes, but behavioral and NLP anomaly analysis flagged Account Compromise.'
      },
      returnPathMatch: true,
      returnPath: 's.jenkins@apex-logistics-corp.com',
      fromHeader: 's.jenkins@apex-logistics-corp.com',
      replyToHeader: 's.jenkins.remittance@apex-logistics-corp.com',
      replyToMismatch: true,
      messageIdAnomaly: false,
      messageId: '<CABp=mX7_9401827419a@apex-logistics-corp.com>',
      tlsVersion: 'TLSv1.3',
      cipherSuite: 'TLS_AES_128_GCM_SHA256',
      forgedSenderSuspected: false
    },
    relayHops: [
      {
        hopNumber: 1,
        fromHost: 'unknown [197.210.226.94]',
        fromIP: '197.210.226.94',
        byHost: 'mail.bullet-mail-mx.net',
        protocol: 'ESMTPA',
        timestamp: '2026-09-04T18:29:55Z',
        delayMs: 15000,
        isOriginating: true,
        isAnomalous: true,
        anomalyNote: 'Authenticated SMTP session logged from dynamic residential mobile IP in Port Harcourt, Nigeria, whereas legitimate company operates out of Chicago, IL, USA.',
        geo: {
          ip: '197.210.226.94',
          country: 'Nigeria',
          countryCode: 'NG',
          city: 'Port Harcourt',
          region: 'Rivers State',
          lat: 4.8156,
          lng: 7.0498,
          isp: 'Airtel Networks Limited',
          asn: 'AS36873 Airtel Nigeria',
          org: 'Mobile Cellular ISP',
          isTor: false,
          isVpn: false,
          isProxy: false,
          isCloudHosting: false,
          threatScore: 89
        }
      },
      {
        hopNumber: 2,
        fromHost: 'mail.bullet-mail-mx.net',
        fromIP: '185.177.126.11',
        byHost: 'mx.acme-global.com',
        protocol: 'ESMTPS',
        timestamp: '2026-09-04T18:30:19Z',
        delayMs: 24000,
        isOriginating: false,
        isAnomalous: false,
        anomalyNote: 'Legitimate enterprise mail relay.',
        geo: {
          ip: '185.177.126.11',
          country: 'United States',
          countryCode: 'US',
          city: 'Chicago',
          region: 'Illinois',
          lat: 41.8781,
          lng: -87.6298,
          isp: 'Apex Logistics Hosting DC',
          asn: 'AS13335 Cloudflare Partner',
          org: 'Corporate Enterprise Gateway',
          isTor: false,
          isVpn: false,
          isProxy: false,
          isCloudHosting: true,
          threatScore: 12
        }
      }
    ],
    originatingGeo: {
      ip: '197.210.226.94',
      country: 'Nigeria',
      countryCode: 'NG',
      city: 'Port Harcourt',
      region: 'Rivers State',
      lat: 4.8156,
      lng: 7.0498,
      isp: 'Airtel Networks Limited',
      asn: 'AS36873 Airtel Nigeria',
      org: 'Mobile Cellular ISP',
      isTor: false,
      isVpn: false,
      isProxy: false,
      isCloudHosting: false,
      threatScore: 89
    },
    domainIntel: {
      domain: 'apex-logistics-corp.com',
      registrar: 'GoDaddy.com LLC',
      creationDate: '2018-04-12T09:11:00Z',
      ageDays: 3067,
      expiryDate: '2028-04-12T09:11:00Z',
      nameServers: ['ns1.googlecloud.com', 'ns2.googlecloud.com'],
      mxRecords: ['1 aspmx.l.google.com'],
      threatReputationScore: 18,
      isLookalike: false,
      punycode: false,
      knownMaliciousHistory: false
    },
    urls: [],
    attachments: [
      {
        filename: 'Invoice_INV-2026-90412_Updated_Banking.pdf',
        filesize: '628 KB',
        filetype: 'application/pdf',
        sha256: 'c81b7e224900a08e19283f0812674921bda00192bce9047120aef12849102837',
        isMacroEnabled: false,
        isDoubleExtension: false,
        verdict: 'suspicious'
      }
    ],
    nlpAnalysis: {
      urgencyScore: 85,
      authorityImpersonationScore: 80,
      financialCoercionScore: 98,
      fearPressureScore: 72,
      detectedCues: [
        'Classic Vendor Email Compromise (VEC) banking diversion playbook',
        'Payment redirection: "primary banking partner undergoing SWIFT clearing audit"',
        'Redirection to offshore bank account in Singapore',
        'Urgent instruction to alter ERP payee records before payout run',
        'Hijacked existing legitimate email thread (RE: subject line)'
      ],
      executiveImpersonated: 'Sarah Jenkins (Vendor Senior Accounting Manager)',
      paymentDiversionDetails: {
        requestedAmount: '$114,890.00 USD',
        bankName: 'Standard Chartered Bank (Singapore Branch)',
        accountReference: 'SG65 0001 9882 1204 9912'
      }
    },
    attribution: {
      category: 'Compromised Account',
      confidenceScore: 96,
      probableActorOrSyndicate: 'Cosmic Lynx / Scattered VEC Syndicate',
      campaignCluster: 'OPERATION-VEC-SUPPLYCHAIN-2026',
      reasoning: 'Authentic DKIM and SPF from valid partner domain indicates account takeover (compromised credentials). Originating hop traces directly to Port Harcourt, Nigeria IP address hijacking the thread.',
      mitreAttackTechniques: [
        'T1586.002 - Compromised Email Account',
        'T1078.004 - Valid Cloud Accounts',
        'T1566 - Phishing / Supply Chain Fraud'
      ],
      actorOriginEstimate: 'West Africa (Nigeria) utilizing hijacked US corporate email infrastructure'
    },
    chainOfCustody: [
      {
        id: 'coc-21',
        timestamp: '2026-09-04T18:30:20Z',
        actor: 'Enterprise Mail Gateway',
        action: 'Ingestion & NLP Semantic Scoring',
        details: 'High financial diversion score flagged despite valid SPF/DKIM.',
        verificationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      }
    ],
    mitigationHistory: [
      {
        id: 'mit-301',
        type: 'quarantine',
        target: 'accounts-payable@acme-global.com inbox',
        executedAt: '2026-09-04T18:31:00Z',
        user: 'AI Threat Engine (Anomaly Filter VEC)',
        status: 'active'
      },
      {
        id: 'mit-302',
        type: 'soc_alert',
        target: 'Procurement & Vendor Risk Team',
        executedAt: '2026-09-04T18:31:05Z',
        user: 'Automated Incident Orchestration',
        status: 'active',
        txHash: '0x992019ab772c10293847102938471029384710293847102938471029384766e1',
        smartContractEmitted: 'EvidenceChainOfCustody.sealEmailEvidence()'
      }
    ],
    blockchainProof: {
      blockNumber: 2,
      blockHash: '0089f102837461928374619283746192837461928374619283746100bc1928ab',
      txHash: '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      merkleRoot: '0x33b19028a71928374619283746192837461928374619283746192837461991c',
      timestamp: '2026-09-04T18:32:00Z',
      validatorNode: 'Enterprise Primary Gateway Node',
      consensusSignatures: 5,
      isVerifiedOnChain: true,
      smartContractAddress: '0x3E11889a718290ccB382109848A1099238A792f4',
      smartContractAction: 'EvidenceChainOfCustody.sealEmailEvidence()',
      gasUsed: 44000,
      proofAlgorithm: 'SHA-256 Merkle Proof + ECDSA (secp256k1)'
    },
    detectedCryptoWallets: [
      {
        address: '0x71C28B823091823901bC4140a12e8810293847F1',
        currency: 'ETH',
        balance: '42.50 ETH (~$148,750 USD)',
        totalReceived: '180.20 ETH',
        txCount: 142,
        taintScore: 92,
        isOfacSanctioned: false,
        mixerTransactionsDetected: true,
        firstSeen: '2026-03-22T14:40:00Z',
        lastActive: '2026-09-05T04:10:00Z',
        riskVerdict: 'Tainted Mixer',
        clusterLabel: 'Tornado Cash Associated Launderer'
      }
    ]
  },
  {
    id: 'inc-2026-8804',
    caseNumber: 'CASE-MALWARE-0985',
    subject: 'CONFIDENTIAL: Q4 Executive Performance Appraisal & Discretionary Bonus Allocation Matrix',
    senderDisplay: 'Human Resources Compensation Board',
    senderAddress: 'hr-compensation@internal-acme-global.com',
    recipientAddress: 'all-directors@acme-global.com',
    receivedAt: '2026-09-04T16:18:33Z',
    threatSeverity: 'high',
    fraudScore: 91,
    classification: 'Malware_Delivery',
    status: 'blocked',
    bodyText: `Dear Senior Management Team,

Attached is the preliminary Q4 Executive Performance Appraisal and Discretionary Bonus Allocation Matrix approved during yesterday's Compensation Committee review.

Due to sensitive salary benchmarks and executive equity allocations, this workbook is protected with macro-level hardware encryption. When prompted in Excel, please select "Enable Content" and "Enable Editing" to compute your department's final payout ratios.

Attachment:
- Q4_Bonus_Matrix_Encrypted_Macro.xlsm (1.4 MB)

Regards,
Corporate Compensation & Executive Benefits Committee`,
    rawHeaders: `Received: from botnet-zombie-node.telecom.net (unknown [188.130.155.82])
    by mx.acme-global.com (Postfix) with ESMTP id 129AKL8812
    for <all-directors@acme-global.com>; Fri, 04 Sep 2026 16:18:33 +0000 (UTC)
Authentication-Results: mx.acme-global.com;
    dkim=fail;
    spf=fail (sender IP 188.130.155.82 is not permitted);
    dmarc=fail (p=reject) header.from=internal-acme-global.com
From: "Human Resources Compensation Board" <hr-compensation@internal-acme-global.com>
To: <all-directors@acme-global.com>
Subject: CONFIDENTIAL: Q4 Executive Performance Appraisal & Discretionary Bonus Allocation Matrix
Date: Fri, 04 Sep 2026 16:17:50 +0000
Message-ID: <00192837.20260904@internal-acme-global.com>`,
    sha256: '7c8b091823901923881023aae102938102938120391283019283019283019283',
    sha1: '3a81290381029381029381029381029381029381',
    md5: '88102938102938102938102938102938',
    protocols: {
      spf: {
        status: 'fail',
        domain: 'internal-acme-global.com',
        clientIp: '188.130.155.82',
        record: 'v=spf1 -all',
        aligned: false,
        explanation: 'Domain does not authorize IP 188.130.155.82 to transmit email.'
      },
      dkim: {
        status: 'fail',
        domain: 'internal-acme-global.com',
        selector: 'corp',
        signatureHeaderValid: false,
        bodyHashValid: false,
        aligned: false,
        explanation: 'DKIM signature missing and cryptographic verification failed.'
      },
      dmarc: {
        status: 'fail',
        policy: 'reject',
        alignment: 'unaligned',
        disposition: 'reject',
        explanation: 'Enforced rejection policy triggered.'
      },
      returnPathMatch: false,
      returnPath: 'malware-drop@darknet-c2-listener.top',
      fromHeader: 'hr-compensation@internal-acme-global.com',
      replyToHeader: 'hr-compensation@internal-acme-global.com',
      replyToMismatch: false,
      messageIdAnomaly: true,
      messageId: '<00192837.20260904@internal-acme-global.com>',
      tlsVersion: 'None (Plaintext SMTP)',
      cipherSuite: 'None',
      forgedSenderSuspected: true
    },
    relayHops: [
      {
        hopNumber: 1,
        fromHost: 'botnet-zombie-node.telecom.net',
        fromIP: '188.130.155.82',
        byHost: 'mx.acme-global.com',
        protocol: 'ESMTP',
        timestamp: '2026-09-04T16:18:33Z',
        delayMs: 43000,
        isOriginating: true,
        isAnomalous: true,
        anomalyNote: 'Originating IP is an infected consumer micro-router compromised as part of the Mirai/Mozi botnet proxy network.',
        geo: {
          ip: '188.130.155.82',
          country: 'Russia',
          countryCode: 'RU',
          city: 'St. Petersburg',
          region: 'Northwestern Federal District',
          lat: 59.9343,
          lng: 30.3351,
          isp: 'Rostelecom PJSC',
          asn: 'AS12389 Rostelecom',
          org: 'Compromised Residential DSL Node',
          isTor: false,
          isVpn: false,
          isProxy: true,
          isCloudHosting: false,
          threatScore: 96
        }
      }
    ],
    originatingGeo: {
      ip: '188.130.155.82',
      country: 'Russia',
      countryCode: 'RU',
      city: 'St. Petersburg',
      region: 'Northwestern Federal District',
      lat: 59.9343,
      lng: 30.3351,
      isp: 'Rostelecom PJSC',
      asn: 'AS12389 Rostelecom',
      org: 'Compromised Residential DSL Node',
      isTor: false,
      isVpn: false,
      isProxy: true,
      isCloudHosting: false,
      threatScore: 96
    },
    domainIntel: {
      domain: 'internal-acme-global.com',
      registrar: 'Tucows Domains Inc.',
      creationDate: '2026-09-01T04:10:00Z',
      ageDays: 3,
      expiryDate: '2027-09-01T04:10:00Z',
      nameServers: ['ns1.he.net', 'ns2.he.net'],
      mxRecords: ['0 .'],
      threatReputationScore: 98,
      isLookalike: true,
      lookalikeTarget: 'acme-global.com (Prefix Lookalike)',
      punycode: false,
      knownMaliciousHistory: true
    },
    urls: [],
    attachments: [
      {
        filename: 'Q4_Bonus_Matrix_Encrypted_Macro.xlsm',
        filesize: '1.4 MB',
        filetype: 'application/vnd.ms-excel.sheet.macroEnabled.12',
        sha256: '98a12bc091823901928301928301928301928301928301928301928301928301',
        isMacroEnabled: true,
        isDoubleExtension: false,
        verdict: 'malicious'
      }
    ],
    nlpAnalysis: {
      urgencyScore: 78,
      authorityImpersonationScore: 92,
      financialCoercionScore: 84,
      fearPressureScore: 70,
      detectedCues: [
        'Curiosity & financial lure: "Q4 Executive Bonus Matrix"',
        'Social engineering coaxing users to bypass Office security: "select Enable Content and Enable Editing"',
        'Pretending to have macro-level encryption to justify malicious VBA payload execution',
        'Lookalike domain mimicking internal corporate HR portal'
      ],
      executiveImpersonated: 'Corporate Compensation Board'
    },
    attribution: {
      category: 'Direct Malicious Actor',
      confidenceScore: 91,
      probableActorOrSyndicate: 'TA505 / FIN11 (Clop Ransomware Affiliate Group)',
      campaignCluster: 'OPERATION-MALMACRO-EXEC-Q3',
      reasoning: 'Embedded VBA staging downloader matches documented Clop ransomware loader signature communicating to St. Petersburg C2 infrastructure.',
      mitreAttackTechniques: [
        'T1566.001 - Spearphishing Attachment',
        'T1204.002 - User Execution: Malicious File',
        'T1059.005 - Visual Basic for Applications (VBA)'
      ],
      actorOriginEstimate: 'Russian Federation (St. Petersburg / Moscow) cybercrime syndicate'
    },
    chainOfCustody: [
      {
        id: 'coc-31',
        timestamp: '2026-09-04T16:18:34Z',
        actor: 'Gateway Antivirus Sandbox',
        action: 'Payload Detonation & Immediate Rejection',
        details: 'Macro extracted; dropped malicious DLL payload signature detected.',
        verificationHash: '7c8b091823901923881023aae102938102938120391283019283019283019283'
      }
    ],
    mitigationHistory: [
      {
        id: 'mit-401',
        type: 'block_ip',
        target: '188.130.155.82 (Subnet 188.130.155.0/24)',
        executedAt: '2026-09-04T16:18:35Z',
        user: 'Gateway Border Firewall Rule 881',
        status: 'active',
        txHash: '0x771928ab001928374619283746192837461928374619283746192837461999e2',
        smartContractEmitted: 'AutomatedSOARTrigger.nullRoutePerimeterIP()'
      }
    ],
    blockchainProof: {
      blockNumber: 1,
      blockHash: '00a4f9108b8812c30981726a992810a9c8b710293847102938471029384799a1',
      txHash: '0x7c8b091823901923881023aae102938102938120391283019283019283019283',
      merkleRoot: '0x71fa90218b8812c30981726a992810a9c8b7102938471029384710293847771a',
      timestamp: '2026-09-04T16:19:00Z',
      validatorNode: 'US-CISA / CERT Trust Node',
      consensusSignatures: 5,
      isVerifiedOnChain: true,
      smartContractAddress: '0x8F920b72c9182309A48F9E10823901bC4140a12e',
      smartContractAction: 'ThreatIntelligenceRegistry.broadcastMaliciousIOC()',
      gasUsed: 39000,
      proofAlgorithm: 'SHA-256 Merkle Proof + ECDSA (secp256k1)'
    }
  },
  {
    id: 'inc-2026-8805',
    caseNumber: 'CASE-BENIGN-0986',
    subject: 'Amazon Web Services Invoice #AWS-892147101 - Payment Processed Successfully',
    senderDisplay: 'Amazon Web Services Billing',
    senderAddress: 'no-reply-aws@amazon.com',
    recipientAddress: 'cloud-billing@acme-global.com',
    receivedAt: '2026-09-04T14:02:11Z',
    threatSeverity: 'benign',
    fraudScore: 4,
    classification: 'Legitimate',
    status: 'released',
    bodyText: `Hello Acme Global Cloud Operations,

Your monthly invoice for Amazon Web Services usage across US-East-1 and EU-Central-1 for August 2026 is now available.

Invoice Summary:
Invoice Number: AWS-892147101
Account ID: 8209-7392-5100
Amount Charged: $14,210.82 USD
Status: Paid (Charged to Corporate Amex ending in 4012)

You can download your detailed PDF VAT receipt and itemized usage reports directly from the AWS Billing & Cost Management Dashboard.

Thank you for choosing Amazon Web Services.
Amazon Web Services, Inc.`,
    rawHeaders: `Received: from a8-29.smtp-out.amazonses.com (a8-29.smtp-out.amazonses.com [54.240.8.29])
    by mx.acme-global.com (Postfix) with ESMTPS id 4Zw81992Kl
    for <cloud-billing@acme-global.com>; Fri, 04 Sep 2026 14:02:11 +0000 (UTC)
Authentication-Results: mx.acme-global.com;
    dkim=pass header.d=amazonses.com;
    spf=pass (sender IP 54.240.8.29 is permitted by amazonses.com);
    dmarc=pass (p=reject) header.from=amazon.com
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
    d=amazonses.com; s=ug7nbtf4gccmlpwj322z;
    h=From:To:Subject:Date:Message-ID;
    bh=X881zKl9...;
    b=N90aLLm2...
From: "Amazon Web Services Billing" <no-reply-aws@amazon.com>
To: <cloud-billing@acme-global.com>
Subject: Amazon Web Services Invoice #AWS-892147101 - Payment Processed Successfully
Date: Fri, 04 Sep 2026 14:01:58 +0000
Message-ID: <0100018f3a92182-c9182390-amazon.com>`,
    sha256: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    sha1: '9812739182739182739182739182739182739182',
    md5: '12345678901234567890123456789012',
    protocols: {
      spf: {
        status: 'pass',
        domain: 'amazonses.com',
        clientIp: '54.240.8.29',
        record: 'v=spf1 include:amazon.com ~all',
        aligned: true,
        explanation: 'Verified Amazon SES IP address authenticated against Amazon SPF records.'
      },
      dkim: {
        status: 'pass',
        domain: 'amazonses.com',
        selector: 'ug7nbtf4gccmlpwj322z',
        signatureHeaderValid: true,
        bodyHashValid: true,
        aligned: true,
        explanation: 'Cryptographic DKIM signature matches public DNS key.'
      },
      dmarc: {
        status: 'pass',
        policy: 'reject',
        alignment: 'aligned',
        disposition: 'pass',
        explanation: 'Strict DMARC policy passed cleanly.'
      },
      returnPathMatch: true,
      returnPath: '0100018f3a92182-c9182390@bounces.amazonses.com',
      fromHeader: 'no-reply-aws@amazon.com',
      replyToHeader: 'no-reply-aws@amazon.com',
      replyToMismatch: false,
      messageIdAnomaly: false,
      messageId: '<0100018f3a92182-c9182390-amazon.com>',
      tlsVersion: 'TLSv1.3',
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      forgedSenderSuspected: false
    },
    relayHops: [
      {
        hopNumber: 1,
        fromHost: 'a8-29.smtp-out.amazonses.com',
        fromIP: '54.240.8.29',
        byHost: 'mx.acme-global.com',
        protocol: 'ESMTPS',
        timestamp: '2026-09-04T14:02:11Z',
        delayMs: 13000,
        isOriginating: true,
        isAnomalous: false,
        anomalyNote: 'Legitimate Amazon SES outbound mail cluster.',
        geo: {
          ip: '54.240.8.29',
          country: 'United States',
          countryCode: 'US',
          city: 'Seattle',
          region: 'Washington',
          lat: 47.6062,
          lng: -122.3321,
          isp: 'Amazon.com, Inc.',
          asn: 'AS16509 AMAZON-02',
          org: 'Amazon Simple Email Service (SES)',
          isTor: false,
          isVpn: false,
          isProxy: false,
          isCloudHosting: true,
          threatScore: 2
        }
      }
    ],
    originatingGeo: {
      ip: '54.240.8.29',
      country: 'United States',
      countryCode: 'US',
      city: 'Seattle',
      region: 'Washington',
      lat: 47.6062,
      lng: -122.3321,
      isp: 'Amazon.com, Inc.',
      asn: 'AS16509 AMAZON-02',
      org: 'Amazon Simple Email Service (SES)',
      isTor: false,
      isVpn: false,
      isProxy: false,
      isCloudHosting: true,
      threatScore: 2
    },
    domainIntel: {
      domain: 'amazon.com',
      registrar: 'MarkMonitor Inc.',
      creationDate: '1994-11-01T05:00:00Z',
      ageDays: 11630,
      expiryDate: '2030-10-31T04:00:00Z',
      nameServers: ['ns1.p31.dynect.net', 'ns2.p31.dynect.net'],
      mxRecords: ['10 amazon-smtp.amazon.com'],
      threatReputationScore: 1,
      isLookalike: false,
      punycode: false,
      knownMaliciousHistory: false
    },
    urls: [],
    attachments: [],
    nlpAnalysis: {
      urgencyScore: 12,
      authorityImpersonationScore: 8,
      financialCoercionScore: 15,
      fearPressureScore: 4,
      detectedCues: [
        'Standard billing confirmation receipt format',
        'No urgent threat or account suspension coercion',
        'Official Amazon SES digital signatures verified'
      ]
    },
    attribution: {
      category: 'Compromised Account', // dummy fallback
      confidenceScore: 99,
      probableActorOrSyndicate: 'Legitimate Vendor / Certified Infrastructure',
      campaignCluster: 'AWS-BILLING-RECURRING',
      reasoning: 'Authentic cryptographic signatures from Amazon.com corporate infrastructure.',
      mitreAttackTechniques: [],
      actorOriginEstimate: 'Amazon Web Services (Seattle, WA, USA)'
    },
    chainOfCustody: [
      {
        id: 'coc-41',
        timestamp: '2026-09-04T14:02:12Z',
        actor: 'Enterprise Mail Gateway',
        action: 'Clean Verification & Delivery',
        details: 'DMARC and SPF verified clean; delivered directly to corporate mailbox.',
        verificationHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
      }
    ],
    mitigationHistory: [],
    blockchainProof: {
      blockNumber: 0,
      blockHash: '0000000000000000000000000000000000000000000000000000000000000000',
      txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      merkleRoot: '0xCleanVerificationMerkleLeaf',
      timestamp: '2026-09-04T14:02:12Z',
      validatorNode: 'Enterprise Primary Gateway Node',
      consensusSignatures: 5,
      isVerifiedOnChain: true,
      smartContractAddress: '0x3E11889a718290ccB382109848A1099238A792f4',
      smartContractAction: 'EvidenceChainOfCustody.sealEmailEvidence()',
      gasUsed: 12000,
      proofAlgorithm: 'SHA-256 Merkle Proof'
    }
  }
];
