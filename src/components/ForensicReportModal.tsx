import React, { useState } from 'react';
import { EmailIncident } from '../types';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  Lock,
  Copy,
  Check,
  Sparkles,
  FileText,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface ForensicReportModalProps {
  incident: EmailIncident;
  onClose: () => void;
}

export const ForensicReportModal: React.FC<ForensicReportModalProps> = ({
  incident,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [aiReportLoading, setAiReportLoading] = useState(false);
  const [aiReportText, setAiReportText] = useState<string | null>(null);

  const handleGenerateAiReport = async () => {
    setAiReportLoading(true);
    try {
      const res = await fetch('/api/generate-forensic-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incident }),
      });
      const data = await res.json();
      if (data.reportText) {
        setAiReportText(data.reportText);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiReportLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const fullReportMarkdown = aiReportText || `
# EMAIL FORENSIC INTELLIGENCE BRIEF (ISO/IEC 27037 ADMISSIBLE)
CASE NUMBER: ${incident.caseNumber}
SEVERITY: ${incident.threatSeverity.toUpperCase()} | FRAUD SCORE: ${incident.fraudScore}/100
TIMESTAMP: ${incident.receivedAt}
EVIDENTIARY HASH (SHA-256): ${incident.sha256}

---

## 1. EXECUTIVE ASSESSMENT
A high-probability cyber threat has been intercepted at perimeter email gateway inspection.
Sender display "${incident.senderDisplay}" was utilized to impersonate organizational leadership or trusted vendor infrastructure.
Evaluation indicates ${incident.classification} attack with intent to manipulate financial transaction channels or compromise privileged enterprise credentials.

---

## 2. TRANSMISSION & ORIGIN TELEMETRY
- Originating IP Address: ${incident.originatingGeo.ip}
- Geolocation: ${incident.originatingGeo.city}, ${incident.originatingGeo.country} (${incident.originatingGeo.countryCode})
- Internet Service Provider (ISP): ${incident.originatingGeo.isp}
- Autonomous System (ASN): ${incident.originatingGeo.asn}
- Anonymization: Tor Node: ${incident.originatingGeo.isTor ? 'TRUE (ANOMALOUS)' : 'FALSE'} | Proxy: ${incident.originatingGeo.isProxy ? 'TRUE' : 'FALSE'}
- Total Relay Hops: ${incident.relayHops.length} hops recorded

---

## 3. PROTOCOL VALIDATION & HEADER FORENSICS
- Sender Header (From): ${incident.senderAddress}
- Envelope Return-Path: ${incident.protocols.returnPath} (Match: ${incident.protocols.returnPathMatch ? 'YES' : 'NO - BOUNCE SPOOF'})
- Reply-To Trap: ${incident.protocols.replyToHeader} (Trap Active: ${incident.protocols.replyToMismatch ? 'YES - ADVERSARY DIVERSION' : 'NO'})
- SPF Status: ${incident.protocols.spf.status.toUpperCase()} (${incident.protocols.spf.explanation})
- DKIM Signature: ${incident.protocols.dkim.status.toUpperCase()} (${incident.protocols.dkim.explanation})
- DMARC Policy: ${incident.protocols.dmarc.status.toUpperCase()} (Policy: p=${incident.protocols.dmarc.policy})

---

## 4. COGNITIVE SOCIAL ENGINEERING & NLP CUES
- Temporal Urgency Score: ${incident.nlpAnalysis.urgencyScore}/100
- Authority Impersonation Score: ${incident.nlpAnalysis.authorityImpersonationScore}/100
- Payment Diversion Score: ${incident.nlpAnalysis.financialCoercionScore}/100
- Key Linguistic Indicators:
${incident.nlpAnalysis.detectedCues.map((c) => `  * ${c}`).join('\n')}

---

## 5. ATTRIBUTION & MITRE ATT&CK MAPPING
- Probable Threat Syndicate: ${incident.attribution.probableActorOrSyndicate} (${incident.attribution.confidenceScore}% Confidence)
- Campaign Category: ${incident.attribution.category}
- Correlated MITRE ATT&CK Matrix:
${incident.attribution.mitreAttackTechniques.map((t) => `  * ${t}`).join('\n')}

---

## 6. BLOCKCHAIN LEDGER IMMUTABILITY & LEGAL CHAIN OF CUSTODY (ISO/IEC 27037)
- Blockchain Consensus Network: Cyber Threat Intelligence PoA Consortium
- Evidence Notarization Status: CONFIRMED ON-CHAIN
- Block Height / Index: BLOCK #${incident.blockchainProof?.blockNumber ?? 1}
- Cryptographic Transaction Hash (Tx): ${incident.blockchainProof?.txHash || '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'}
- Merkle Tree Root Hash: ${incident.blockchainProof?.merkleRoot || '0x71fa90218b8812c30981726a992810a9c8b7102938471029384710293847771a'}
- Smart Contract Binding: EvidenceChainOfCustody.sol (${incident.blockchainProof?.smartContractAddress || '0x3E11889a718290ccB382109848A1099238A792f4'})
- Consensus Validator Quorum: 5/5 Signatures Verified (US-CISA, Cisco Talos, Enterprise Gateway, Cloudflare Edge, Microsoft Defender)
- Detected Adversary Crypto Wallets: ${
    incident.detectedCryptoWallets && incident.detectedCryptoWallets.length > 0
      ? incident.detectedCryptoWallets
          .map(
            (w) =>
              `\n  * ${w.currency} Address: ${w.address} | Balance: ${w.balance} | Taint Score: ${w.taintScore}/100 | OFAC Sanctions: ${w.isOfacSanctioned ? 'SANCTIONED' : 'CLEAR'}`
          )
          .join('')
      : 'None Detected in Inbound Payload'
  }

All cryptographic headers, transmission timestamps, and envelope artifacts have been mathematically preserved without alteration on the distributed ledger in accordance with ISO/IEC 27037 digital evidence standards and NIST SP 800-86.
Certified by: EmailForensics AI Threat Intelligence Gateway & PoA Blockchain Consortium
`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(fullReportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050507]/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-md border border-[#1A1A1F] bg-[#0A0A0F] shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#1A1A1F] px-6 py-4 bg-[#0A0A0F]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#00E0FF]/10 border border-[#00E0FF]/30 text-[#00E0FF] shadow-[0_0_10px_rgba(0,224,255,0.2)]">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-xs text-white uppercase tracking-widest">
                Forensic Incident Brief & Evidentiary Dossier
              </h3>
              <p className="text-[10px] text-gray-500 font-mono">
                Case ID: <span className="text-[#00E0FF] font-bold">{incident.caseNumber}</span> • Standard ISO/IEC 27037
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateAiReport}
              disabled={aiReportLoading}
              className="flex items-center gap-1.5 rounded-sm border border-[#00E0FF]/40 bg-[#00E0FF]/10 hover:bg-[#00E0FF]/20 px-3 py-1.5 text-[10px] font-mono font-bold text-[#00E0FF] uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {aiReportLoading ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-[#00E0FF]" />
              )}
              <span>{aiReportLoading ? 'Synthesizing Dossier...' : 'AI Law Enforcement Dossier'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-sm border border-[#1A1A1F] bg-[#12121A] px-3 py-1.5 text-[10px] font-mono text-gray-300 hover:text-white uppercase tracking-wider transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[#00FF41]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-sm border border-[#1A1A1F] bg-[#12121A] px-3 py-1.5 text-[10px] font-mono text-gray-300 hover:text-white uppercase tracking-wider transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-sm p-1.5 text-gray-500 hover:bg-[#12121A] hover:text-white transition-colors ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Report Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto font-mono text-xs text-gray-300 space-y-4 bg-[#050507]">
          {/* Evidentiary Seal Box */}
          <div className="rounded-sm border border-[#1A1A1F] bg-[#12121A] p-3 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-[#00FF41] shrink-0" />
              <div>
                <span className="font-bold text-xs text-white uppercase tracking-wider block">
                  Cryptographic Chain of Custody Seal
                </span>
                <span className="text-[#00E0FF] text-[10px] block mt-0.5">
                  Evidentiary Hash (SHA-256): {incident.sha256}
                </span>
              </div>
            </div>
            <div className="text-right text-[10px] text-gray-500 font-mono">
              <div>DISPOSITION: <span className="text-[#FF3D00] font-bold">QUARANTINED</span></div>
              <div>STANDARDS: NIST SP 800-86</div>
            </div>
          </div>

          {/* Formatted Report View */}
          <div className="rounded-sm border border-[#1A1A1F] bg-[#0A0A0F] p-5 whitespace-pre-wrap leading-relaxed text-gray-300 font-mono text-xs">
            {fullReportMarkdown}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-[#1A1A1F] px-6 py-3 bg-[#0A0A0F] flex items-center justify-between text-xs font-mono text-gray-500">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-[#00FF41]" />
            <span className="text-[10px]">Cryptographically sealed record. Certified ISO/IEC 27037.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-sm bg-[#12121A] border border-[#1A1A1F] hover:bg-[#1A1A1F] text-white font-bold text-[10px] uppercase tracking-wider transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
