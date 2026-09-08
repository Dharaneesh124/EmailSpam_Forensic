import React, { useState } from 'react';
import { EmailIncident } from '../types';
import { HeaderForensicsTab } from './HeaderForensicsTab';
import { RelayHopTrace } from './RelayHopTrace';
import { GeoIntelTab } from './GeoIntelTab';
import { AttributionGraph } from './AttributionGraph';
import { NlpAnalysisTab } from './NlpAnalysisTab';
import { BlockchainForensicsTab } from './BlockchainForensicsTab';
import { MailOriginGeoPicture } from './MailOriginGeoPicture';
import {
  ShieldAlert,
  ShieldCheck,
  Radio,
  FileCode,
  Globe,
  Brain,
  Network,
  Download,
  AlertTriangle,
  Lock,
  CheckCircle2,
  FileText,
  Ban,
  UserX,
  Blocks,
  Coins,
  MapPin,
} from 'lucide-react';

interface EmailAnalyzerProps {
  incident: EmailIncident;
  onQuarantine?: (id: string) => void;
  onBlockIp?: (ip: string) => void;
  onGenerateReport?: (incident: EmailIncident) => void;
  maskPii?: boolean;
}

export const EmailAnalyzer: React.FC<EmailAnalyzerProps> = ({
  incident,
  onQuarantine,
  onBlockIp,
  onGenerateReport,
  maskPii = false,
}) => {
  const [activeTab, setActiveTab] = useState<
    'protocols' | 'hops' | 'geo' | 'nlp' | 'attribution' | 'blockchain' | 'raw'
  >('protocols');
  const [showGeoPicture, setShowGeoPicture] = useState(true);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);

  const maskEmail = (email: string) => {
    if (!maskPii) return email;
    const parts = email.split('@');
    if (parts.length < 2) return email;
    const user = parts[0];
    const maskedUser = user.length > 2 ? user[0] + '***' + user[user.length - 1] : '***';
    return `${maskedUser}@${parts[1]}`;
  };

  const maskText = (text: string) => {
    if (!maskPii) return text;
    return text
      .replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[REDACTED_PHONE]')
      .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, (match) => maskEmail(match))
      .replace(/\$\d+(?:,\d{3})*(?:\.\d{2})?/g, '[REDACTED_AMOUNT]');
  };

  const handleRunAi = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/analyze-email', {
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
      const data = await res.json();
      setAiResponse(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const isCritical = incident.threatSeverity === 'critical';
  const isHigh = incident.threatSeverity === 'high';
  const scoreColor = isCritical
    ? 'text-[#FF3D00]'
    : isHigh
    ? 'text-[#EAB308]'
    : 'text-[#00FF41]';

  return (
    <div className="space-y-6">
      {/* Incident Case Banner - Immersive UI Theme */}
      <div className="rounded-md border border-[#1F2937] bg-[#000000] p-4 shadow-[0_0_40px_rgba(0,0,0,0.85)]">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#1F2937] pb-4 mb-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#E5E7EB]/60">
              <span className="text-xs font-bold text-[#E5E7EB] uppercase tracking-widest bg-[#1F2937] px-3 py-1 rounded-full border border-[#1F2937]">
                CASE: {incident.caseNumber}
              </span>
              <span className="text-[#E5E7EB]/30">•</span>
              <span className="text-xs text-[#00FF41] font-mono font-semibold">
                ORIGIN: {incident.originatingGeo.city}, {incident.originatingGeo.country}
              </span>
              <span className="text-[#E5E7EB]/30">•</span>
              <span className="text-[10px] text-[#E5E7EB]/70 font-mono">
                LAT: {incident.originatingGeo.lat} / LONG: {incident.originatingGeo.lng}
              </span>
              <span className="text-[#E5E7EB]/30">•</span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase font-mono ${
                  incident.status === 'quarantined'
                    ? 'bg-[#FF3D00]/10 text-[#FF3D00] border border-[#FF3D00]/30'
                    : incident.status === 'blocked'
                    ? 'bg-[#FF3D00]/20 text-[#FF3D00] border border-[#FF3D00]/40'
                    : 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30'
                }`}
              >
                STATUS: {incident.status}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-[#E5E7EB] font-mono tracking-wide leading-snug">
              {incident.subject}
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-[#E5E7EB]/70 pt-0.5">
              <div>
                From: <span className="text-[#E5E7EB] font-semibold">{maskEmail(incident.senderAddress)}</span>
                <span className="text-[#E5E7EB]/50 ml-1">({maskText(incident.senderDisplay)})</span>
              </div>
              <div className="text-[#00FF41]">→</div>
              <div>
                To: <span className="text-[#00FF41] font-semibold">{maskEmail(incident.recipientAddress)}</span>
              </div>
            </div>
          </div>

          {/* Threat Score Gauge & Primary Actions */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-right font-mono">
              <div className="text-[10px] text-[#E5E7EB]/50 uppercase font-bold tracking-wider">
                Fraud Risk Score
              </div>
              <div className={`text-2xl font-black ${scoreColor}`}>
                {incident.fraudScore}
                <span className="text-xs font-normal text-[#E5E7EB]/50">/100</span>
              </div>
              <span
                className={`inline-block text-[9px] font-bold uppercase rounded-sm px-1.5 py-0.2 ${
                  isCritical
                    ? 'bg-[#FF3D00]/10 text-[#FF3D00] border border-[#FF3D00]/30'
                    : isHigh
                    ? 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/30'
                    : 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30'
                }`}
              >
                {incident.classification}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1.5 font-mono">
              <button
                onClick={() => onGenerateReport && onGenerateReport(incident)}
                className="bg-[#00FF41] text-black px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase hover:bg-[#00e63a] transition-colors shadow-[0_0_15px_rgba(0,255,65,0.35)] flex items-center justify-center gap-1.5 tracking-wider"
              >
                <FileText className="h-3.5 w-3.5 text-black" />
                <span>Forensic Brief</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowGeoPicture(!showGeoPicture)}
                  title="Toggle GeoLocation Origin Picture showing where mail was raised to recipient"
                  className={`px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase transition-colors flex items-center justify-center gap-1.5 tracking-wider border flex-1 ${
                    showGeoPicture
                      ? 'bg-[#00FF41]/15 text-[#00FF41] border-[#00FF41]/40 shadow-[0_0_10px_rgba(0,255,65,0.2)]'
                      : 'bg-[#1F2937] text-[#E5E7EB]/70 border-[#1F2937] hover:text-[#E5E7EB]'
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{showGeoPicture ? 'Geo Picture: ON' : 'Geo Picture: OFF'}</span>
                </button>

                <button
                  onClick={() => onBlockIp && onBlockIp(incident.originatingGeo.ip)}
                  className="bg-[#1F2937] text-[#FF3D00] border border-[#FF3D00]/30 hover:bg-[#FF3D00]/10 px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase transition-colors flex items-center justify-center gap-1.5 tracking-wider"
                  title="Block this Origin IP on firewall"
                >
                  <Ban className="h-3.5 w-3.5" />
                  <span>Block IP</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cryptographic Hash Verification Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[#E5E7EB]/70 bg-[#1F2937]/50 p-2.5 rounded-sm border border-[#1F2937]">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-[#00FF41]" />
            <span className="text-[#E5E7EB]/60">SHA-256 Evidence Seal:</span>
            <span className="text-[#E5E7EB] font-semibold truncate max-w-sm">{incident.sha256}</span>
          </div>
          <div className="text-[#E5E7EB]/50 uppercase tracking-wider text-[9px]">
            Chain-of-Custody Sealed • ISO/IEC 27037 Standard
          </div>
        </div>
      </div>

      {/* Primary GeoLocation Picture: Shows where mail was raised to them */}
      {showGeoPicture && (
        <MailOriginGeoPicture incident={incident} />
      )}

      {/* Forensic Navigation Tabs - Immersive UI Theme */}
      <div className="flex flex-wrap gap-1 bg-[#1F2937]/60 p-1 rounded-sm border border-[#1F2937]">
        <button
          onClick={() => setActiveTab('protocols')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all uppercase tracking-wider ${
            activeTab === 'protocols'
              ? 'bg-[#1F2937] text-[#00FF41] border border-[#00FF41]/40 shadow-[0_0_12px_rgba(0,255,65,0.25)]'
              : 'text-[#E5E7EB]/60 hover:text-[#E5E7EB] border border-transparent'
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Protocol & Header Forensics</span>
        </button>

        <button
          onClick={() => setActiveTab('hops')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all uppercase tracking-wider ${
            activeTab === 'hops'
              ? 'bg-[#1F2937] text-[#00FF41] border border-[#00FF41]/40 shadow-[0_0_12px_rgba(0,255,65,0.25)]'
              : 'text-[#E5E7EB]/60 hover:text-[#E5E7EB] border border-transparent'
          }`}
        >
          <Radio className="h-3.5 w-3.5" />
          <span>SMTP Relay Hop Trace ({incident.relayHops.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('geo')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all uppercase tracking-wider ${
            activeTab === 'geo'
              ? 'bg-[#1F2937] text-[#00FF41] border border-[#00FF41]/40 shadow-[0_0_12px_rgba(0,255,65,0.25)]'
              : 'text-[#E5E7EB]/60 hover:text-[#E5E7EB] border border-transparent'
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          <span>GeoLocation & Domain Intel</span>
        </button>

        <button
          onClick={() => setActiveTab('nlp')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all uppercase tracking-wider ${
            activeTab === 'nlp'
              ? 'bg-[#1F2937] text-[#00FF41] border border-[#00FF41]/40 shadow-[0_0_12px_rgba(0,255,65,0.25)]'
              : 'text-[#E5E7EB]/60 hover:text-[#E5E7EB] border border-transparent'
          }`}
        >
          <Brain className="h-3.5 w-3.5" />
          <span>Cognitive NLP & Threat Indicators</span>
        </button>

        <button
          onClick={() => setActiveTab('attribution')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all uppercase tracking-wider ${
            activeTab === 'attribution'
              ? 'bg-[#1F2937] text-[#00FF41] border border-[#00FF41]/40 shadow-[0_0_12px_rgba(0,255,65,0.25)]'
              : 'text-[#E5E7EB]/60 hover:text-[#E5E7EB] border border-transparent'
          }`}
        >
          <Network className="h-3.5 w-3.5" />
          <span>Attribution Graph & MITRE</span>
        </button>

        <button
          onClick={() => setActiveTab('blockchain')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all uppercase tracking-wider ${
            activeTab === 'blockchain'
              ? 'bg-[#1F2937] text-[#00FF41] border border-[#00FF41]/40 shadow-[0_0_12px_rgba(0,255,65,0.25)]'
              : 'text-[#E5E7EB]/60 hover:text-[#E5E7EB] border border-transparent'
          }`}
        >
          <Blocks className="h-3.5 w-3.5" />
          <span>Blockchain Proof & Wallets ({incident.detectedCryptoWallets?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('raw')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all uppercase tracking-wider ${
            activeTab === 'raw'
              ? 'bg-[#1F2937] text-[#00FF41] border border-[#00FF41]/40 shadow-[0_0_12px_rgba(0,255,65,0.25)]'
              : 'text-[#E5E7EB]/60 hover:text-[#E5E7EB] border border-transparent'
          }`}
        >
          <FileCode className="h-3.5 w-3.5" />
          <span>Decoded Body & Payload</span>
        </button>
      </div>

      {/* Active Tab Content */}
      <div className="pt-2">
        {activeTab === 'protocols' && (
          <HeaderForensicsTab
            protocols={incident.protocols}
            rawHeaders={incident.rawHeaders}
          />
        )}

        {activeTab === 'hops' && <RelayHopTrace hops={incident.relayHops} />}

        {activeTab === 'geo' && (
          <GeoIntelTab
            originGeo={incident.originatingGeo}
            domainIntel={incident.domainIntel}
            incident={incident}
          />
        )}

        {activeTab === 'nlp' && (
          <NlpAnalysisTab
            nlp={incident.nlpAnalysis}
            urls={incident.urls}
            attachments={incident.attachments}
            incident={incident}
            onRunAiAnalysis={handleRunAi}
            aiLoading={aiLoading}
            aiResponse={aiResponse}
          />
        )}

        {activeTab === 'attribution' && (
          <AttributionGraph
            attribution={incident.attribution}
            incident={incident}
          />
        )}

        {activeTab === 'blockchain' && (
          <BlockchainForensicsTab
            incident={incident}
          />
        )}

        {activeTab === 'raw' && (
          <div className="rounded-md border border-[#1F2937] bg-[#000000] p-4 space-y-4 font-mono text-xs shadow-[0_0_40px_rgba(0,0,0,0.85)]">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <span className="font-bold text-[#E5E7EB] uppercase tracking-widest text-[10px]">
                Sanitized Email Plaintext Payload Content
              </span>
              <span className="text-[10px] text-[#E5E7EB]/50 uppercase font-mono">
                {maskPii ? 'PII Compliance Active (Redacted)' : 'Raw Unmasked Mode'}
              </span>
            </div>

            <div className="p-4 bg-[#1F2937]/40 rounded-sm border border-[#1F2937] text-[#E5E7EB] whitespace-pre-wrap leading-relaxed">
              {maskText(incident.bodyText)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
