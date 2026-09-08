import React from 'react';
import { RelayHop } from '../types';
import {
  Server,
  ArrowDown,
  Clock,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Globe,
  Radio,
  Zap,
} from 'lucide-react';

interface RelayHopTraceProps {
  hops: RelayHop[];
}

export const RelayHopTrace: React.FC<RelayHopTraceProps> = ({ hops }) => {
  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1A1A1F] pb-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
            <Radio className="h-4 w-4 text-[#00E0FF]" />
            SMTP Relay Transmission Path & Routing Trace
          </h3>
          <p className="text-[10px] text-gray-500 font-sans tracking-tight">
            Chronological reconstruction from earliest sending host to perimeter enterprise gateway
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center rounded-sm bg-[#00E0FF]/10 border border-[#00E0FF]/30 px-2.5 py-1 text-[#00E0FF] font-bold">
            Total Hops: {hops.length}
          </span>
          <span className="inline-flex items-center rounded-sm bg-[#FF3D00]/10 border border-[#FF3D00]/30 px-2.5 py-1 text-[#FF3D00] font-bold">
            Anomalous Hops: {hops.filter((h) => h.isAnomalous).length}
          </span>
        </div>
      </div>

      {/* Hop Timeline Cards - Immersive UI Theme */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-[#FF3D00] before:via-[#00E0FF] before:to-[#00FF41]">
        {hops.map((hop, idx) => {
          const isOrigin = hop.isOriginating;
          const isLast = idx === hops.length - 1;
          const isAnomalous = hop.isAnomalous;

          return (
            <div key={`hop-item-${idx}`} className="relative group">
              {/* Dot Icon Indicator on Timeline */}
              <div
                className={`absolute -left-6 top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-[#050507] ${
                  isOrigin
                    ? 'border-[#FF3D00] text-[#FF3D00] shadow-[0_0_10px_rgba(255,61,0,0.5)]'
                    : isAnomalous
                    ? 'border-[#EAB308] text-[#EAB308]'
                    : 'border-[#00FF41] text-[#00FF41]'
                }`}
              >
                <span className="text-[10px] font-mono font-bold">{hop.hopNumber}</span>
              </div>

              {/* Hop Content Card */}
              <div
                className={`rounded-md border p-4 transition-all duration-200 ${
                  isOrigin
                    ? 'border-[#FF3D00]/50 bg-[#0A0A0F] shadow-[0_0_25px_rgba(255,61,0,0.2)]'
                    : isAnomalous
                    ? 'border-[#EAB308]/40 bg-[#0A0A0F]'
                    : 'border-[#1A1A1F] bg-[#0A0A0F]'
                }`}
              >
                {/* Hop Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1A1A1F] pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      {isOrigin ? (
                        <span className="text-[#FF3D00]">HOP #{hop.hopNumber} — EARLIEST RELIABLE SENDING NODE (ORIGIN)</span>
                      ) : isLast ? (
                        <span className="text-[#00FF41]">HOP #{hop.hopNumber} — FINAL PERIMETER GATEWAY INGESTION</span>
                      ) : (
                        <span className="text-gray-300">HOP #{hop.hopNumber} — TRANSIT INTERMEDIARY RELAY</span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{new Date(hop.timestamp).toLocaleTimeString()} UTC</span>
                    </div>
                    {hop.delayMs > 0 && (
                      <span className="text-[#EAB308] font-semibold text-[10px]">
                        +{Math.round(hop.delayMs / 1000)}s Transit Delay
                      </span>
                    )}
                  </div>
                </div>

                {/* Routing Specifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="space-y-1.5 bg-[#12121A] p-3 rounded-sm border border-[#1A1A1F]">
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider">Sending Entity (From):</div>
                    <div className="text-white font-semibold break-all">{hop.fromHost}</div>
                    <div className="flex items-center gap-2 text-[#00E0FF] text-[10px]">
                      <span>IP: {hop.fromIP}</span>
                      <span className="text-gray-600">|</span>
                      <span>Proto: {hop.protocol}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-[#12121A] p-3 rounded-sm border border-[#1A1A1F]">
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider">Receiving Relay (By):</div>
                    <div className="text-white font-semibold break-all">{hop.byHost}</div>
                    <div className="text-gray-500 text-[10px]">
                      Authenticating Mail Transfer Agent (MTA)
                    </div>
                  </div>
                </div>

                {/* Geolocation & Network Infrastructure Badge */}
                {hop.geo && (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 bg-[#12121A] border border-[#1A1A1F] rounded-sm p-2.5 text-xs font-mono">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Globe className="h-4 w-4 text-[#00E0FF] shrink-0" />
                      <span>{hop.geo.city}, {hop.geo.country} ({hop.geo.countryCode})</span>
                      <span className="text-gray-600">|</span>
                      <span className="text-gray-400">{hop.geo.isp}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {hop.geo.isTor && (
                        <span className="rounded-sm bg-[#FF3D00]/10 text-[#FF3D00] border border-[#FF3D00]/30 px-2 py-0.5 text-[9px] font-bold uppercase">
                          TOR EXIT NODE
                        </span>
                      )}
                      {hop.geo.isVpn && (
                        <span className="rounded-sm bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/30 px-2 py-0.5 text-[9px] font-bold uppercase">
                          VPN / PROXY
                        </span>
                      )}
                      {hop.geo.isCloudHosting && (
                        <span className="rounded-sm bg-[#00E0FF]/10 text-[#00E0FF] border border-[#00E0FF]/30 px-2 py-0.5 text-[9px] font-bold uppercase">
                          VPS / HOSTING
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase font-mono ${
                          hop.geo.threatScore > 80
                            ? 'bg-[#FF3D00]/10 text-[#FF3D00] border border-[#FF3D00]/30'
                            : hop.geo.threatScore > 40
                            ? 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/30'
                            : 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30'
                        }`}
                      >
                        SCORE: {hop.geo.threatScore}/100
                      </span>
                    </div>
                  </div>
                )}

                {/* Anomaly Callout Box */}
                {hop.anomalyNote && (
                  <div className="mt-3 flex items-start gap-2.5 rounded-sm border border-[#FF3D00]/30 bg-[#FF3D00]/5 p-2.5 text-xs text-[#FF3D00] font-sans">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-[#FF3D00] mt-0.5" />
                    <p className="leading-relaxed">{hop.anomalyNote}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
