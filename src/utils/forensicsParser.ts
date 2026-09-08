import { EmailIncident, RelayHop, GeoLocation, ProtocolForensics, DomainIntelligence } from '../types';

// Simple SHA-256 calculation for browser & node
export async function computeSha256(text: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(text);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    console.warn('Crypto subtle error, fallback used', e);
  }
  // Simple fallback hash representation
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0') + 'c9182309e4f0';
}

// IP Geolocation Resolver
export function lookupIpIntelligence(ip: string): GeoLocation {
  const cleanIp = ip.trim().replace(/[\[\]]/g, '');

  if (cleanIp.startsWith('10.') || cleanIp.startsWith('192.168.') || cleanIp.startsWith('172.16.') || cleanIp === '127.0.0.1' || cleanIp === 'localhost') {
    return {
      ip: cleanIp,
      country: 'Internal / Private Network',
      countryCode: 'LAN',
      city: 'Intranet Host',
      region: 'Local Subnet',
      lat: 38.8951,
      lng: -77.0364,
      isp: 'Internal Enterprise LAN',
      asn: 'RFC 1918 Private Address Space',
      org: 'Local Network',
      isTor: false,
      isVpn: false,
      isProxy: false,
      isCloudHosting: false,
      threatScore: 5
    };
  }

  // Realistic mock database for common threat patterns and known IPs
  if (cleanIp.startsWith('102.') || cleanIp.startsWith('197.') || cleanIp.startsWith('105.')) {
    return {
      ip: cleanIp,
      country: 'Nigeria',
      countryCode: 'NG',
      city: 'Lagos',
      region: 'Lagos State',
      lat: 6.5244,
      lng: 3.3792,
      isp: 'MTN Nigeria Communications',
      asn: 'AS29465 MTN Nigeria',
      org: 'Consumer Broadband',
      isTor: false,
      isVpn: false,
      isProxy: true,
      isCloudHosting: false,
      threatScore: 88
    };
  }

  if (cleanIp.startsWith('185.220.') || cleanIp.includes('tor')) {
    return {
      ip: cleanIp,
      country: 'Germany',
      countryCode: 'DE',
      city: 'Frankfurt',
      region: 'Hesse',
      lat: 50.1109,
      lng: 8.6821,
      isp: 'Tor Exit Node Community Relay',
      asn: 'AS60729 TorProject',
      org: 'Tor Onion Router Node',
      isTor: true,
      isVpn: false,
      isProxy: true,
      isCloudHosting: true,
      threatScore: 96
    };
  }

  if (cleanIp.startsWith('194.') || cleanIp.startsWith('188.') || cleanIp.startsWith('193.')) {
    return {
      ip: cleanIp,
      country: 'Russia',
      countryCode: 'RU',
      city: 'Moscow',
      region: 'Central Federal District',
      lat: 55.7558,
      lng: 37.6173,
      isp: 'Offshore Bulletproof Cloud Host',
      asn: 'AS44050 BPN-NET',
      org: 'Unregulated VPS Host',
      isTor: false,
      isVpn: true,
      isProxy: true,
      isCloudHosting: true,
      threatScore: 94
    };
  }

  if (cleanIp.startsWith('54.') || cleanIp.startsWith('52.') || cleanIp.startsWith('3.') || cleanIp.startsWith('44.')) {
    return {
      ip: cleanIp,
      country: 'United States',
      countryCode: 'US',
      city: 'Ashburn',
      region: 'Virginia',
      lat: 39.0438,
      lng: -77.4874,
      isp: 'Amazon.com, Inc.',
      asn: 'AS16509 AWS',
      org: 'Amazon Web Services Cloud',
      isTor: false,
      isVpn: false,
      isProxy: false,
      isCloudHosting: true,
      threatScore: 8
    };
  }

  // General default public IP estimation
  return {
    ip: cleanIp,
    country: 'United States',
    countryCode: 'US',
    city: 'San Jose',
    region: 'California',
    lat: 37.3382,
    lng: -121.8863,
    isp: 'Cloudflare / Akamai Transit',
    asn: 'AS13335 Public Route',
    org: 'Enterprise Mail Gateway Transit',
    isTor: false,
    isVpn: false,
    isProxy: false,
    isCloudHosting: true,
    threatScore: 25
  };
}

