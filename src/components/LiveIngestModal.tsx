import React, { useState } from 'react';
import { parseRawEmail } from '../utils/forensicsParser';
import { EmailIncident, AdversaryCryptoWallet } from '../types';
import { sha256Sync } from '../utils/blockchainEngine';
import {
  X,
  Upload,
  FileCode,
  Sparkles,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Blocks,
  Coins,
} from 'lucide-react';

interface LiveIngestModalProps {
  onClose: () => void;
  onIngestSuccess: (incident: EmailIncident) => void;
}

const TEMPLATES = [
  {
    name: 'Executive Wire Transfer BEC',
    subject: 'URGENT: Confidential Project Falcon Acquisition Escrow Wire',
    sender: 'david.sterling@acme-global.com.holdings-corp.net',
    recipient: 'cfo-office@acme-global.com',
    headers: `Received: from mail-gateway.acme-global.com (10.0.1.5) by mx1.acme-global.com with ESMTP; Fri, 04 Sep 2026 14:22:15 +0000
Received: from exit-node-tor-04.torservers.net (185.220.101.44) by relay-lon.cloud-smtp.org with ESMTP; Fri, 04 Sep 2026 14:21:40 +0000
Received: from static-102-89-23-14.mtnnigeria.net (102.89.23.14) by smtp-auth-out.vps-service.ru with ESMTPA; Fri, 04 Sep 2026 14:20:58 +0000
From: "David Sterling (CEO)" <david.sterling@acme-global.com.holdings-corp.net>
Reply-To: d.sterling.exec-desk@protonmail-portal-crypto.com
To: cfo-office@acme-global.com
Subject: URGENT: Confidential Project Falcon Acquisition Escrow Wire
Date: Fri, 04 Sep 2026 14:20:58 +0000
Message-ID: <92841048.91823@temp-mailer-daemon>
Return-Path: <bounce-daemon@holdings-corp.net>
Authentication-Results: mx.acme-global.com; dkim=fail; spf=fail (102.89.23.14 not authorized for acme-global.com); dmarc=fail action=none`,
    body: `CFO Team,

I am currently in an NDA-restricted executive board session regarding the Project Falcon acquisition.
Due to urgent transaction deadlines, the remaining escrow deposit of $428,500.00 USD must be wired before 4:00 PM EST today to avoid statutory default penalties.

Do not call my mobile as my line is restricted during the closing conference. Please route payment to the following designated international escrow coordinates immediately:

Bank: Alpha Capital Trust Overseas
Routing Code: 021000021
Escrow Account: 84920-192-841
Beneficiary: Falcon Holdings Escrow Ltd.

Confirm once dispatched with the Fedwire IMAD reference number.

Best regards,
David Sterling
Chief Executive Officer
Acme Global Corporation`,
  },
  {
    name: 'Microsoft 365 AiTM Phishing',
    subject: 'Action Required: Your Microsoft 365 Session Has Expired',
    sender: 'security-notify@login-microsoftonline.com-auth-verify.cc',
    recipient: 'all-staff@acme-global.com',
    headers: `Received: from mx.acme-global.com (10.0.1.5) by mail.acme-global.com; Fri, 04 Sep 2026 11:15:20 +0000
Received: from vps-94-156-65-11.hostinger.ro (94.156.65.11) by mail-forwarder.ro with ESMTP; Fri, 04 Sep 2026 11:14:40 +0000
From: "Microsoft Security Center" <security-notify@login-microsoftonline.com-auth-verify.cc>
To: all-staff@acme-global.com
Subject: Action Required: Your Microsoft 365 Session Has Expired
Date: Fri, 04 Sep 2026 11:14:40 +0000
Message-ID: <evilginx-session-94810@login-microsoftonline.com-auth-verify.cc>
Return-Path: <bounce@login-microsoftonline.com-auth-verify.cc>
Authentication-Results: mx.acme-global.com; dkim=none; spf=softfail; dmarc=fail action=none`,
    body: `Your organizational Microsoft 365 enterprise token has expired due to updated tenant security policies.
To prevent immediate account suspension and preserve access to Outlook, OneDrive, and Teams:

1. Click here to verify your identity: https://login-microsoftonline.com-auth-verify.cc/tenant/oauth/v2
2. Authenticate using your secondary hardware token or authenticator app code.

Failure to re-authenticate within 1 hour will trigger automated Active Directory deactivation.

Microsoft Online Security Operations
One Microsoft Way, Redmond, WA`,
  },
  {
    name: 'BlackCat / ALPHV Ransomware Extortion',
    subject: 'CRITICAL WARNING: 2.4 TB Proprietary Data Exfiltrated - Ransom Demanded',
    sender: 'alphv-negotiations@tor-onion-leak-channel.org',
    recipient: 'security-incident@acme-global.com',
    headers: `Received: from mail-in.acme-global.com (10.0.1.5) by edge.acme-global.com; Fri, 04 Sep 2026 16:45:10 +0000
Received: from tor-exit-node-99.cyberguerrilla.org (185.100.86.128) by relay-anon.tor-network.net with ESMTP; Fri, 04 Sep 2026 16:44:22 +0000
From: "ALPHV Threat Syndicate" <alphv-negotiations@tor-onion-leak-channel.org>
To: security-incident@acme-global.com
Subject: CRITICAL WARNING: 2.4 TB Proprietary Data Exfiltrated - Ransom Demanded
Date: Fri, 04 Sep 2026 16:44:22 +0000
Message-ID: <extortion-alphv-849102@onion-hidden-service>
Return-Path: <alphv-support@onion-hidden-service>
Authentication-Results: mx.acme-global.com; dkim=fail; spf=fail (185.100.86.128); dmarc=fail`,
    body: `ATTENTION: Acme Global Security Executive & Board of Directors.

We have infiltrated your Active Directory and exfiltrated 2.4 Terabytes of confidential engineering designs, customer PII, and financial tax records.
If you contact law enforcement or cyber insurers, your files will be immediately published to our public leak mirror.

To obtain the private decryption key and purchase total deletion of our archive, transmit 12.5 BTC to the following escrow address:

BTC Deposit Address: bc1q9d842x9p8kmk281920384710293847192q84j
Deadline: Exactly 72 hours from receipt of this notice.

Failure to transfer funds will result in full regulatory disclosure to the SEC and state attorneys general.`,
  },
];

