import React, { useState } from 'react';
import { EmailIncident, GeoLocation, RelayHop } from '../types';
import { MailOriginGeoPicture } from './MailOriginGeoPicture';
import { WorldThreatMap } from './WorldThreatMap';
import { RelayHopTrace } from './RelayHopTrace';
import { HeaderForensicsTab } from './HeaderForensicsTab';
import { NlpAnalysisTab } from './NlpAnalysisTab';
import { BlockchainForensicsTab } from './BlockchainForensicsTab';
import {
  AlertOctagon,
  ShieldAlert,
  MapPin,
  Globe,
  Radio,
  FileText,
  Lock,
  Download,
  AlertTriangle,
  Layers,
  ArrowRight,
  Server,
  Compass,
  Cpu,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Ban,
  Clock,
  Navigation,
} from 'lucide-react';

interface SpamForensicsViewProps {
  spamIncidents: EmailIncident[];
  selectedIncident: EmailIncident;
  onSelectIncident: (inc: EmailIncident) => void;
  onQuarantine: (id: string) => void;
  onBlockIp: (ip: string) => void;
  onGenerateReport: (inc: EmailIncident) => void;
  theme: 'light' | 'dark' | 'cyber';
  userEmail: string;
  maskPii?: boolean;
}

export const SpamForensicsView: React.FC<SpamForensicsViewProps> = ({
  spamIncidents,
  selectedIncident,
  onSelectIncident,
  onQuarantine,
  onBlockIp,
  onGenerateReport,
  theme,
  userEmail,
  maskPii = false,
}) => {
  const [spamViewMode, setSpamViewMode] = useState<'inspector' | 'all_locations_map'>('inspector');
  const [activeForensicTab, setActiveForensicTab] = useState<
    'location_map' | 'hops' | 'protocols' | 'nlp_threats' | 'blockchain' | 'raw_headers'
  >('location_map');

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const isLight = theme === 'light';
  const isCyber = theme === 'cyber';

  const originGeo = selectedIncident.originatingGeo;

  // Run Gemini AI Threat Analysis
  const handleRunAiAnalysis = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/analyze-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedIncident.subject,
          bodyText: selectedIncident.bodyText,
          sender: selectedIncident.senderAddress,
          recipient: selectedIncident.recipientAddress,
          headers: selectedIncident.rawHeaders,
        }),
      });
      const data = await res.json();
      setAiResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const allOriginGeos = spamIncidents.map((inc) => ({
    geo: inc.originatingGeo,
    caseNumber: inc.caseNumber,
    threat: inc.classification,
    score: inc.fraudScore,
  }));

  const getCountryFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <div id="spam-forensics-container" className="space-y-4">
      {/* Top Warning Alert Banner */}
      <div
        className={`p-4 rounded-2xl border shadow-xs transition-all ${
          isLight
            ? 'bg-[#fef2f2] border-[#fecaca] text-[#991b1b]'
            : isCyber
            ? 'bg-[#1a0505] border-[#FF3D00]/50 text-[#FF8A80]'
            : 'bg-[#2a1717] border-[#592424] text-[#fca5a5]'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <AlertOctagon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm flex items-center gap-2">
                <span>Spam & Threat Interception Active</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-200 font-mono">
                  {spamIncidents.length} High-Risk Emails Flagged
                </span>
              </div>
              <p className="text-xs opacity-90 mt-0.5">
                The following spam emails were intercepted before reaching{' '}
                <strong className="font-mono">{userEmail}</strong>. Forensic intelligence, geolocation coordinates, and network origin routes have been collected.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSpamViewMode(spamViewMode === 'inspector' ? 'all_locations_map' : 'inspector')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                spamViewMode === 'all_locations_map'
                  ? 'bg-red-600 text-white border-red-600 shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900 hover:bg-red-50'
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{spamViewMode === 'all_locations_map' ? 'Back to Email Inspector' : 'View All Spam Locations Map'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Spam Locations Map View (when toggled) */}
      {spamViewMode === 'all_locations_map' ? (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 font-bold text-sm text-gray-800 dark:text-gray-200">
                <MapPin className="h-4 w-4 text-red-600" />
                <span>Geographic Origins of All Intercepted Spam Mails</span>
              </div>
              <span className="text-xs text-gray-500 font-mono">
                Target Recipient: {userEmail}
              </span>
            </div>
            <div className="pt-4">
              <WorldThreatMap
                originGeo={selectedIncident.originatingGeo}
                relayHops={selectedIncident.relayHops}
                allOriginGeos={allOriginGeos}
                onSelectGeo={(geo) => {
                  const matched = spamIncidents.find((i) => i.originatingGeo.ip === geo.ip);
                  if (matched) {
                    onSelectIncident(matched);
                    setSpamViewMode('inspector');
                  }
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Main Two-Pane Split Layout: Spam Email List + Forensic Details & Location Display */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Spam Emails List (4/12 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <span>Spam Quarantine ({spamIncidents.length})</span>
              <span className="text-[10px] text-red-600 font-bold font-mono">HIGHEST SEVERITY</span>
            </div>

            <div className="space-y-2">
              {spamIncidents.map((inc) => {
                const isSelected = inc.id === selectedIncident.id;
                const flagEmoji = getCountryFlagEmoji(inc.originatingGeo.countryCode);

                return (
                  <div
                    key={inc.id}
                    onClick={() => onSelectIncident(inc)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? isLight
                          ? 'bg-red-50/80 border-red-300 ring-2 ring-red-400 shadow-sm'
                          : isCyber
                          ? 'bg-[#1a0505] border-[#FF3D00] shadow-[0_0_15px_rgba(255,61,0,0.3)]'
                          : 'bg-red-950/40 border-red-700 shadow-sm'
                        : isLight
                        ? 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-xs'
                        : isCyber
                        ? 'bg-[#0A0A0F] border-gray-800 hover:border-[#00FF41]/40'
                        : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className={`flex items-center gap-1.5 font-bold text-xs truncate ${
                          isLight ? 'text-black' : 'text-white'
                        }`}>
                          <span>{flagEmoji}</span>
                          <span className="truncate">{inc.senderDisplay}</span>
                        </div>
                        <div className={`text-[11px] font-mono truncate ${
                          isLight ? 'text-gray-700 font-medium' : 'text-gray-400'
                        }`}>
                          {inc.senderAddress}
                        </div>
                      </div>
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200 border border-red-200 dark:border-red-800">
                        {inc.fraudScore}/100
                      </span>
                    </div>

                    <div className={`mt-2 text-xs font-semibold line-clamp-2 ${
                      isLight ? 'text-black' : 'text-white'
                    }`}>
                      {inc.subject}
                    </div>

                    {/* Location & Threat Tags */}
                    <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-500">
                      <span className="flex items-center gap-1 font-mono text-red-600 dark:text-red-400 font-semibold">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span>{inc.originatingGeo.city}, {inc.originatingGeo.country}</span>
                      </span>
                      <span className="font-mono text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                        {inc.classification}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Spam Mail Forensic Details & Location (8/12 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Header: Selected Spam Mail Quick Actions */}
            <div
              className={`p-4 rounded-2xl border shadow-xs ${
                isLight
                  ? 'bg-white border-gray-200 text-gray-900'
                  : isCyber
                  ? 'bg-[#0A0A0F] border-[#00FF41]/30 text-white'
                  : 'bg-gray-900 border-gray-800 text-white'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-900">
                      {selectedIncident.classification}
                    </span>
                    <span className="text-xs font-mono text-gray-400">
                      Case: {selectedIncident.caseNumber}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold mt-1 text-gray-900 dark:text-white">
                    {selectedIncident.subject}
                  </h2>
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-2 mt-1">
                    <span>From: <strong>{selectedIncident.senderAddress}</strong></span>
                    <span>•</span>
                    <span>To: <strong className="text-blue-600 font-mono">{userEmail}</strong></span>
                  </div>
                </div>

                {/* SOAR Action Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onQuarantine(selectedIncident.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                    title="Enforce gateway quarantine and broadcast block"
                  >
                    <Ban className="h-3.5 w-3.5" />
                    <span>Quarantine</span>
                  </button>

                  <button
                    onClick={() => onBlockIp(originGeo.ip)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                    title="Null-route originating IP across border firewall"
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>Block IP</span>
                  </button>

                  <button
                    onClick={() => onGenerateReport(selectedIncident)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-semibold transition-colors"
                    title="Generate legal PDF forensic chain of custody report"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Report</span>
                  </button>

                  <button
                    onClick={handleRunAiAnalysis}
                    disabled={aiLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                    title="Execute deep AI social engineering threat scan"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{aiLoading ? 'Analyzing...' : 'AI Threat Scan'}</span>
                  </button>
                </div>
              </div>

              {/* Forensic Details & Location Nav Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pt-3 text-xs font-medium scrollbar-none">
                <button
                  onClick={() => setActiveForensicTab('location_map')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                    activeForensicTab === 'location_map'
                      ? 'bg-red-600 text-white font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Attack Origin & Location</span>
                </button>

                <button
                  onClick={() => setActiveForensicTab('hops')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                    activeForensicTab === 'hops'
                      ? 'bg-red-600 text-white font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Radio className="h-3.5 w-3.5" />
                  <span>Relay Hops ({selectedIncident.relayHops.length})</span>
                </button>

                <button
                  onClick={() => setActiveForensicTab('protocols')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                    activeForensicTab === 'protocols'
                      ? 'bg-red-600 text-white font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>SPF / DKIM / DMARC</span>
                </button>

                <button
                  onClick={() => setActiveForensicTab('nlp_threats')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                    activeForensicTab === 'nlp_threats'
                      ? 'bg-red-600 text-white font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Cpu className="h-3.5 w-3.5" />
                  <span>Social Engineering & NLP</span>
                </button>

                <button
                  onClick={() => setActiveForensicTab('blockchain')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                    activeForensicTab === 'blockchain'
                      ? 'bg-red-600 text-white font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Blockchain Proof & Wallets</span>
                </button>
              </div>
            </div>

            {/* AI Result Card (if generated) */}
            {aiResult && (
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs space-y-2 shadow-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300">
                    <Sparkles className="h-4 w-4" />
                    Gemini AI Threat Hunter Evaluation
                  </span>
                  <span className="font-mono bg-indigo-200 dark:bg-indigo-900 px-2 py-0.5 rounded">
                    Fraud Score: {aiResult.fraudScore || selectedIncident.fraudScore}/100
                  </span>
                </div>
                <p className="leading-relaxed">
                  {aiResult.executiveSummary || aiResult.summary}
                </p>
                {aiResult.socialEngineeringCues && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {aiResult.socialEngineeringCues.map((cue: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-white/80 dark:bg-black/30 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800 text-[11px]"
                      >
                        ⚠️ {cue}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 1: ATTACK ORIGIN & LOCATION INTELLIGENCE */}
            {activeForensicTab === 'location_map' && (
              <div className="space-y-4">
                {/* Physical & Network Location Info Grid */}
                <div
                  className={`p-4 rounded-2xl border shadow-xs ${
                    isLight
                      ? 'bg-white border-gray-200'
                      : 'bg-gray-900 border-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-red-600" />
                      <h3 className="font-bold text-sm">Collected Attack Origin Location</h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-900">
                      IP THREAT: {originGeo.threatScore}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60">
                      <div className="text-[10px] text-gray-500 uppercase font-semibold">Origin City & Country</div>
                      <div className="font-bold text-sm text-red-600 flex items-center gap-1 mt-0.5">
                        <span>{getCountryFlagEmoji(originGeo.countryCode)}</span>
                        <span>{originGeo.city}, {originGeo.country}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60">
                      <div className="text-[10px] text-gray-500 uppercase font-semibold">Origin IP Address</div>
                      <div className="font-bold text-sm font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                        {originGeo.ip}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60">
                      <div className="text-[10px] text-gray-500 uppercase font-semibold">GPS Coordinates</div>
                      <div className="font-mono text-xs font-medium text-gray-800 dark:text-gray-200 mt-0.5">
                        {originGeo.lat}° N, {originGeo.lng}° E
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60">
                      <div className="text-[10px] text-gray-500 uppercase font-semibold">ISP & Autonomous System</div>
                      <div className="font-mono text-xs font-medium truncate text-gray-800 dark:text-gray-200 mt-0.5" title={`${originGeo.isp} (${originGeo.asn})`}>
                        {originGeo.isp}
                      </div>
                    </div>
                  </div>

                  {/* Security Infrastructure Flags */}
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-gray-500 text-[11px]">Network Profile:</span>
                    <span className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-medium ${
                      originGeo.isTor ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      Tor Exit: {originGeo.isTor ? 'DETECTED' : 'None'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-medium ${
                      originGeo.isVpn ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      VPN Proxy: {originGeo.isVpn ? 'DETECTED' : 'None'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-medium ${
                      originGeo.isProxy ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      Open Proxy: {originGeo.isProxy ? 'DETECTED' : 'None'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-medium ${
                      originGeo.isCloudHosting ? 'bg-purple-100 text-purple-700 border border-purple-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      Hosting/VPS: {originGeo.isCloudHosting ? 'YES' : 'NO'}
                    </span>
                  </div>
                </div>

                {/* Visual Mail Origin Geo Picture */}
                <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
                  <MailOriginGeoPicture incident={selectedIncident} />
                </div>

                {/* Email Content Preview */}
                <div
                  className={`p-4 rounded-2xl border shadow-xs ${
                    isLight ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800'
                  }`}
                >
                  <div className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-2">
                    Raw Message Content Intercepted
                  </div>
                  <div className={`p-3 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto border ${
                    isLight
                      ? 'bg-gray-50 text-black border-gray-200'
                      : 'bg-gray-800/40 text-gray-200 border-gray-700/60'
                  }`}>
                    {selectedIncident.bodyText}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: RELAY HOP TRACE */}
            {activeForensicTab === 'hops' && (
              <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
                <RelayHopTrace relayHops={selectedIncident.relayHops} />
              </div>
            )}

            {/* TAB CONTENT 3: PROTOCOLS FORENSICS */}
            {activeForensicTab === 'protocols' && (
              <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
                <HeaderForensicsTab
                  protocols={selectedIncident.protocols}
                  rawHeaders={selectedIncident.rawHeaders}
                />
              </div>
            )}

            {/* TAB CONTENT 4: NLP & SOCIAL ENGINEERING */}
            {activeForensicTab === 'nlp_threats' && (
              <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
                <NlpAnalysisTab
                  nlpAnalysis={selectedIncident.nlpAnalysis}
                  attribution={selectedIncident.attribution}
                  bodyText={selectedIncident.bodyText}
                  urls={selectedIncident.urls}
                  attachments={selectedIncident.attachments}
                />
              </div>
            )}

            {/* TAB CONTENT 5: BLOCKCHAIN PROOF & WALLETS */}
            {activeForensicTab === 'blockchain' && (
              <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
                <BlockchainForensicsTab incident={selectedIncident} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
