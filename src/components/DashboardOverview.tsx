import React from 'react';
import { EmailIncident, GeoLocation } from '../types';
import { WorldThreatMap } from './WorldThreatMap';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Globe,
  TrendingUp,
  Inbox,
  ArrowRight,
  Filter,
  CheckCircle,
  Blocks,
  Link as LinkIcon,
  Coins,
  Cpu,
} from 'lucide-react';

interface DashboardOverviewProps {
  incidents: EmailIncident[];
  onSelectIncident: (incident: EmailIncident) => void;
  selectedIncident: EmailIncident;
  onSelectGeo?: (geo: GeoLocation) => void;
  onNavigateToBlockchain?: () => void;
  blockchainHeight?: number;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  incidents,
  onSelectIncident,
  selectedIncident,
  onSelectGeo,
  onNavigateToBlockchain,
  blockchainHeight = 2,
}) => {
  const criticalCount = incidents.filter((i) => i.threatSeverity === 'critical').length;
  const highCount = incidents.filter((i) => i.threatSeverity === 'high').length;
  const becCount = incidents.filter((i) => i.classification === 'BEC_Fraud').length;

  const allOriginGeos = incidents.map((inc) => ({
    geo: inc.originatingGeo,
    caseNumber: inc.caseNumber,
    threat: inc.classification,
    score: inc.fraudScore,
  }));

  return (
    <div className="space-y-6">
      {/* Blockchain Threat Intelligence Bar */}
      <div className="rounded-md border border-[#00FF41]/40 bg-[#1F2937]/40 p-3 flex flex-wrap items-center justify-between gap-3 shadow-[0_0_20px_rgba(0,255,65,0.1)] font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#00FF41]/20 text-[#00FF41]">
            <Blocks className="h-4 w-4" />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[#E5E7EB]">
            <span className="font-bold uppercase tracking-wider text-[#00FF41]">Threat Blockchain Ledger:</span>
            <span className="text-[#E5E7EB]/80">Height: Block #{blockchainHeight}</span>
            <span className="text-[#1F2937]">|</span>
            <span className="text-[#00FF41] flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00FF41] animate-pulse"></span>
              Consensus Quorum: 5/5 Nodes Synchronized
            </span>
            <span className="text-[#1F2937]">|</span>
            <span className="text-[#E5E7EB]/60">PoA ISO/IEC 27037 Integrity Verified</span>
          </div>
        </div>

        {onNavigateToBlockchain && (
          <button
            onClick={onNavigateToBlockchain}
            className="flex items-center gap-1.5 rounded-sm bg-[#00FF41]/15 border border-[#00FF41]/40 px-2.5 py-1 text-[10px] font-bold text-[#00FF41] hover:bg-[#00FF41]/25 transition-colors uppercase tracking-wider"
          >
            <span>Open Threat Ledger</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* 4 Stat Metric Cards - Immersive UI Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="rounded-md border border-[#1F2937] bg-[#1F2937]/30 p-4 space-y-1.5 shadow-[0_0_20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between text-[#E5E7EB]/60 text-[10px] font-mono uppercase tracking-wider font-bold">
            <span>Total Emails Monitored</span>
            <Inbox className="h-4 w-4 text-[#00FF41]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#E5E7EB] tracking-tight">1,402,291</div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#00FF41]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00FF41] animate-pulse"></span>
            <span className="uppercase tracking-wider">Perimeter Gateway Active</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="rounded-md border border-[#1F2937] bg-[#1F2937]/30 p-4 space-y-1.5 shadow-[0_0_20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between text-[#E5E7EB]/60 text-[10px] font-mono uppercase tracking-wider font-bold">
            <span>Critical Interceptions</span>
            <ShieldAlert className="h-4 w-4 text-[#FF3D00]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#FF3D00] tracking-tight">{criticalCount} BLOCKED</div>
          <div className="text-[10px] font-mono text-[#E5E7EB]/60 uppercase tracking-wider">
            100% Inbound Containment Rate
          </div>
        </div>

        {/* Stat 3 */}
        <div className="rounded-md border border-[#1F2937] bg-[#1F2937]/30 p-4 space-y-1.5 shadow-[0_0_20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between text-[#E5E7EB]/60 text-[10px] font-mono uppercase tracking-wider font-bold">
            <span>BEC & Wire Diversions</span>
            <AlertTriangle className="h-4 w-4 text-[#00FF41]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#00FF41] tracking-tight">{becCount} Incidents</div>
          <div className="text-[10px] font-mono text-[#E5E7EB]/60 uppercase tracking-wider">
            $597,390 USD Exposure Prevented
          </div>
        </div>

        {/* Stat 4 */}
        <div className="rounded-md border border-[#1F2937] bg-[#1F2937]/30 p-4 space-y-1.5 shadow-[0_0_20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between text-[#E5E7EB]/60 text-[10px] font-mono uppercase tracking-wider font-bold">
            <span>Origin Trace Resolution</span>
            <Globe className="h-4 w-4 text-[#00FF41]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#00FF41] tracking-tight">99.4%</div>
          <div className="text-[10px] font-mono text-[#E5E7EB]/60 uppercase tracking-wider">
            Earliest Node Extracted & Geo-mapped
          </div>
        </div>
      </div>

      {/* Global World Threat Map */}
      <WorldThreatMap
        originGeo={selectedIncident.originatingGeo}
        relayHops={selectedIncident.relayHops}
        allOriginGeos={allOriginGeos}
        onSelectGeo={onSelectGeo}
      />

      {/* Real-time Threat Triage & Ingestion Feed (Matches Design Stream aesthetic) */}
      <div className="rounded-md border border-[#1F2937] bg-[#000000] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        <div className="flex flex-wrap items-center justify-between border-b border-[#1F2937] px-4 py-3 bg-[#1F2937]/40">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#FF3D00] animate-pulse"></span>
            <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-[#E5E7EB]">
              Live Ingestion Stream & Threat Case Queue
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#E5E7EB]/60 uppercase tracking-wider">
            Telemetry Rate: 4.8 EPS // Click incident for forensic workbench
          </span>
        </div>

        <div className="divide-y divide-[#1F2937]">
          {incidents.map((inc) => {
            const isSelected = selectedIncident.id === inc.id;
            const isCritical = inc.threatSeverity === 'critical';
            const isHigh = inc.threatSeverity === 'high';

            const borderColor = isCritical
              ? 'border-[#FF3D00]'
              : isHigh
              ? 'border-[#00FF41]/70'
              : 'border-[#00FF41]';

            const scoreColor = isCritical
              ? 'text-[#FF3D00]'
              : isHigh
              ? 'text-[#00FF41]'
              : 'text-[#00FF41]';

            return (
              <div
                key={inc.id}
                onClick={() => onSelectIncident(inc)}
                className={`p-3.5 transition-all cursor-pointer hover:bg-[#1F2937]/40 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-2 ${borderColor} ${
                  isSelected ? 'bg-[#1F2937]/60' : 'bg-[#000000]'
                }`}
              >
                {/* Left details */}
                <div className="space-y-1 max-w-2xl font-mono">
                  <div className="flex flex-wrap items-center gap-2 text-[10px]">
                    <span className="text-[#E5E7EB]/50">{new Date(inc.receivedAt).toLocaleTimeString()}</span>
                    <span className="text-[#1F2937]">|</span>
                    <span className="text-[#00FF41] font-bold">{inc.caseNumber}</span>
                    <span className="text-[#1F2937]">|</span>
                    <span className={`font-bold ${scoreColor}`}>
                      {inc.fraudScore}% SCORE
                    </span>
                    <span className="text-[#1F2937]">|</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-sm text-[9px] uppercase font-bold ${
                        isCritical
                          ? 'bg-[#FF3D00]/10 text-[#FF3D00] border border-[#FF3D00]/30'
                          : 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30'
                      }`}
                    >
                      {inc.classification}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-[#E5E7EB] tracking-wide">
                    {inc.subject}
                  </h4>

                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-[#E5E7EB]/70">
                    <div>From: <span className="text-[#E5E7EB]">{inc.senderAddress}</span></div>
                    <div className="text-[#1F2937]">•</div>
                    <div>Origin: <span className="text-[#00FF41]">{inc.originatingGeo.city}, {inc.originatingGeo.country}</span></div>
                    <div className="text-[#1F2937]">•</div>
                    <div>Hops: <span className="text-[#E5E7EB]">{inc.relayHops.length}</span></div>
                    {inc.blockchainProof && (
                      <>
                        <div className="text-[#1F2937]">•</div>
                        <div className="flex items-center gap-1 text-[#00FF41]">
                          <Blocks className="h-3 w-3" />
                          <span>Block #{inc.blockchainProof.blockNumber} Sealed</span>
                        </div>
                      </>
                    )}
                    {inc.detectedCryptoWallets && inc.detectedCryptoWallets.length > 0 && (
                      <>
                        <div className="text-[#1F2937]">•</div>
                        <div className="flex items-center gap-1 text-[#00FF41]">
                          <Coins className="h-3 w-3" />
                          <span>{inc.detectedCryptoWallets[0].currency} Wallet Flagged</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right score & inspect trigger */}
                <div className="flex items-center gap-4 shrink-0 font-mono">
                  <div className="text-right">
                    <div className="text-[9px] text-[#E5E7EB]/60 uppercase tracking-wider">FRAUD RISK</div>
                    <div className={`text-lg font-bold ${scoreColor}`}>
                      {inc.fraudScore}%
                    </div>
                  </div>

                  <button
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all ${
                      isSelected
                        ? 'bg-[#00FF41] text-[#000000] shadow-[0_0_10px_rgba(0,255,65,0.4)]'
                        : 'bg-[#1F2937] text-[#E5E7EB] border border-[#1F2937] hover:border-[#00FF41]/40'
                    }`}
                  >
                    <span>Inspect</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
