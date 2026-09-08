import React, { useState } from 'react';
import { GeoLocation, RelayHop } from '../types';
import { ShieldAlert, Globe, Server, AlertTriangle, ShieldCheck } from 'lucide-react';

interface WorldThreatMapProps {
  originGeo?: GeoLocation;
  relayHops?: RelayHop[];
  allOriginGeos?: { geo: GeoLocation; caseNumber: string; threat: string; score: number }[];
  onSelectGeo?: (geo: GeoLocation) => void;
}

export const WorldThreatMap: React.FC<WorldThreatMapProps> = ({
  originGeo,
  relayHops = [],
  allOriginGeos = [],
  onSelectGeo,
}) => {
  const [hoveredNode, setHoveredNode] = useState<{
    title: string;
    ip: string;
    location: string;
    isp: string;
    threatScore: number;
    isTor?: boolean;
    isProxy?: boolean;
  } | null>(null);

  // Convert lat/lng to SVG 1000x500 Robinson-like projection
  const projectCoordinates = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
    return { x: Math.max(10, Math.min(990, x)), y: Math.max(10, Math.min(490, y)) };
  };

  const currentHopsCoords = relayHops
    .filter((h) => h.geo)
    .map((h) => ({
      hop: h,
      coords: projectCoordinates(h.geo!.lat, h.geo!.lng),
    }));

  return (
    <div id="world-threat-map-container" className="relative w-full rounded-md border border-[#1A1A1F] bg-[#0A0A0F] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)]">
      {/* Map Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#1A1A1F] px-4 py-3 bg-[#0A0A0F]">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#00E0FF]/10 border border-[#00E0FF]/30 text-[#00E0FF] shadow-[0_0_10px_rgba(0,224,255,0.2)]">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-widest text-white uppercase font-mono">
              Global Attack Origin & Transit Hop Telemetry
            </h3>
            <p className="text-[10px] text-gray-500 font-mono tracking-tighter">
              Earliest reliable node extraction & SMTP relay path tracing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[10px] font-mono">
          <div className="flex items-center gap-1.5 text-[#FF3D00]">
            <span className="h-2 w-2 rounded-full bg-[#FF3D00] animate-pulse"></span>
            <span className="font-bold uppercase tracking-wider">Origin Attack Node</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#00E0FF]">
            <span className="h-2 w-2 rounded-full bg-[#00E0FF]"></span>
            <span className="font-bold uppercase tracking-wider">Suspicious Relay / Tor</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#00FF41]">
            <span className="h-2 w-2 rounded-full bg-[#00FF41]"></span>
            <span className="font-bold uppercase tracking-wider">Protected Gateway</span>
          </div>
        </div>
      </div>

      {/* SVG Map Canvas with Cyber Dot Matrix */}
      <div className="relative w-full aspect-[2/1] min-h-[340px] bg-[#050507] p-2 select-none overflow-hidden">
        {/* Radial Matrix Dots */}
        <div
          className="absolute inset-0 pointer-events-none opacity-15"
          style={{
            backgroundImage: 'radial-gradient(#00E0FF 0.75px, transparent 0.75px)',
            backgroundSize: '20px 20px',
          }}
        ></div>

        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full relative z-10"
          style={{ filter: 'drop-shadow(0px 0px 8px rgba(0, 224, 255, 0.08))' }}
        >
          <defs>
            <linearGradient id="hopLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF3D00" />
              <stop offset="50%" stopColor="#00E0FF" />
              <stop offset="100%" stopColor="#00FF41" />
            </linearGradient>
          </defs>

          {/* Continent Landmass Outlines */}
          <g fill="rgba(18, 18, 26, 0.7)" stroke="#1A1A1F" strokeWidth="0.8">
            {/* North America */}
            <path d="M 120 70 L 220 60 L 280 90 L 290 140 L 230 180 L 190 220 L 160 210 L 130 160 L 110 110 Z" />
            <path d="M 190 220 L 230 250 L 250 270 L 220 270 L 180 240 Z" />
            {/* South America */}
            <path d="M 270 280 L 340 310 L 360 360 L 320 440 L 280 430 L 260 350 L 250 300 Z" />
            {/* Europe */}
            <path d="M 470 90 L 550 80 L 580 120 L 550 160 L 490 170 L 460 130 Z" />
            <path d="M 450 110 L 480 100 L 470 140 Z" />
            {/* Africa */}
            <path d="M 460 180 L 560 180 L 590 240 L 550 340 L 510 380 L 480 340 L 450 240 Z" />
            {/* Asia */}
            <path d="M 580 80 L 780 70 L 850 120 L 880 180 L 810 230 L 730 250 L 670 240 L 620 180 L 580 120 Z" />
            {/* Australia & Oceania */}
            <path d="M 780 320 L 870 320 L 890 380 L 820 410 L 770 380 Z" />
          </g>

          {/* Connecting Relay Hop Lines */}
          {currentHopsCoords.length > 1 && (
            <g>
              {currentHopsCoords.map((pt, i) => {
                if (i === currentHopsCoords.length - 1) return null;
                const nextPt = currentHopsCoords[i + 1];
                const midX = (pt.coords.x + nextPt.coords.x) / 2;
                const midY = Math.min(pt.coords.y, nextPt.coords.y) - 30;

                return (
                  <g key={`hop-line-${i}`}>
                    <path
                      d={`M ${pt.coords.x} ${pt.coords.y} Q ${midX} ${midY} ${nextPt.coords.x} ${nextPt.coords.y}`}
                      fill="none"
                      stroke="url(#hopLineGrad)"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className="animate-pulse"
                      opacity="0.85"
                    />
                    <circle r="3" fill="#00E0FF" filter="drop-shadow(0 0 4px #00E0FF)">
                      <animateMotion
                        path={`M ${pt.coords.x} ${pt.coords.y} Q ${midX} ${midY} ${nextPt.coords.x} ${nextPt.coords.y}`}
                        dur={`${2.2 + i}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                );
              })}
            </g>
          )}

          {/* All Incidents Background Markers */}
          {allOriginGeos.map((item, idx) => {
            const pos = projectCoordinates(item.geo.lat, item.geo.lng);
            const isCritical = item.score > 80;
            return (
              <g
                key={`all-geo-${idx}`}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => onSelectGeo && onSelectGeo(item.geo)}
                onMouseEnter={() =>
                  setHoveredNode({
                    title: `${item.caseNumber} - ${item.threat}`,
                    ip: item.geo.ip,
                    location: `${item.geo.city}, ${item.geo.country}`,
                    isp: item.geo.isp,
                    threatScore: item.score,
                    isTor: item.geo.isTor,
                    isProxy: item.geo.isProxy,
                  })
                }
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle
                  r={isCritical ? 5 : 3.5}
                  fill={isCritical ? '#FF3D00' : '#EAB308'}
                  opacity="0.75"
                />
              </g>
            );
          })}

          {/* Current Active Incident Relay Hop Nodes */}
          {currentHopsCoords.map(({ hop, coords }, idx) => {
            const isOrigin = hop.isOriginating;
            const isTor = hop.geo?.isTor;
            const isDestination = idx === currentHopsCoords.length - 1;

            let fillColor = '#00E0FF';
            if (isOrigin) fillColor = '#FF3D00';
            else if (isTor || hop.isAnomalous) fillColor = '#EAB308';
            else if (isDestination) fillColor = '#00FF41';

            return (
              <g
                key={`node-hop-${idx}`}
                transform={`translate(${coords.x}, ${coords.y})`}
                className="cursor-pointer group"
                onMouseEnter={() =>
                  setHoveredNode({
                    title: `Hop #${hop.hopNumber} (${isOrigin ? 'ORIGIN NODE' : isDestination ? 'INBOUND GATEWAY' : 'RELAY'})`,
                    ip: hop.fromIP,
                    location: `${hop.geo?.city || 'Unknown'}, ${hop.geo?.country || 'Unknown'}`,
                    isp: hop.geo?.isp || hop.fromHost,
                    threatScore: hop.geo?.threatScore || 50,
                    isTor: hop.geo?.isTor,
                    isProxy: hop.geo?.isProxy,
                  })
                }
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Ping wave for origin */}
                {isOrigin && (
                  <circle r="16" fill="none" stroke="#FF3D00" strokeWidth="1.5" className="animate-ping opacity-60" />
                )}

                {/* Node Outer Ring */}
                <circle
                  r={isOrigin ? 8.5 : 6.5}
                  fill={fillColor}
                  stroke="#050507"
                  strokeWidth="2"
                  filter={`drop-shadow(0 0 6px ${fillColor})`}
                />

                {/* Inner Dot */}
                <circle r={isOrigin ? 3 : 2} fill="#ffffff" />

                {/* Hop Label */}
                <text
                  y="-11"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="8.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                  className="pointer-events-none drop-shadow-md tracking-wider"
                >
                  {isOrigin ? `HOP #1 [ORIGIN]` : `HOP #${hop.hopNumber}`}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip Card */}
        {hoveredNode && (
          <div className="absolute top-4 left-4 z-20 max-w-sm rounded-sm border border-[#1A1A1F] bg-[#050507]/95 p-3 shadow-[0_0_25px_rgba(0,0,0,0.9)] backdrop-blur-md">
            <div className="flex items-center justify-between gap-2 border-b border-[#1A1A1F] pb-2 mb-2">
              <span className="text-xs font-bold text-white tracking-wider font-mono">
                {hoveredNode.title}
              </span>
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[9px] font-mono font-bold uppercase ${
                  hoveredNode.threatScore > 80
                    ? 'bg-[#FF3D00]/10 text-[#FF3D00] border border-[#FF3D00]/30'
                    : hoveredNode.threatScore > 50
                    ? 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/30'
                    : 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30'
                }`}
              >
                SCORE: {hoveredNode.threatScore}/100
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Node IP:</span>
                <span className="text-[#00E0FF] font-semibold">{hoveredNode.ip}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Location:</span>
                <span className="text-gray-300">{hoveredNode.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">ISP / AS:</span>
                <span className="text-gray-400 truncate max-w-[180px]">{hoveredNode.isp}</span>
              </div>

              {(hoveredNode.isTor || hoveredNode.isProxy) && (
                <div className="mt-2 flex items-center gap-1.5 rounded-sm bg-[#FF3D00]/10 border border-[#FF3D00]/30 p-1.5 text-[10px] text-[#FF3D00]">
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  <span>
                    {hoveredNode.isTor ? 'Tor Exit Node detected' : 'Proxy / Anonymizer route'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Selected Coordinate Legend */}
        {originGeo && (
          <div className="absolute bottom-3 right-3 rounded-sm border border-[#1A1A1F] bg-[#0A0A0F]/90 px-3 py-1.5 text-[10px] font-mono backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-[#FF3D00] font-bold uppercase tracking-wider">ESTIMATED ORIGIN:</span>
              <span className="text-white">{originGeo.city}, {originGeo.country}</span>
              <span className="text-gray-600">|</span>
              <span className="text-[#00E0FF]">{originGeo.ip}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
