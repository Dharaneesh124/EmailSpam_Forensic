import React, { useState } from 'react';
import { AttributionInsight, EmailIncident } from '../types';
import {
  Network,
  Shield,
  Layers,
  Fingerprint,
  Target,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

interface AttributionGraphProps {
  attribution: AttributionInsight;
  incident: EmailIncident;
}

export const AttributionGraph: React.FC<AttributionGraphProps> = ({
  attribution,
  incident,
}) => {
  const [activeNode, setActiveNode] = useState<string | null>('actor');

  // Define nodes in visual layout
  const nodes = [
    {
      id: 'actor',
      label: attribution.probableActorOrSyndicate,
      sub: 'Attributed Threat Group',
      x: 350,
      y: 180,
      type: 'actor',
      color: '#FF3D00',
    },
    {
      id: 'origin_ip',
      label: incident.originatingGeo.ip,
      sub: `${incident.originatingGeo.city}, ${incident.originatingGeo.country}`,
      x: 160,
      y: 90,
      type: 'ip',
      color: '#00E0FF',
    },
    {
      id: 'domain',
      label: incident.domainIntel.domain,
      sub: incident.domainIntel.isLookalike ? 'Lookalike Domain' : 'Compromised Domain',
      x: 540,
      y: 90,
      type: 'domain',
      color: '#00E0FF',
    },
    {
      id: 'relay',
      label: incident.relayHops[1]?.fromIP || 'Transit Relay',
      sub: incident.relayHops[1]?.geo?.org || 'Intermediary Hop',
      x: 170,
      y: 280,
      type: 'relay',
      color: '#EAB308',
    },
    {
      id: 'target',
      label: incident.recipientAddress,
      sub: 'Target Enterprise Mailbox',
      x: 530,
      y: 280,
      type: 'target',
      color: '#00FF41',
    },
  ];

  const links = [
    { from: 'actor', to: 'origin_ip', label: 'Operates Infrastructure' },
    { from: 'actor', to: 'domain', label: 'Registered / Hijacked' },
    { from: 'origin_ip', to: 'relay', label: 'Bounces Traffic' },
    { from: 'domain', to: 'target', label: 'Transmits Phishing Payload' },
    { from: 'actor', to: 'target', label: 'Social Engineering Coercion' },
  ];

  return (
    <div className="space-y-6 font-mono">
      {/* Top Attribution Summary Banner - Immersive UI Theme */}
      <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1A1A1F] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#FF3D00]/10 border border-[#FF3D00]/30 text-[#FF3D00] shadow-[0_0_10px_rgba(255,61,0,0.2)]">
              <Fingerprint className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                  {attribution.probableActorOrSyndicate}
                </h3>
                <span className="rounded-sm bg-[#FF3D00]/10 text-[#FF3D00] border border-[#FF3D00]/30 px-2 py-0.5 text-[10px] font-bold uppercase">
                  {attribution.category}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-sans mt-0.5">
                Campaign Cluster: <span className="text-[#00E0FF] font-mono">{attribution.campaignCluster}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">Attribution Confidence</div>
              <div className="text-xl font-extrabold text-[#FF3D00]">
                {attribution.confidenceScore}%
              </div>
            </div>
            <div className="h-9 w-2 rounded-full bg-[#1A1A1F] overflow-hidden flex flex-col justify-end">
              <div
                className="bg-[#FF3D00] w-full"
                style={{ height: `${attribution.confidenceScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed font-sans">
          <strong className="text-white font-mono text-xs">INVESTIGATIVE RATIONALE:</strong> {attribution.reasoning}
        </p>

        <div className="mt-3 text-[10px] text-gray-500">
          ESTIMATED OPERATING GEOGRAPHY: <span className="text-white font-bold">{attribution.actorOriginEstimate}</span>
        </div>
      </div>

      {/* Interactive Network Graph */}
      <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#1A1A1F] pb-2.5 mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
            <Network className="h-4 w-4 text-[#00E0FF]" />
            Graph-Based Infrastructure & Campaign Correlation Matrix
          </span>
          <span className="text-[9px] text-gray-500 uppercase">
            Click any node to inspect relationship links
          </span>
        </div>

        <div className="relative w-full h-[360px] bg-[#050507] rounded-sm overflow-hidden border border-[#1A1A1F]">
          <svg viewBox="0 0 700 360" className="w-full h-full select-none">
            <defs>
              <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF3D00" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00E0FF" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Connecting Links */}
            {links.map((link, idx) => {
              const fromNode = nodes.find((n) => n.id === link.from)!;
              const toNode = nodes.find((n) => n.id === link.to)!;
              const midX = (fromNode.x + toNode.x) / 2;
              const midY = (fromNode.y + toNode.y) / 2;

              return (
                <g key={`link-${idx}`}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="#1A1A1F"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                  <text
                    x={midX}
                    y={midY - 4}
                    textAnchor="middle"
                    fill="#6B7280"
                    fontSize="8.5"
                    fontFamily="monospace"
                  >
                    {link.label}
                  </text>
                </g>
              );
            })}

            {/* Visual Nodes */}
            {nodes.map((node) => {
              const isSelected = activeNode === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer group"
                  onClick={() => setActiveNode(node.id)}
                >
                  {isSelected && (
                    <circle r="36" fill="none" stroke={node.color} strokeWidth="1.5" strokeDasharray="3 3" className="animate-spin" />
                  )}

                  {/* Main Node Shape */}
                  <rect
                    x="-90"
                    y="-20"
                    width="180"
                    height="40"
                    rx="4"
                    fill="#0A0A0F"
                    stroke={node.color}
                    strokeWidth={isSelected ? '2' : '1'}
                    className="transition-all duration-200 group-hover:fill-[#12121A]"
                  />

                  {/* Node Label */}
                  <text
                    y="-3"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {node.label.length > 22 ? node.label.substring(0, 22) + '...' : node.label}
                  </text>

                  {/* Node Subtitle */}
                  <text
                    y="11"
                    textAnchor="middle"
                    fill="#9CA3AF"
                    fontSize="8"
                    fontFamily="monospace"
                    className="pointer-events-none"
                  >
                    {node.sub}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* MITRE ATT&CK Techniques Matrix */}
      <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 shadow-[0_0_30px_rgba(0,0,0,0.7)]">
        <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-3 flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#00E0FF]" />
          Correlated MITRE ATT&CK Enterprise Matrix Techniques
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {attribution.mitreAttackTechniques.map((tech, idx) => (
            <div
              key={`tech-${idx}`}
              className="flex items-center justify-between p-2.5 rounded-sm border border-[#1A1A1F] bg-[#12121A] text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF3D00] shadow-[0_0_4px_#FF3D00]"></span>
                <span className="text-gray-200 font-semibold">{tech}</span>
              </div>
              <span className="text-[9px] text-[#00E0FF] uppercase tracking-wider border border-[#00E0FF]/30 bg-[#00E0FF]/5 rounded-sm px-1.5 py-0.5">
                Active IOC
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