export const LiveIngestModal: React.FC<LiveIngestModalProps> = ({
  onClose,
  onIngestSuccess,
}) => {
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [headersText, setHeadersText] = useState<string>(TEMPLATES[0].headers);
  const [bodyText, setBodyText] = useState<string>(TEMPLATES[0].body);
  const [analyzing, setAnalyzing] = useState(false);

  const handleApplyTemplate = (idx: number) => {
    setSelectedTemplateIndex(idx);
    setHeadersText(TEMPLATES[idx].headers);
    setBodyText(TEMPLATES[idx].body);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      const splitIndex = text.search(/\r?\n\r?\n/);
      if (splitIndex !== -1) {
        setHeadersText(text.substring(0, splitIndex));
        setBodyText(text.substring(splitIndex).trim());
      } else {
        setHeadersText(text);
      }
    };
    reader.readAsText(file);
  };

  const handleIngestAndAnalyze = async () => {
    setAnalyzing(true);
    try {
      const parsed = parseRawEmail(headersText, bodyText);

      // Detect cryptocurrency wallet addresses in body/headers
      const detectedCryptoWallets: AdversaryCryptoWallet[] = [];
      const btcRegex = /\b(bc1[a-z0-9]{38,59}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})\b/g;
      const ethRegex = /\b(0x[a-fA-F0-9]{40})\b/g;
      
      const btcMatches = Array.from(new Set(bodyText.match(btcRegex) || [])) as string[];
      for (const addr of btcMatches) {
        detectedCryptoWallets.push({
          address: addr,
          currency: 'BTC',
          balance: '4.82 BTC (~$298,840 USD)',
          totalReceived: '18.90 BTC',
          txCount: 42,
          taintScore: 94,
          firstSeen: '2026-03-12',
          lastActive: '2026-09-04',
          isOfacSanctioned: true,
          mixerTransactionsDetected: true,
          riskVerdict: 'Sanctioned Entity',
          clusterLabel: 'ALPHV / BlackCat Ransomware Consortium',
        });
      }

      const ethMatches = Array.from(new Set(bodyText.match(ethRegex) || [])) as string[];
      for (const addr of ethMatches) {
        detectedCryptoWallets.push({
          address: addr,
          currency: 'ETH',
          balance: '18.4 ETH (~$46,000 USD)',
          totalReceived: '42.10 ETH',
          txCount: 19,
          taintScore: 88,
          firstSeen: '2026-05-01',
          lastActive: '2026-09-03',
          isOfacSanctioned: false,
          mixerTransactionsDetected: true,
          riskVerdict: 'Tainted Mixer',
          clusterLabel: 'AiTM Phish Kit & Tornado Cash Depositor',
        });
      }

      const rawProofTxHash = `0x${sha256Sync(parsed.sha256 + Date.now().toString())}`;
      const rawProofMerkle = `0x${sha256Sync(rawProofTxHash + 'consortium_root')}`;

      const incident: EmailIncident = {
        ...parsed,
        id: `inc-${Date.now()}`,
        status: 'investigating',
        receivedAt: new Date().toISOString(),
        blockchainProof: {
          blockNumber: 2,
          blockHash: '0x0000a91f82b73c4d9e01f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
          txHash: rawProofTxHash,
          timestamp: new Date().toISOString(),
          merkleRoot: rawProofMerkle,
          smartContractAddress: '0x3E11889a718290ccB382109848A1099238A792f4',
          smartContractAction: 'EvidenceChainOfCustody.sealEmailEvidence()',
          consensusSignatures: 5,
          validatorNode: 'Enterprise Primary Gateway Node (US-East)',
          isImmutable: true,
        },
        detectedCryptoWallets,
        chainOfCustody: [
          {
            id: `coc-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: 'INGESTED_VIA_GATEWAY_SIMULATOR',
            actor: 'SecOps Analyst',
            details: 'Raw RFC 822 MIME headers and body ingested for deep inspection',
            verificationHash: parsed.sha256 ? parsed.sha256.substring(0, 16) : '98f7e2a48b...',
          },
          {
            id: `coc-bc-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: 'BLOCKCHAIN_EVIDENCE_SEALED',
            actor: 'PoA Consensus Network',
            details: `Artifact sealed in Block #2 under Tx: ${rawProofTxHash.substring(0, 16)}...`,
            verificationHash: rawProofTxHash.substring(0, 16),
          },
        ],
        mitigationHistory: [],
      };

      try {
        const aiRes = await fetch('/api/analyze-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: incident.subject,
            bodyText: incident.bodyText,
            sender: incident.senderAddress,
            recipient: incident.recipientAddress,
            headers: incident.rawHeaders,
          }),
        });
        const aiData = await aiRes.json();
        if (aiData && aiData.fraudRiskScore !== undefined) {
          incident.fraudScore = aiData.fraudRiskScore;
          incident.classification = aiData.classification || incident.classification;
          if (aiData.summary) {
            incident.nlpAnalysis.detectedCues.unshift(`[AI Insight] ${aiData.summary}`);
          }
        }
      } catch (err) {
        console.warn('Gemini endpoint call fallback', err);
      }

      onIngestSuccess(incident);
      onClose();
    } catch (e) {
      console.error('Ingestion parse failed:', e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050507]/90 backdrop-blur-md p-4 overflow-y-auto font-mono">
      <div className="relative w-full max-w-3xl rounded-md border border-[#1A1A1F] bg-[#0A0A0F] shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A1A1F] px-6 py-4 bg-[#0A0A0F]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#00E0FF]/10 border border-[#00E0FF]/30 text-[#00E0FF] shadow-[0_0_10px_rgba(0,224,255,0.2)]">
              <Upload className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-white uppercase tracking-widest">
                Live Gateway Ingestion & Threat Simulator
              </h3>
              <p className="text-[10px] text-gray-500 font-sans mt-0.5">
                Inspect custom RFC 822 email headers, relay paths, and run Gemini AI analysis
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-sm p-1.5 text-gray-500 hover:bg-[#12121A] hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4 text-xs">
          {/* Quick Template Picker */}
          <div>
            <span className="text-gray-500 text-[10px] uppercase tracking-widest block mb-2 font-bold">
              Load Realistic Threat Scenario Template:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyTemplate(idx)}
                  className={`p-2.5 rounded-sm border text-left transition-all ${
                    selectedTemplateIndex === idx
                      ? 'border-[#00E0FF] bg-[#00E0FF]/10 text-[#00E0FF] font-bold shadow-[0_0_10px_rgba(0,224,255,0.2)]'
                      : 'border-[#1A1A1F] bg-[#12121A] text-gray-300 hover:border-gray-700'
                  }`}
                >
                  <div className="text-xs uppercase tracking-wider">{tmpl.name}</div>
                  <div className="text-[10px] text-gray-500 truncate mt-0.5">{tmpl.subject}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Or File Upload */}
          <div className="flex items-center justify-between bg-[#12121A] p-3 rounded-sm border border-[#1A1A1F]">
            <span className="text-gray-300 text-[11px]">Import from raw .eml / .txt file:</span>
            <label className="cursor-pointer flex items-center gap-1.5 rounded-sm border border-[#1A1A1F] bg-[#0A0A0F] px-3 py-1.5 text-[10px] text-gray-200 hover:text-white uppercase tracking-wider transition-colors">
              <Upload className="h-3.5 w-3.5 text-[#00E0FF]" />
              <span>Browse .eml file</span>
              <input type="file" accept=".eml,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Headers Textarea */}
          <div className="space-y-1.5">
            <span className="text-white font-bold uppercase text-[10px] tracking-widest">
              Raw RFC 822 Email Headers:
            </span>
            <textarea
              rows={8}
              value={headersText}
              onChange={(e) => setHeadersText(e.target.value)}
              className="w-full rounded-sm border border-[#1A1A1F] bg-[#050507] p-3 text-xs font-mono text-[#00E0FF] placeholder-gray-600 focus:border-[#00E0FF] focus:outline-none"
              placeholder="Paste RFC 822 headers here (Received, From, Return-Path, DKIM, etc.)..."
            />
          </div>

          {/* Body Textarea */}
          <div className="space-y-1.5">
            <span className="text-white font-bold uppercase text-[10px] tracking-widest">
              Email Message Plaintext Body:
            </span>
            <textarea
              rows={6}
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              className="w-full rounded-sm border border-[#1A1A1F] bg-[#050507] p-3 text-xs font-mono text-gray-300 placeholder-gray-600 focus:border-[#00E0FF] focus:outline-none"
              placeholder="Paste plaintext email message body..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#1A1A1F] px-6 py-4 bg-[#0A0A0F] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-sm bg-[#12121A] hover:bg-[#1A1A1F] text-gray-300 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleIngestAndAnalyze}
            disabled={analyzing}
            className="flex items-center gap-2 rounded-sm bg-[#FF3D00] hover:bg-red-600 text-white font-bold px-5 py-2 text-xs transition-colors shadow-[0_0_15px_rgba(255,61,0,0.3)] disabled:opacity-50 uppercase tracking-wider"
          >
            {analyzing ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Running Gemini AI & Hop Reconstruction...</span>
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5" />
                <span>Ingest & Execute Deep Forensics</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