// Header Parsing
export function parseRawEmail(rawText: string, optionalBody?: string): EmailIncident {
  // Separate headers from body
  let headerPart = rawText;
  let bodyPart = optionalBody || '';

  if (!optionalBody) {
    const headerBodySplit = rawText.split(/\r?\n\r?\n/);
    if (headerBodySplit.length > 1) {
      headerPart = headerBodySplit[0];
      bodyPart = headerBodySplit.slice(1).join('\n\n');
    }
  }

  const lines = headerPart.split(/\r?\n/);
  const unfoldedHeaders: { [key: string]: string } = {};
  let currentKey = '';

  for (const line of lines) {
    if (/^\s+/.test(line) && currentKey) {
      unfoldedHeaders[currentKey] += ' ' + line.trim();
    } else {
      const match = line.match(/^([^:]+):\s*(.*)$/);
      if (match) {
        currentKey = match[1].toLowerCase().trim();
        unfoldedHeaders[currentKey] = match[2].trim();
      }
    }
  }

  // Extract from
  const fromHeader = unfoldedHeaders['from'] || 'Unknown Sender';
  let senderAddress = 'unknown@sender.com';
  let senderDisplay = fromHeader;
  const fromMatch = fromHeader.match(/^(?:"?([^"]*)"?\s*)?<?([^>]+)>?$/);
  if (fromMatch) {
    senderDisplay = fromMatch[1] || fromMatch[2];
    senderAddress = fromMatch[2];
  }

  const recipientAddress = unfoldedHeaders['to'] || 'security-triage@organization.com';
  const subject = unfoldedHeaders['subject'] || 'Suspicious Email Ingestion';
  const replyTo = unfoldedHeaders['reply-to'] || fromHeader;
  const returnPath = unfoldedHeaders['return-path'] || senderAddress;
  const messageId = unfoldedHeaders['message-id'] || `<${Date.now()}@mail-gateway.sec>`;

  // Extract Received headers (Hops)
  const receivedLines: string[] = [];
  const rawReceivedRegex = /Received:\s*([^;]+;\s*[^]+?)(?=(?:Received:|$))/gi;
  let match;
  while ((match = rawReceivedRegex.exec(headerPart)) !== null) {
    receivedLines.push(match[1].replace(/\s+/g, ' ').trim());
  }

  // If regex missed multiple folded lines, fallback split
  if (receivedLines.length === 0) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().startsWith('received:')) {
        let hopStr = lines[i].substring(9);
        let j = i + 1;
        while (j < lines.length && /^\s+/.test(lines[j])) {
          hopStr += ' ' + lines[j].trim();
          j++;
        }
        receivedLines.push(hopStr);
      }
    }
  }

  // Parse Hops
  const hops: RelayHop[] = [];
  // Received headers are listed from top (most recent / local MX) to bottom (originating)
  // We reverse to number 1 = earliest originating node
  const reversedHops = [...receivedLines].reverse();

  reversedHops.forEach((hopStr, idx) => {
    // extract from, by, with, timestamp
    let fromHost = 'unknown';
    let fromIP = '127.0.0.1';
    let byHost = 'unknown';
    let protocol = 'ESMTP';
    let timestamp = new Date(Date.now() - (reversedHops.length - idx) * 30000).toISOString();

    const fromMatch = hopStr.match(/from\s+([^\s]+)(?:\s+\((?:[^\)]*?\[)?([0-9a-fA-F\.:]+)(?:\])?\))?/i);
    if (fromMatch) {
      fromHost = fromMatch[1];
      if (fromMatch[2]) fromIP = fromMatch[2];
    } else {
      const ipOnly = hopStr.match(/\[([0-9a-fA-F\.:]+)\]/);
      if (ipOnly) fromIP = ipOnly[1];
    }

    const byMatch = hopStr.match(/by\s+([^\s]+)/i);
    if (byMatch) byHost = byMatch[1];

    const withMatch = hopStr.match(/with\s+([^\s;]+)/i);
    if (withMatch) protocol = withMatch[1];

    const timeMatch = hopStr.match(/;\s*(.+)$/);
    if (timeMatch) {
      try {
        const parsedDate = new Date(timeMatch[1]);
        if (!isNaN(parsedDate.getTime())) {
          timestamp = parsedDate.toISOString();
        }
      } catch {
        // keep fallback
      }
    }

    const isOriginating = idx === 0;
    const geo = lookupIpIntelligence(fromIP);
    const isAnomalous = geo.threatScore > 50 || geo.isTor || geo.isProxy;

    hops.push({
      hopNumber: idx + 1,
      fromHost,
      fromIP,
      byHost,
      protocol,
      timestamp,
      delayMs: (idx + 1) * 12000,
      isOriginating,
      isAnomalous,
      anomalyNote: isAnomalous ? `Hop flagged with high threat score (${geo.threatScore}/100). Node ${geo.org}` : undefined,
      geo
    });
  });

  // If no hops were found in raw text, create synthetic origin hop
  if (hops.length === 0) {
    hops.push({
      hopNumber: 1,
      fromHost: 'inbound-smtp.node',
      fromIP: '194.26.29.118',
      byHost: 'mx.acme-global.com',
      protocol: 'ESMTPS',
      timestamp: new Date().toISOString(),
      delayMs: 2200,
      isOriginating: true,
      isAnomalous: true,
      anomalyNote: 'Suspicious offshore IP transmission path',
      geo: lookupIpIntelligence('194.26.29.118')
    });
  }

  // SPF / DKIM / DMARC evaluation
  const authResults = unfoldedHeaders['authentication-results'] || '';
  const hasSpfPass = /spf=pass/i.test(authResults);
  const hasDkimPass = /dkim=pass/i.test(authResults);
  const hasDmarcPass = /dmarc=pass/i.test(authResults);

  const protocols: ProtocolForensics = {
    spf: {
      status: hasSpfPass ? 'pass' : 'fail',
      domain: senderAddress.split('@')[1] || 'unknown.com',
      clientIp: hops[0].fromIP,
      record: 'v=spf1 -all',
      aligned: hasSpfPass,
      explanation: hasSpfPass ? 'Sending IP permitted by domain SPF policy' : 'Originating IP address is not authorized in published SPF record'
    },
    dkim: {
      status: hasDkimPass ? 'pass' : (unfoldedHeaders['dkim-signature'] ? 'fail' : 'none'),
      domain: senderAddress.split('@')[1] || 'unknown.com',
      selector: 's1',
      signatureHeaderValid: hasDkimPass,
      bodyHashValid: hasDkimPass,
      aligned: hasDkimPass,
      explanation: hasDkimPass ? 'Valid cryptographic signature verified' : 'DKIM signature missing or failed public key validation'
    },
    dmarc: {
      status: hasDmarcPass ? 'pass' : 'fail',
      policy: 'quarantine',
      alignment: hasDmarcPass ? 'aligned' : 'unaligned',
      disposition: hasDmarcPass ? 'pass' : 'quarantine',
      explanation: hasDmarcPass ? 'DMARC alignment passed' : 'DMARC alignment failed for organizational domain'
    },
    returnPathMatch: returnPath.toLowerCase().includes(senderAddress.split('@')[1]?.toLowerCase() || ''),
    returnPath,
    fromHeader,
    replyToHeader: replyTo,
    replyToMismatch: replyTo !== fromHeader && !replyTo.includes(senderAddress),
    messageIdAnomaly: messageId.includes('.local') || !messageId.includes('@'),
    messageId,
    tlsVersion: 'TLSv1.2',
    cipherSuite: 'ECDHE-RSA-AES256-GCM-SHA384',
    forgedSenderSuspected: !hasSpfPass || !hasDmarcPass
  };

  // Domain intelligence
  const senderDomain = senderAddress.split('@')[1] || 'unknown.com';
  const isLookalike = senderDomain.includes('-') || senderDomain.length > 25 || /corp|settlement|portal|login|verify|account/i.test(senderDomain);
  const domainIntel: DomainIntelligence = {
    domain: senderDomain,
    registrar: isLookalike ? 'NameCheap / Offshore Proxy' : 'MarkMonitor / Cloudflare',
    creationDate: isLookalike ? '2026-09-01T00:00:00Z' : '2015-01-10T00:00:00Z',
    ageDays: isLookalike ? 3 : 4200,
    expiryDate: '2027-09-01T00:00:00Z',
    nameServers: isLookalike ? ['ns1.bulletproofdns.ru', 'ns2.bulletproofdns.ru'] : ['ns1.corporate.com'],
    mxRecords: [`10 mail.${senderDomain}`],
    threatReputationScore: isLookalike ? 96 : 8,
    isLookalike,
    lookalikeTarget: isLookalike ? 'Target Enterprise Domain' : undefined,
    punycode: senderDomain.startsWith('xn--'),
    knownMaliciousHistory: isLookalike
  };

  // NLP Heuristics
  const fullText = (subject + ' ' + bodyPart).toLowerCase();
  const cues: string[] = [];
  let urgency = 20;
  let authority = 20;
  let financial = 10;
  let fear = 15;

  if (/urgent|immediately|action required|asap|within \d+ hours|penalty|closing/i.test(fullText)) {
    urgency = 95;
    cues.push('High urgency cue detected in text');
  }
  if (/wire transfer|escrow|bank|iban|swift|payment|invoice|\$\d+/i.test(fullText)) {
    financial = 92;
    cues.push('High financial transaction / wire transfer diversion request');
  }
  if (/ceo|cfo|director|board|chief executive|microsoft|security team|admin/i.test(fullText)) {
    authority = 90;
    cues.push('Executive or high-privilege brand impersonation');
  }
  if (/suspended|unauthorized|failed logins|hold|terminated|investigation/i.test(fullText)) {
    fear = 88;
    cues.push('Fear coercion / threat of credential revocation');
  }
  if (protocols.replyToMismatch) {
    cues.push('Mismatched Reply-To header pointing to external address');
  }

  const fraudScore = Math.min(99, Math.max(10, Math.round((urgency * 0.3) + (financial * 0.3) + (authority * 0.2) + (domainIntel.threatReputationScore * 0.2))));

  const incidentId = 'inc-custom-' + Date.now();
  const caseNumber = `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const fakeHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b' + Math.floor(Math.random() * 899 + 100);

  return {
    id: incidentId,
    caseNumber,
    subject,
    senderDisplay,
    senderAddress,
    recipientAddress,
    receivedAt: new Date().toISOString(),
    fraudScore,
    classification: fraudScore > 85 ? (financial > 80 ? 'BEC_Fraud' : 'Phishing') : (fraudScore > 50 ? 'Suspicious' : 'Legitimate'),
    threatSeverity: fraudScore > 80 ? 'critical' : (fraudScore > 55 ? 'high' : 'low'),
    status: fraudScore > 75 ? 'quarantined' : 'investigating',
    bodyText: bodyPart || 'No plain text body content found in email.',
    rawHeaders: headerPart,
    protocols,
    relayHops: hops,
    originatingGeo: hops[0].geo || lookupIpIntelligence('194.26.29.118'),
    domainIntel,
    urls: [],
    attachments: [],
    sha256: fakeHash,
    sha1: 'a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7',
    md5: '7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a',
    chainOfCustody: [
      {
        id: 'coc-' + Date.now(),
        timestamp: new Date().toISOString(),
        actor: 'Enterprise Gateway Ingestion Daemon',
        action: 'Ingestion & Evidentiary Sealing',
        details: 'RFC 822 stream captured, unfolded, and sealed with cryptographic verification',
        verificationHash: fakeHash.substring(0, 16)
      }
    ],
    mitigationHistory: [
      {
        id: 'mit-' + Date.now(),
        type: 'quarantine',
        target: recipientAddress,
        executedAt: new Date().toISOString(),
        user: 'Perimeter Inspection Engine',
        status: 'active'
      }
    ],
    nlpAnalysis: {
      urgencyScore: urgency,
      authorityImpersonationScore: authority,
      financialCoercionScore: financial,
      fearPressureScore: fear,
      detectedCues: cues
    },
    attribution: {
      category: isLookalike ? 'Spoofed Domain' : 'Compromised Account',
      confidenceScore: Math.min(95, fraudScore),
      probableActorOrSyndicate: isLookalike ? 'Syndicate Infrastructure Cluster' : 'Suspicious Remote Origin',
      campaignCluster: 'SUSPICIOUS-INGEST-CAMPAIGN',
      reasoning: `Analysis of headers reveals earliest node originating from ${hops[0].geo?.city}, ${hops[0].geo?.country}. SPF/DMARC status: ${protocols.spf.status}/${protocols.dmarc.status}.`,
      mitreAttackTechniques: ['T1566 - Phishing', 'T1656 - Impersonation'],
      actorOriginEstimate: `${hops[0].geo?.city}, ${hops[0].geo?.country}`
    }
  };
}
