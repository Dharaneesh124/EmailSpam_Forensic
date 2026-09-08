import React from 'react';
import { GeoLocation, DomainIntelligence, EmailIncident } from '../types';
import { MailOriginGeoPicture } from './MailOriginGeoPicture';
import {
  Globe,
  MapPin,
  Server,
  ShieldAlert,
  Calendar,
  AlertTriangle,
  Building,
  Radio,
  FileSearch,
  ExternalLink,
} from 'lucide-react';

interface GeoIntelTabProps {
  originGeo: GeoLocation;
  domainIntel: DomainIntelligence;
  incident?: EmailIncident;
}

export const GeoIntelTab: React.FC<GeoIntelTabProps> = ({ originGeo, domainIntel, incident }) => {
  return (
    <div className="space-y-6">
      {/* Geolocation Origin Picture */}
      {incident && (
        <MailOriginGeoPicture incident={incident} />
      )}

      {/* Top Grid: IP Geolocation + Domain WHOIS Summary - Immersive UI Theme */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card 1: Originating IP Geolocation & Autonomous System */}
        <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1A1A1F] pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#FF3D00]" />
              <h3 className="font-mono font-bold text-xs uppercase text-white tracking-wider">
                Originating IP Geolocation Intelligence
              </h3>
            </div>
            <span
              className={`px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase ${
                originGeo.threatScore > 80
                  ? 'bg-[#FF3D00]/10 text-[#FF3D00] border border-[#FF3D00]/30'
                  : originGeo.threatScore > 40
                  ? 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/30'
                  : 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30'
              }`}
            >
              IP THREAT: {originGeo.threatScore}/100
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-[#12121A] p-2.5 rounded-sm border border-[#1A1A1F]">
              <span className="text-gray-500 text-[9px] uppercase tracking-wider block mb-0.5">Extracted Origin IP</span>
              <span className="text-[#00E0FF] font-bold text-xs">{originGeo.ip}</span>
            </div>
            <div className="bg-[#12121A] p-2.5 rounded-sm border border-[#1A1A1F]">
              <span className="text-gray-500 text-[9px] uppercase tracking-wider block mb-0.5">Location & Country</span>
              <span className="text-white font-semibold text-xs truncate block">
                {originGeo.city}, {originGeo.country} ({originGeo.countryCode})
              </span>
            </div>
            <div className="bg-[#12121A] p-2.5 rounded-sm border border-[#1A1A1F]">
              <span className="text-gray-500 text-[9px] uppercase tracking-wider block mb-0.5">Coordinates</span>
              <span className="text-gray-300 text-xs">
                {originGeo.lat.toFixed(4)}° N, {originGeo.lng.toFixed(4)}° E
              </span>
            </div>
            <div className="bg-[#12121A] p-2.5 rounded-sm border border-[#1A1A1F]">
              <span className="text-gray-500 text-[9px] uppercase tracking-wider block mb-0.5">Autonomous System (ASN)</span>
              <span className="text-gray-300 text-xs truncate block">{originGeo.asn}</span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-mono bg-[#12121A] p-3 rounded-sm border border-[#1A1A1F]">
            <div className="flex justify-between">
              <span className="text-gray-500">ISP:</span>
              <span className="text-gray-200 font-medium">{originGeo.isp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Registered Org:</span>
              <span className="text-gray-300">{originGeo.org}</span>
            </div>
          </div>

          {/* Anonymizer Flags */}
          <div className="border-t border-[#1A1A1F] pt-3">
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-2 font-bold">
              Anonymization & Proxy Fingerprints
            </span>
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
              <div
                className={`p-2 rounded-sm border ${
                  originGeo.isTor
                    ? 'border-[#FF3D00]/50 bg-[#FF3D00]/10 text-[#FF3D00] font-bold'
                    : 'border-[#1A1A1F] bg-[#12121A] text-gray-500'
                }`}
              >
                TOR NODE
                <span className="block text-[8px] mt-0.5">{originGeo.isTor ? 'DETECTED' : 'CLEAR'}</span>
              </div>
              <div
                className={`p-2 rounded-sm border ${
                  originGeo.isVpn
                    ? 'border-[#EAB308]/50 bg-[#EAB308]/10 text-[#EAB308] font-bold'
                    : 'border-[#1A1A1F] bg-[#12121A] text-gray-500'
                }`}
              >
                VPN TUNNEL
                <span className="block text-[8px] mt-0.5">{originGeo.isVpn ? 'DETECTED' : 'CLEAR'}</span>
              </div>
              <div
                className={`p-2 rounded-sm border ${
                  originGeo.isProxy
                    ? 'border-[#FF3D00]/50 bg-[#FF3D00]/10 text-[#FF3D00] font-bold'
                    : 'border-[#1A1A1F] bg-[#12121A] text-gray-500'
                }`}
              >
                OPEN PROXY
                <span className="block text-[8px] mt-0.5">{originGeo.isProxy ? 'DETECTED' : 'CLEAR'}</span>
              </div>
              <div
                className={`p-2 rounded-sm border ${
                  originGeo.isCloudHosting
                    ? 'border-[#00E0FF]/50 bg-[#00E0FF]/10 text-[#00E0FF] font-bold'
                    : 'border-[#1A1A1F] bg-[#12121A] text-gray-500'
                }`}
              >
                VPS / CLOUD
                <span className="block text-[8px] mt-0.5">{originGeo.isCloudHosting ? 'DETECTED' : 'RESIDENTIAL'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Domain Intelligence & WHOIS Analysis */}
        <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1A1A1F] pb-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#00E0FF]" />
              <h3 className="font-mono font-bold text-xs uppercase text-white tracking-wider">
                Domain WHOIS & Threat Infrastructure
              </h3>
            </div>
            <span
              className={`px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase ${
                domainIntel.threatReputationScore > 80
                  ? 'bg-[#FF3D00]/10 text-[#FF3D00] border border-[#FF3D00]/30'
                  : domainIntel.threatReputationScore > 40
                  ? 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/30'
                  : 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30'
              }`}
            >
              DOMAIN RISK: {domainIntel.threatReputationScore}/100
            </span>
          </div>

          {/* Lookalike Warning Banner */}
          {domainIntel.isLookalike && (
            <div className="flex items-start gap-2.5 rounded-sm border border-[#FF3D00]/40 bg-[#FF3D00]/10 p-3 text-xs text-[#FF3D00]">
              <AlertTriangle className="h-4 w-4 shrink-0 text-[#FF3D00] mt-0.5" />
              <div>
                <span className="font-bold uppercase tracking-wider text-[10px]">Deceptive Lookalike / Typosquat Domain Identified</span>
                <p className="text-[10px] text-gray-300 mt-0.5">
                  Adversary registered this domain to impersonate: <strong className="text-white">{domainIntel.lookalikeTarget}</strong>
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-[#12121A] p-2.5 rounded-sm border border-[#1A1A1F]">
              <span className="text-gray-500 text-[9px] uppercase tracking-wider block mb-0.5">Sender Domain</span>
              <span className="text-[#00E0FF] font-bold text-xs truncate block">{domainIntel.domain}</span>
            </div>
            <div className="bg-[#12121A] p-2.5 rounded-sm border border-[#1A1A1F]">
              <span className="text-gray-500 text-[9px] uppercase tracking-wider block mb-0.5">Registration Intel</span>
              <span className={`font-bold text-xs ${domainIntel.ageDays < 30 ? 'text-[#FF3D00]' : 'text-[#00FF41]'}`}>
                {domainIntel.ageDays} Days Old
                {domainIntel.ageDays < 14 && ' (FRESH)'}
              </span>
            </div>
            <div className="bg-[#12121A] p-2.5 rounded-sm border border-[#1A1A1F]">
              <span className="text-gray-500 text-[9px] uppercase tracking-wider block mb-0.5">ICANN Registrar</span>
              <span className="text-white truncate block text-xs">{domainIntel.registrar}</span>
            </div>
            <div className="bg-[#12121A] p-2.5 rounded-sm border border-[#1A1A1F]">
              <span className="text-gray-500 text-[9px] uppercase tracking-wider block mb-0.5">Registration Date</span>
              <span className="text-gray-300 text-xs">
                {new Date(domainIntel.creationDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* DNS Records & NameServers */}
          <div className="space-y-2 text-xs font-mono bg-[#12121A] p-3 rounded-sm border border-[#1A1A1F]">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Authoritative NameServers:</span>
              <span className="text-gray-200 text-xs">{domainIntel.nameServers.join(', ')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Configured Mail Exchangers (MX):</span>
              <span className="text-gray-300 text-xs truncate max-w-[200px]">{domainIntel.mxRecords.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
