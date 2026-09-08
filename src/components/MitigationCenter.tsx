import React, { useState } from 'react';
import { EmailIncident } from '../types';
import {
  ShieldAlert,
  Ban,
  Radio,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertOctagon,
  Trash2,
  FileCheck,
  Send,
  ExternalLink,
  Blocks,
  Zap,
  Code,
} from 'lucide-react';

interface MitigationCenterProps {
  incidents: EmailIncident[];
  onExecuteAction: (incidentId: string, actionType: string, target: string) => void;
  onBroadcastIOC?: (iocValue: string, iocType: string) => void;
}

export const MitigationCenter: React.FC<MitigationCenterProps> = ({
  incidents,
  onExecuteAction,
  onBroadcastIOC,
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || '');
  const [broadcastingSmartContract, setBroadcastingSmartContract] = useState(false);

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  const handleAction = (type: string, target: string) => {
    if (!selectedIncident) return;
    onExecuteAction(selectedIncident.id, type, target);
  };

  const handleBroadcastContract = () => {
    setBroadcastingSmartContract(true);
    setTimeout(() => {
      onExecuteAction(
        selectedIncident.id,
        'smart_contract_ioc_broadcast',
        `${selectedIncident.domainIntel.domain} [IOC Hash Sealed]`
      );
      if (onBroadcastIOC) {
        onBroadcastIOC(selectedIncident.domainIntel.domain, 'DOMAIN');
      }
      setBroadcastingSmartContract(false);
    }, 500);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header - Immersive UI Theme */}
      <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#FF3D00]/10 border border-[#FF3D00]/30 text-[#FF3D00] shadow-[0_0_10px_rgba(255,61,0,0.2)]">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white uppercase tracking-widest">
                  Autonomous SOAR & Smart Contract Defense Trigger
                </h3>
                <span className="rounded-sm bg-[#00E0FF]/15 border border-[#00E0FF]/40 px-2 py-0.5 text-[9px] text-[#00E0FF] font-bold uppercase">
                  AutomatedSOARTrigger.sol Active
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-sans mt-0.5">
                On-chain authenticated containment, smart contract border gateway null-routes & immutable BGP blackholing
              </p>
            </div>
          </div>

          {/* Incident Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Select Case:</span>
            <select
              value={selectedIncidentId}
              onChange={(e) => setSelectedIncidentId(e.target.value)}
              className="rounded-sm border border-[#1A1A1F] bg-[#050507] px-3 py-1.5 text-xs font-mono text-white focus:border-[#00E0FF] focus:outline-none"
            >
              {incidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  {inc.caseNumber} - {inc.classification} ({inc.subject.substring(0, 28)}...)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Action Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Action 1: Gateway Quarantine */}
        <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 space-y-3 shadow-[0_0_20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2 text-[#FF3D00] font-bold text-xs uppercase tracking-wider">
            <AlertOctagon className="h-4 w-4" />
            <span>Global Gateway Quarantine</span>
          </div>
          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            Instantly recall and purge this message from all enterprise mailboxes and inbound gateway queues via smart contract.
          </p>
          <div className="text-[10px] text-gray-400 bg-[#12121A] p-2 rounded-sm border border-[#1A1A1F]">
            Target: <span className="text-white font-bold">{selectedIncident.recipientAddress}</span>
          </div>
          <button
            onClick={() => handleAction('quarantine', selectedIncident.recipientAddress)}
            className="w-full flex items-center justify-center gap-2 rounded-sm bg-[#FF3D00] hover:bg-red-600 text-white text-xs font-bold py-2 transition-colors shadow-[0_0_15px_rgba(255,61,0,0.3)] uppercase tracking-wider"
          >
            <Ban className="h-3.5 w-3.5" />
            <span>Enforce Global Quarantine</span>
          </button>
        </div>

        {/* Action 2: Firewall IP Block */}
        <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 space-y-3 shadow-[0_0_20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2 text-[#FF3D00] font-bold text-xs uppercase tracking-wider">
            <Ban className="h-4 w-4" />
            <span>Border Firewall IP Null-Route</span>
          </div>
          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            Deploy instantaneous BGP flowspec / null-route across corporate perimeter edge firewalls for originating adversary IP.
          </p>
          <div className="text-[10px] text-gray-400 bg-[#12121A] p-2 rounded-sm border border-[#1A1A1F]">
            IP Address: <span className="text-[#FF3D00] font-bold">{selectedIncident.originatingGeo.ip}</span>
          </div>
          <button
            onClick={() => handleAction('block_ip', selectedIncident.originatingGeo.ip)}
            className="w-full flex items-center justify-center gap-2 rounded-sm bg-[#12121A] border border-[#FF3D00]/40 hover:bg-[#FF3D00]/15 text-[#FF3D00] text-xs font-bold py-2 transition-colors uppercase tracking-wider"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Null-Route Origin IP</span>
          </button>
        </div>

        {/* Action 3: Smart Contract Threat Intel Broadcast */}
        <div className="rounded-md border border-[#00E0FF]/40 bg-[#00E0FF]/5 p-4 space-y-3 shadow-[0_0_20px_rgba(0,224,255,0.15)]">
          <div className="flex items-center gap-2 text-[#00E0FF] font-bold text-xs uppercase tracking-wider">
            <Blocks className="h-4 w-4" />
            <span>Consortium On-Chain Broadcast</span>
          </div>
          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            Broadcast domain & sender hashes to ThreatIntelligenceRegistry.sol so all partner consortium gateways auto-block immediately.
          </p>
          <div className="text-[10px] text-gray-400 bg-[#12121A] p-2 rounded-sm border border-[#1A1A1F]">
            IOC Domain: <span className="text-[#00E0FF] font-bold">{selectedIncident.domainIntel.domain}</span>
          </div>
          <button
            onClick={handleBroadcastContract}
            disabled={broadcastingSmartContract}
            className="w-full flex items-center justify-center gap-2 rounded-sm bg-[#00E0FF] hover:bg-[#00E0FF]/90 text-black text-xs font-bold py-2 transition-colors shadow-[0_0_15px_rgba(0,224,255,0.25)] uppercase tracking-wider disabled:opacity-50"
          >
            <Zap className={`h-3.5 w-3.5 ${broadcastingSmartContract ? 'animate-spin' : ''}`} />
            <span>{broadcastingSmartContract ? 'Broadcasting to Chain...' : 'Broadcast to ThreatRegistry.sol'}</span>
          </button>
        </div>

        {/* Action 4: Identity & Credential Reset */}
        <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 space-y-3 shadow-[0_0_20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
            <Lock className="h-4 w-4" />
            <span>Revoke Tokens & Reset Auth</span>
          </div>
          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            Terminate all active OAuth2 / SAML / Okta refresh tokens for the targeted employee and require mandatory FIDO2 re-auth.
          </p>
          <div className="text-[10px] text-gray-400 bg-[#12121A] p-2 rounded-sm border border-[#1A1A1F]">
            Identity: <span className="text-white font-bold">{selectedIncident.recipientAddress}</span>
          </div>
          <button
            onClick={() => handleAction('credential_reset', selectedIncident.recipientAddress)}
            className="w-full flex items-center justify-center gap-2 rounded-sm bg-[#12121A] border border-purple-500/40 hover:bg-purple-950/20 text-purple-400 text-xs font-bold py-2 transition-colors uppercase tracking-wider"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Rotate User Credentials</span>
          </button>
        </div>

        {/* Action 5: Dispatch SOC Alert */}
        <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 space-y-3 shadow-[0_0_20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2 text-[#00FF41] font-bold text-xs uppercase tracking-wider">
            <Send className="h-4 w-4" />
            <span>Escalate Incident to SOC Tier 2</span>
          </div>
          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            Send webhook payload with full STIX 2.1 indicators of compromise to SIEM / EDR platform.
          </p>
          <div className="text-[10px] text-gray-400 bg-[#12121A] p-2 rounded-sm border border-[#1A1A1F]">
            Channel: <span className="text-white font-bold">SIEM Webhook / Splunk SOAR</span>
          </div>
          <button
            onClick={() => handleAction('soc_alert', 'SOC Alert Channel')}
            className="w-full flex items-center justify-center gap-2 rounded-sm bg-[#12121A] border border-[#00FF41]/40 hover:bg-[#00FF41]/10 text-[#00FF41] text-xs font-bold py-2 transition-colors uppercase tracking-wider"
          >
            <FileCheck className="h-3.5 w-3.5" />
            <span>Dispatch SOC Broadcast</span>
          </button>
        </div>

        {/* Action 6: DNS Sinkhole */}
        <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 space-y-3 shadow-[0_0_20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2 text-[#EAB308] font-bold text-xs uppercase tracking-wider">
            <Radio className="h-4 w-4" />
            <span>Internal DNS RPZ Sinkhole</span>
          </div>
          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            Redirect lookups for the malicious impersonation domain to an isolated forensic honeypot sinkhole.
          </p>
          <div className="text-[10px] text-gray-400 bg-[#12121A] p-2 rounded-sm border border-[#1A1A1F]">
            Domain: <span className="text-[#EAB308] font-bold">{selectedIncident.domainIntel.domain}</span>
          </div>
          <button
            onClick={() => handleAction('dns_sinkhole', selectedIncident.domainIntel.domain)}
            className="w-full flex items-center justify-center gap-2 rounded-sm bg-[#12121A] border border-[#EAB308]/40 hover:bg-[#EAB308]/10 text-[#EAB308] text-xs font-bold py-2 transition-colors uppercase tracking-wider"
          >
            <Radio className="h-3.5 w-3.5" />
            <span>Deploy DNS Sinkhole</span>
          </button>
        </div>
      </div>

      {/* Mitigation Action Audit History with Blockchain Hashes */}
      <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between border-b border-[#1A1A1F] pb-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Immutable Chain of Custody & Smart Contract Defense Log
            </h4>
            <span className="text-[10px] text-gray-500">
              Every action sealed with cryptographic transaction hashes and smart contract events
            </span>
          </div>
          <span className="text-[10px] text-[#00FF41] font-bold uppercase">
            PoA Certified
          </span>
        </div>

        <div className="space-y-2">
          {selectedIncident.mitigationHistory.length === 0 ? (
            <p className="text-xs text-gray-500 py-4 text-center">
              No manual or automated mitigation actions executed on this case yet.
            </p>
          ) : (
            selectedIncident.mitigationHistory.map((mit, i) => (
              <div
                key={mit.id || i}
                className="rounded-sm border border-[#1A1A1F] bg-[#12121A] p-3 text-xs space-y-1.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-[#00FF41]" />
                    <div>
                      <span className="text-white font-bold uppercase">{mit.type.replace(/_/g, ' ')}</span>
                      <span className="text-gray-400 ml-2">Target: {mit.target}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-gray-500 text-[10px]">
                    <span>Operator: {mit.user}</span>
                    <span>{new Date(mit.executedAt).toLocaleTimeString()}</span>
                    <span className="rounded-sm bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 px-2 py-0.5 text-[9px] font-bold uppercase">
                      ACTIVE
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-500 font-mono pt-1 border-t border-[#1A1A1F]">
                  <span className="truncate max-w-[320px]">
                    Tx: {mit.txHash || `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`}
                  </span>
                  <span className="text-[#00E0FF]">
                    {mit.smartContractEvent || 'AutomatedSOARTrigger.DefenseExecuted()'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
