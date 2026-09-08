import React, { useState } from 'react';
import { ProtocolForensics } from '../types';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Mail,
  FileCode,
  Copy,
  Check,
  Search,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

interface HeaderForensicsTabProps {
  protocols: ProtocolForensics;
  rawHeaders: string;
}

export const HeaderForensicsTab: React.FC<HeaderForensicsTabProps> = ({
  protocols,
  rawHeaders,
}) => {
  const [copied, setCopied] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(rawHeaders);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLines = rawHeaders.split(/\r?\n/).filter((l) =>
    headerSearch ? l.toLowerCase().includes(headerSearch.toLowerCase()) : true
  );

  return (
    <div className="space-y-6">
      {/* 3 Core Authentication Protocols Grid - Immersive UI Theme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* SPF Card */}
        <div className="rounded-md border border-[#1F2937] bg-[#1F2937]/30 p-4 shadow-[0_0_20px_rgba(0,0,0,0.6)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound
                className={`h-4 w-4 ${
                  protocols.spf.status === 'pass' ? 'text-[#00FF41]' : 'text-[#FF3D00]'
                }`}
              />
              <span className="font-mono font-bold text-[#E5E7EB] text-xs uppercase tracking-wider">SPF Check</span>
            </div>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase ${
                protocols.spf.status === 'pass'
                  ? 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30'
                  : 'bg-[#FF3D00]/10 text-[#FF3D00] border border-[#FF3D00]/30'
              }`}
            >
              {protocols.spf.status}
            </span>
          </div>

          <p className="text-xs text-[#E5E7EB]/80 leading-relaxed font-sans">
            {protocols.spf.explanation}
          </p>

          <div className="space-y-1.5 text-[10px] font-mono border-t border-[#1F2937] pt-2.5">
            <div className="flex justify-between">
              <span className="text-[#E5E7EB]/60">Sender IP:</span>
              <span className="text-[#00FF41]">{protocols.spf.clientIp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#E5E7EB]/60">Domain:</span>
              <span className="text-[#E5E7EB]/80 truncate max-w-[140px]">{protocols.spf.domain}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#E5E7EB]/60">Record:</span>
              <span className="text-[#E5E7EB]/60 truncate max-w-[140px]">{protocols.spf.record}</span>
            </div>
          </div>
        </div>

        {/* DKIM Card */}
        <div className="rounded-md border border-[#1F2937] bg-[#1F2937]/30 p-4 shadow-[0_0_20px_rgba(0,0,0,0.6)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck
                className={`h-4 w-4 ${
                  protocols.dkim.status === 'pass' ? 'text-[#00FF41]' : 'text-[#FF3D00]'
                }`}
              />
              <span className="font-mono font-bold text-[#E5E7EB] text-xs uppercase tracking-wider">DKIM Signature</span>
            </div>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase ${
                protocols.dkim.status === 'pass'
                  ? 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30'
                  : 'bg-[#FF3D00]/10 text-[#FF3D00] border border-[#FF3D00]/30'
              }`}
            >
              {protocols.dkim.status}
            </span>
          </div>

          <p className="text-xs text-[#E5E7EB]/80 leading-relaxed font-sans">
            {protocols.dkim.explanation}
          </p>

          <div className="space-y-1.5 text-[10px] font-mono border-t border-[#1F2937] pt-2.5">
            <div className="flex justify-between">
              <span className="text-[#E5E7EB]/60">Selector:</span>
              <span className="text-[#E5E7EB]/80">{protocols.dkim.selector}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#E5E7EB]/60">Header Signature:</span>
              <span className={protocols.dkim.signatureHeaderValid ? 'text-[#00FF41]' : 'text-[#FF3D00]'}>
                {protocols.dkim.signatureHeaderValid ? 'Valid Cryptographic' : 'Corrupt / Forged'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#E5E7EB]/60">Domain Alignment:</span>
              <span className={protocols.dkim.aligned ? 'text-[#00FF41]' : 'text-[#FF3D00]'}>
                {protocols.dkim.aligned ? 'Aligned' : 'Unaligned'}
              </span>
            </div>
          </div>
        </div>

        {/* DMARC Card */}
        <div className="rounded-md border border-[#1F2937] bg-[#1F2937]/30 p-4 shadow-[0_0_20px_rgba(0,0,0,0.6)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert
                className={`h-4 w-4 ${
                  protocols.dmarc.status === 'pass' ? 'text-[#00FF41]' : 'text-[#FF3D00]'
                }`}
              />
              <span className="font-mono font-bold text-[#E5E7EB] text-xs uppercase tracking-wider">DMARC Policy</span>
            </div>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase ${
                protocols.dmarc.status === 'pass'
                  ? 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30'
                  : 'bg-[#FF3D00]/10 text-[#FF3D00] border border-[#FF3D00]/30'
              }`}
            >
              {protocols.dmarc.status}
            </span>
          </div>

          <p className="text-xs text-[#E5E7EB]/80 leading-relaxed font-sans">
            {protocols.dmarc.explanation}
          </p>

          <div className="space-y-1.5 text-[10px] font-mono border-t border-[#1F2937] pt-2.5">
            <div className="flex justify-between">
              <span className="text-[#E5E7EB]/60">Configured Policy:</span>
              <span className="text-[#00FF41] font-bold uppercase">p={protocols.dmarc.policy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#E5E7EB]/60">Disposition:</span>
              <span className="text-[#E5E7EB]/80 uppercase">{protocols.dmarc.disposition}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#E5E7EB]/60">Identifier Alignment:</span>
              <span className={protocols.dmarc.alignment === 'aligned' ? 'text-[#00FF41]' : 'text-[#FF3D00]'}>
                {protocols.dmarc.alignment}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Header Fields & Anomalies Inspection Matrix */}
      <div className="rounded-md border border-[#1F2937] bg-[#000000] p-4 shadow-[0_0_30px_rgba(0,0,0,0.7)]">
        <h4 className="text-xs font-bold uppercase tracking-widest text-[#E5E7EB] mb-4 flex items-center gap-2 font-mono">
          <Mail className="h-4 w-4 text-[#00FF41]" />
          Transmission Envelope & Field Anomaly Audit
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Field 1: Return-Path vs From */}
          <div className="rounded-sm border border-[#1F2937] bg-[#1F2937]/40 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#E5E7EB]">Return-Path vs From Alignment</span>
              {protocols.returnPathMatch ? (
                <span className="flex items-center text-[10px] font-mono text-[#00FF41] font-bold">
                  <Check className="h-3 w-3 mr-1" /> Aligned
                </span>
              ) : (
                <span className="flex items-center text-[10px] font-mono text-[#FF3D00] font-bold">
                  <AlertTriangle className="h-3 w-3 mr-1" /> Mismatch / Bounce Diverted
                </span>
              )}
            </div>
            <div className="text-[10px] font-mono space-y-1 text-[#E5E7EB]/60">
              <div>From: <span className="text-[#E5E7EB]">{protocols.fromHeader}</span></div>
              <div>Return-Path: <span className={protocols.returnPathMatch ? 'text-[#E5E7EB]' : 'text-[#FF3D00] font-semibold'}>{protocols.returnPath}</span></div>
            </div>
          </div>

          {/* Field 2: Reply-To Trap Check */}
          <div className="rounded-sm border border-[#1F2937] bg-[#1F2937]/40 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#E5E7EB]">Reply-To Routing Trap</span>
              {protocols.replyToMismatch ? (
                <span className="flex items-center text-[10px] font-mono text-[#FF3D00] font-bold animate-pulse">
                  <AlertTriangle className="h-3 w-3 mr-1" /> Exfiltration Trap Detected
                </span>
              ) : (
                <span className="flex items-center text-[10px] font-mono text-[#00FF41] font-bold">
                  <Check className="h-3 w-3 mr-1" /> Identical
                </span>
              )}
            </div>
            <div className="text-[10px] font-mono space-y-1 text-[#E5E7EB]/60">
              <div>Reply-To: <span className={protocols.replyToMismatch ? 'text-[#FF3D00] font-bold' : 'text-[#E5E7EB]'}>{protocols.replyToHeader}</span></div>
              <p className="text-[9px] text-[#E5E7EB]/40 leading-tight">
                {protocols.replyToMismatch
                  ? 'User responses are redirected to an external adversary mailbox instead of the apparent sender.'
                  : 'Replies route back to the verified originating sender.'}
              </p>
            </div>
          </div>

          {/* Field 3: Message-ID Integrity */}
          <div className="rounded-sm border border-[#1F2937] bg-[#1F2937]/40 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#E5E7EB]">Message-ID Structural Integrity</span>
              {protocols.messageIdAnomaly ? (
                <span className="flex items-center text-[10px] font-mono text-[#FF3D00] font-bold">
                  <AlertTriangle className="h-3 w-3 mr-1" /> Forged / Synthetic Client
                </span>
              ) : (
                <span className="flex items-center text-[10px] font-mono text-[#00FF41] font-bold">
                  <Check className="h-3 w-3 mr-1" /> Standard FQDN Structure
                </span>
              )}
            </div>
            <div className="text-[10px] font-mono text-[#E5E7EB]/60 break-all">
              <span className="text-[#E5E7EB]">{protocols.messageId}</span>
            </div>
          </div>

          {/* Field 4: TLS Cipher & Encryption */}
          <div className="rounded-sm border border-[#1F2937] bg-[#1F2937]/40 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#E5E7EB]">Transport Security (TLS)</span>
              <span className="flex items-center text-[10px] font-mono text-[#00FF41]">
                <Lock className="h-3 w-3 mr-1" /> {protocols.tlsVersion}
              </span>
            </div>
            <div className="text-[10px] font-mono space-y-1 text-[#E5E7EB]/60">
              <div>Cipher: <span className="text-[#E5E7EB]">{protocols.cipherSuite}</span></div>
              <div className="text-[9px] text-[#E5E7EB]/40">
                {protocols.tlsVersion.includes('Outdated')
                  ? 'Warning: Outdated TLS negotiation allows adversary MITM eavesdropping.'
                  : 'Standard transport layer encryption active.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Headers Viewer */}
      <div className="rounded-md border border-[#1F2937] bg-[#000000] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        <div className="flex flex-wrap items-center justify-between border-b border-[#1F2937] px-4 py-3 bg-[#1F2937]/40">
          <div className="flex items-center gap-2">
            <FileCode className="h-4 w-4 text-[#00FF41]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#E5E7EB] font-mono">
              Raw RFC 822 Email Headers Stream
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[#E5E7EB]/50" />
              <input
                type="text"
                placeholder="Filter header keys..."
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                className="rounded-sm border border-[#1F2937] bg-[#000000] pl-8 pr-3 py-1 text-xs font-mono text-[#E5E7EB] placeholder-[#E5E7EB]/40 focus:border-[#00FF41] focus:outline-none"
              />
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-sm border border-[#1F2937] bg-[#1F2937] px-2.5 py-1 text-xs font-mono text-[#E5E7EB] hover:text-[#00FF41] hover:border-[#00FF41]/40 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[#00FF41]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Headers'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 max-h-[380px] overflow-y-auto font-mono text-xs text-[#E5E7EB]/80 leading-relaxed bg-[#000000] divide-y divide-[#1F2937]">
          {filteredLines.map((line, idx) => {
            const isColon = line.indexOf(':');
            const key = isColon > -1 ? line.substring(0, isColon) : '';
            const val = isColon > -1 ? line.substring(isColon + 1) : line;
            const isCriticalHeader = /received|from|return-path|authentication-results|dkim|spf/i.test(key);

            return (
              <div key={idx} className="py-1 hover:bg-[#1F2937]/30 px-1 rounded-sm transition-colors flex gap-2">
                {key ? (
                  <>
                    <span className={`font-semibold shrink-0 select-none ${isCriticalHeader ? 'text-[#00FF41]' : 'text-[#E5E7EB]/50'}`}>
                      {key}:
                    </span>
                    <span className="text-[#E5E7EB]/80 break-all">{val}</span>
                  </>
                ) : (
                  <span className="text-[#E5E7EB]/50 pl-4 break-all">{line}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
