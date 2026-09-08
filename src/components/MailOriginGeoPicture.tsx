import React, { useState, useMemo } from 'react';
import { GeoLocation, EmailIncident, RelayHop } from '../types';
import {
  Globe,
  MapPin,
  Navigation,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Crosshair,
  Compass,
  Radio,
  Download,
  Eye,
  Activity,
  Server,
  Layers,
} from 'lucide-react';

interface MailOriginGeoPictureProps {
  incident: EmailIncident;
  compact?: boolean;
}

// Default Enterprise Recipient Corporate Gateway (New York Datacenter)
const DEFAULT_TARGET_GEO = {
  city: 'New York',
  region: 'New York',
  country: 'United States',
  countryCode: 'US',
  lat: 40.7128,
  lng: -74.006,
  ip: '198.51.100.25',
  host: 'mx.acme-global.com',
  org: 'Acme Global Corporate Gateway',
};

// Calculate Haversine Distance in Kilometers
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Calculate Compass Bearing
function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const y = Math.sin(((lon2 - lon1) * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.cos(((lon2 - lon1) * Math.PI) / 180);
  const brng = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;

  const points = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return points[Math.round(brng / 45) % 8];
}

export const MailOriginGeoPicture: React.FC<MailOriginGeoPictureProps> = ({
  incident,
  compact = false,
}) => {
  const [viewMode, setViewMode] = useState<'tactical' | 'satellite' | 'vector'>('tactical');
  const [showRelayHops, setShowRelayHops] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Origin info
  const origin = incident.originatingGeo;

  // Target info: look for last hop or default corporate gateway
  const lastHop = incident.relayHops[incident.relayHops.length - 1];
  const target = useMemo(() => {
    // If the last hop has a known destination gateway host
    return {
      ...DEFAULT_TARGET_GEO,
      host: lastHop?.byHost || DEFAULT_TARGET_GEO.host,
      recipient: incident.recipientAddress,
    };
  }, [incident, lastHop]);

  // Project lat/lng to SVG 1000x500 coordinates
  const project = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
    return {
      x: Math.max(20, Math.min(980, x)),
      y: Math.max(20, Math.min(480, y)),
    };
  };

  const originCoords = project(origin.lat, origin.lng);
  const targetCoords = project(target.lat, target.lng);

  // Distance & Bearing calculation
  const distanceKm = calculateDistanceKm(origin.lat, origin.lng, target.lat, target.lng);
  const distanceMiles = Math.round(distanceKm * 0.621371);
  const bearing = calculateBearing(origin.lat, origin.lng, target.lat, target.lng);

  // Curve mid-point for arched trajectory vector
  const midX = (originCoords.x + targetCoords.x) / 2;
  const distDelta = Math.abs(originCoords.x - targetCoords.x);
  const archHeight = Math.max(45, Math.min(130, distDelta * 0.28));
  const midY = Math.min(originCoords.y, targetCoords.y) - archHeight;

  const trajectoryPath = `M ${originCoords.x} ${originCoords.y} Q ${midX} ${midY} ${targetCoords.x} ${targetCoords.y}`;

  // Intermediate hops
  const intermediateHops = incident.relayHops.filter((h) => h.geo);

  return (
    <div
      id="mail-geolocation-picture"
      className="rounded-md border border-[#1F2937] bg-[#000000] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.85)] font-mono text-xs"
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#1F2937] px-4 py-3 bg-[#1F2937]/50">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#FF3D00]/15 border border-[#FF3D00]/40 text-[#FF3D00] shadow-[0_0_12px_rgba(255,61,0,0.3)]">
            <Crosshair className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold tracking-widest text-[#E5E7EB] uppercase">
                GEOLOCATION ORIGIN PICTURE // WHERE MAIL WAS RAISED
              </h3>
              <span className="bg-[#FF3D00]/15 border border-[#FF3D00]/40 text-[#FF3D00] px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase">
                ORIGIN IDENTIFIED
              </span>
            </div>
            <p className="text-[10px] text-[#E5E7EB]/60">
              Visual ballistic path from sender origin node directly to enterprise recipient
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 pt-2 sm:pt-0">
          <div className="flex items-center rounded-sm border border-[#1F2937] bg-[#000000] p-0.5 text-[10px]">
            <button
              onClick={() => setViewMode('tactical')}
              className={`px-2 py-1 rounded-sm uppercase font-bold transition-colors ${
                viewMode === 'tactical'
                  ? 'bg-[#1F2937] text-[#00FF41] border border-[#00FF41]/30'
                  : 'text-[#E5E7EB]/50 hover:text-[#E5E7EB]'
              }`}
            >
              Tactical
            </button>
            <button
              onClick={() => setViewMode('satellite')}
              className={`px-2 py-1 rounded-sm uppercase font-bold transition-colors ${
                viewMode === 'satellite'
                  ? 'bg-[#1F2937] text-[#00FF41] border border-[#00FF41]/30'
                  : 'text-[#E5E7EB]/50 hover:text-[#E5E7EB]'
              }`}
            >
              Dark Sat
            </button>
            <button
              onClick={() => setViewMode('vector')}
              className={`px-2 py-1 rounded-sm uppercase font-bold transition-colors ${
                viewMode === 'vector'
                  ? 'bg-[#1F2937] text-[#00FF41] border border-[#00FF41]/30'
                  : 'text-[#E5E7EB]/50 hover:text-[#E5E7EB]'
              }`}
            >
              Vector HUD
            </button>
          </div>

          <button
            onClick={() => setShowRelayHops(!showRelayHops)}
            title="Toggle intermediate proxy/relay hops"
            className={`px-2.5 py-1 text-[10px] rounded-sm border font-bold uppercase transition-colors ${
              showRelayHops
                ? 'bg-[#00FF41]/15 border-[#00FF41]/40 text-[#00FF41]'
                : 'border-[#1F2937] bg-[#000000] text-[#E5E7EB]/70 hover:text-[#E5E7EB]'
            }`}
          >
            Hops ({incident.relayHops.length})
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2 py-1 text-[10px] rounded-sm border border-[#1F2937] bg-[#000000] text-[#E5E7EB]/70 hover:text-[#E5E7EB] uppercase"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Top Origin & Target Callout Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#1F2937] bg-[#000000] border-b border-[#1F2937]">
            {/* Origin Node Card */}
            <div className="p-3.5 space-y-1 bg-[#FF3D00]/5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] text-[#FF3D00] font-bold uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-[#FF3D00] animate-ping inline-block"></span>
                  WHERE MAIL WAS RAISED (ORIGIN)
                </span>
                <span className="text-[10px] bg-[#FF3D00]/20 text-[#FF3D00] px-1.5 py-0.5 rounded-sm font-bold">
                  {origin.countryCode}
                </span>
              </div>
              <div className="text-sm font-bold text-[#E5E7EB] tracking-wide">
                {origin.city}, {origin.country}
              </div>
              <div className="text-[11px] text-[#E5E7EB]/80 flex flex-wrap gap-x-2">
                <span>
                  IP: <strong className="text-[#FF3D00]">{origin.ip}</strong>
                </span>
                <span className="text-[#E5E7EB]/40">•</span>
                <span className="text-[#E5E7EB]/60">
                  {origin.lat.toFixed(2)}°N, {origin.lng.toFixed(2)}°E
                </span>
              </div>
              <div className="text-[10px] text-[#E5E7EB]/50 truncate">
                ISP: {origin.isp} ({origin.asn})
              </div>
            </div>

            {/* Vector Trajectory Summary */}
            <div className="p-3.5 space-y-1 bg-[#1F2937]/30 flex flex-col justify-center text-center">
              <div className="flex items-center justify-center gap-2 text-[10px] text-[#E5E7EB]/60 uppercase font-bold tracking-wider">
                <Navigation className="h-3 w-3 text-[#00FF41]" />
                <span>INBOUND TRAJECTORY VECTOR</span>
              </div>
              <div className="flex items-center justify-center gap-3 my-0.5">
                <span className="text-[#FF3D00] font-bold text-xs">{origin.city}</span>
                <div className="flex items-center text-[#00FF41]">
                  <span className="h-0.5 w-6 bg-gradient-to-r from-[#FF3D00] via-[#00FF41] to-[#00FF41]"></span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#00FF41] -ml-1" />
                </div>
                <span className="text-[#00FF41] font-bold text-xs">{target.city}</span>
              </div>
              <div className="text-[11px] font-bold text-[#E5E7EB]">
                {distanceKm.toLocaleString()} km{' '}
                <span className="text-[#E5E7EB]/50 font-normal">({distanceMiles.toLocaleString()} miles)</span>
              </div>
              <div className="text-[10px] text-[#E5E7EB]/60">
                Vector Bearing: <strong className="text-[#E5E7EB]">{bearing}</strong> • Relays:{' '}
                <strong className="text-[#00FF41]">{incident.relayHops.length} hops</strong>
              </div>
            </div>

            {/* Destination Target Card */}
            <div className="p-3.5 space-y-1 bg-[#00FF41]/5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] text-[#00FF41] font-bold uppercase tracking-wider">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#00FF41]" />
                  DELIVERED TO THEM (RECIPIENT)
                </span>
                <span className="text-[10px] bg-[#00FF41]/20 text-[#00FF41] px-1.5 py-0.5 rounded-sm font-bold">
                  {target.countryCode}
                </span>
              </div>
              <div className="text-sm font-bold text-[#E5E7EB] tracking-wide">
                {target.city}, {target.country}
              </div>
              <div className="text-[11px] text-[#E5E7EB]/80 truncate">
                To: <strong className="text-[#00FF41]">{incident.recipientAddress}</strong>
              </div>
              <div className="text-[10px] text-[#E5E7EB]/60 truncate">
                Enterprise Gateway: <strong className="text-[#E5E7EB]">{target.host}</strong>
              </div>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div
            className={`relative w-full aspect-[21/9] min-h-[340px] p-2 select-none overflow-hidden transition-colors ${
              viewMode === 'satellite'
                ? 'bg-[#03070b]'
                : viewMode === 'vector'
                ? 'bg-[#06040a]'
                : 'bg-[#050508]'
            }`}
          >
            {/* Background Radar Grid & Coordinates Mesh */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage:
                  viewMode === 'satellite'
                    ? 'radial-gradient(#00FF41 0.75px, transparent 0.75px)'
                    : 'radial-gradient(#00E0FF 0.75px, transparent 0.75px)',
                backgroundSize: '24px 24px',
              }}
            ></div>

            {/* Tactical Grid Lines Overlay */}
            <div className="absolute inset-0 pointer-events-none border border-[#1F2937]/40 flex flex-col justify-between p-4">
              <div className="flex justify-between text-[9px] text-gray-600 font-mono select-none">
                <span>LAT +90.00° / LNG -180.00°</span>
                <span>GRID: WGS-84 / MERCATOR DUAL</span>
                <span>LAT +90.00° / LNG +180.00°</span>
              </div>
              <div className="flex justify-between text-[9px] text-gray-600 font-mono select-none">
                <span>LAT -90.00° / LNG -180.00°</span>
                <span>SEC-TELEMETRY // CASE: {incident.caseNumber}</span>
                <span>LAT -90.00° / LNG +180.00°</span>
              </div>
            </div>

            {/* SVG Visual Graphic */}
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-full relative z-10"
              style={{ filter: 'drop-shadow(0px 0px 10px rgba(0, 224, 255, 0.1))' }}
            >
              <defs>
                {/* Vector Gradient from Origin to Target */}
                <linearGradient id="mailVectorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF3D00" />
                  <stop offset="50%" stopColor="#00E0FF" />
                  <stop offset="100%" stopColor="#00FF41" />
                </linearGradient>

                <radialGradient id="originPulseGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FF3D00" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#FF3D00" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#FF3D00" stopOpacity="0" />
                </radialGradient>

                <radialGradient id="targetPulseGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00FF41" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#00FF41" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#00FF41" stopOpacity="0" />
                </radialGradient>

                <filter id="cyberGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* World Latitude/Longitude Graticules */}
              <g stroke="#1A1A24" strokeWidth="0.5" strokeDasharray="3 3">
                {/* Equator */}
                <line x1="0" y1="250" x2="1000" y2="250" stroke="#252535" strokeWidth="0.8" />
                {/* Prime Meridian */}
                <line x1="500" y1="0" x2="500" y2="500" stroke="#252535" strokeWidth="0.8" />
                {/* Latitudes */}
                <line x1="0" y1="125" x2="1000" y2="125" />
                <line x1="0" y1="375" x2="1000" y2="375" />
                {/* Longitudes */}
                <line x1="250" y1="0" x2="250" y2="500" />
                <line x1="750" y1="0" x2="750" y2="500" />
              </g>

              {/* Continent Geographic Outlines */}
              <g
                fill={
                  viewMode === 'satellite'
                    ? 'rgba(10, 24, 20, 0.85)'
                    : viewMode === 'vector'
                    ? 'rgba(25, 15, 35, 0.85)'
                    : 'rgba(18, 18, 28, 0.85)'
                }
                stroke={
                  viewMode === 'satellite'
                    ? '#1F3A2E'
                    : viewMode === 'vector'
                    ? '#3A2045'
                    : '#222230'
                }
                strokeWidth="0.9"
              >
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

              {/* Intermediate Relay Hop Path (if enabled) */}
              {showRelayHops && intermediateHops.length > 0 && (
                <g opacity="0.6">
                  {intermediateHops.map((hop, idx) => {
                    if (idx === intermediateHops.length - 1) return null;
                    const nextHop = intermediateHops[idx + 1];
                    const p1 = project(hop.geo!.lat, hop.geo!.lng);
                    const p2 = project(nextHop.geo!.lat, nextHop.geo!.lng);
                    return (
                      <line
                        key={`inter-hop-${idx}`}
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke="#00E0FF"
                        strokeWidth="1.2"
                        strokeDasharray="3 3"
                      />
                    );
                  })}
                </g>
              )}

              {/* PRIMARY BALLISTIC TRAJECTORY VECTOR (Where mail was raised -> To them) */}
              <g>
                {/* Outer Glow Halo Path */}
                <path
                  d={trajectoryPath}
                  fill="none"
                  stroke="url(#mailVectorGrad)"
                  strokeWidth="6"
                  opacity="0.25"
                  filter="url(#cyberGlow)"
                />

                {/* Solid Core Path */}
                <path
                  d={trajectoryPath}
                  fill="none"
                  stroke="url(#mailVectorGrad)"
                  strokeWidth="2.5"
                  strokeDasharray="6 3"
                />

                {/* Animated Flying Packet along trajectory */}
                <circle r="4.5" fill="#FFFFFF" filter="url(#cyberGlow)">
                  <animateMotion path={trajectoryPath} dur="2.8s" repeatCount="indefinite" />
                </circle>

                {/* Second trailing packet */}
                <circle r="2.5" fill="#00E0FF" opacity="0.75">
                  <animateMotion path={trajectoryPath} dur="2.8s" begin="0.4s" repeatCount="indefinite" />
                </circle>
              </g>

              {/* TARGET NODE: "DELIVERED TO THEM" (Enterprise Recipient) */}
              <g transform={`translate(${targetCoords.x}, ${targetCoords.y})`}>
                {/* Radar Ripple Waves */}
                <circle
                  r="26"
                  fill="none"
                  stroke="#00FF41"
                  strokeWidth="1"
                  opacity="0.3"
                  className="animate-ping"
                />
                <circle
                  r="16"
                  fill="none"
                  stroke="#00FF41"
                  strokeWidth="1.2"
                  opacity="0.6"
                />
                <circle r="12" fill="url(#targetPulseGlow)" />
                <circle r="6" fill="#00FF41" stroke="#FFFFFF" strokeWidth="1.5" />

                {/* Text Label Callout */}
                <g transform="translate(14, -8)">
                  <rect
                    x="0"
                    y="-12"
                    width="180"
                    height="32"
                    fill="rgba(10, 15, 10, 0.9)"
                    stroke="#00FF41"
                    strokeWidth="0.8"
                    rx="2"
                  />
                  <text x="6" y="0" fill="#00FF41" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    DELIVERED TO: {target.city}, {target.countryCode}
                  </text>
                  <text x="6" y="12" fill="#AAAAAA" fontSize="8" fontFamily="monospace">
                    {incident.recipientAddress}
                  </text>
                </g>
              </g>

              {/* ORIGIN NODE: "WHERE THE MAIL WAS RAISED" (Attacker / Sender) */}
              <g transform={`translate(${originCoords.x}, ${originCoords.y})`}>
                {/* Pulse Glow & Radar Crosshair */}
                <circle
                  r="30"
                  fill="none"
                  stroke="#FF3D00"
                  strokeWidth="1.2"
                  opacity="0.4"
                  className="animate-ping"
                />
                <circle
                  r="18"
                  fill="none"
                  stroke="#FF3D00"
                  strokeWidth="1.5"
                  opacity="0.8"
                />
                <circle r="14" fill="url(#originPulseGlow)" />
                <circle r="7" fill="#FF3D00" stroke="#FFFFFF" strokeWidth="2" />

                {/* Tactical Reticle Crosshairs */}
                <line x1="-12" y1="0" x2="-6" y2="0" stroke="#FF3D00" strokeWidth="1.5" />
                <line x1="6" y1="0" x2="12" y2="0" stroke="#FF3D00" strokeWidth="1.5" />
                <line x1="0" y1="-12" x2="0" y2="-6" stroke="#FF3D00" strokeWidth="1.5" />
                <line x1="0" y1="6" x2="0" y2="12" stroke="#FF3D00" strokeWidth="1.5" />

                {/* Text Label Callout */}
                <g transform="translate(14, -8)">
                  <rect
                    x="0"
                    y="-12"
                    width="190"
                    height="34"
                    fill="rgba(20, 10, 10, 0.92)"
                    stroke="#FF3D00"
                    strokeWidth="0.9"
                    rx="2"
                  />
                  <text x="6" y="0" fill="#FF3D00" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    RAISED FROM: {origin.city}, {origin.countryCode}
                  </text>
                  <text x="6" y="12" fill="#FFFFFF" fontSize="8" fontFamily="monospace">
                    IP: {origin.ip} ({origin.lat.toFixed(2)}°, {origin.lng.toFixed(2)}°)
                  </text>
                </g>
              </g>

              {/* Trajectory Distance Indicator Marker */}
              <g transform={`translate(${midX}, ${midY + 12})`}>
                <rect
                  x="-65"
                  y="-11"
                  width="130"
                  height="22"
                  fill="rgba(0, 0, 0, 0.94)"
                  stroke="#00FF41"
                  strokeWidth="0.8"
                  rx="2"
                />
                <text
                  x="0"
                  y="4"
                  fill="#00FF41"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  ⚡ {distanceKm.toLocaleString()} KM VECTOR
                </text>
              </g>
            </svg>

            {/* Bottom HUD Telemetry Status */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 p-2 bg-[#000000]/92 backdrop-blur-md rounded-sm border border-[#1F2937] text-[10px] text-[#E5E7EB]/70">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[#E5E7EB]">
                  <span className="h-2 w-2 rounded-full bg-[#FF3D00]"></span>
                  Origin: <strong>{origin.city}, {origin.country}</strong>
                </span>
                <span className="text-[#E5E7EB]/40">→</span>
                <span className="flex items-center gap-1.5 text-[#E5E7EB]">
                  <span className="h-2 w-2 rounded-full bg-[#00FF41]"></span>
                  Destination: <strong>{target.city}, {target.country} ({incident.recipientAddress})</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span>
                  Origin Lat/Long: <strong className="text-[#E5E7EB]">{origin.lat}° / {origin.lng}°</strong>
                </span>
                <span>•</span>
                <span>
                  Target Lat/Long: <strong className="text-[#E5E7EB]">{target.lat}° / {target.lng}°</strong>
                </span>
                <span>•</span>
                <span className="text-[#00FF41] font-bold uppercase">
                  {incident.classification} Vector
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
