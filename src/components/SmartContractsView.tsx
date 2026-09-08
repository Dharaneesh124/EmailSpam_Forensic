import React, { useState } from 'react';
import { SmartContractDefense, EmailIncident } from '../types';
import { INITIAL_SMART_CONTRACTS } from '../utils/blockchainEngine';
import {
  Code,
  Zap,
  Radio,
  FileCheck,
  ShieldAlert,
  Terminal,
  Play,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

interface SmartContractsViewProps {
  incidents: EmailIncident[];
  onExecuteSOAR?: (incidentId: string, actionType: string, target: string) => void;
}

export const SmartContractsView: React.FC<SmartContractsViewProps> = ({
  incidents,
  onExecuteSOAR,
}) => {
  const [contracts, setContracts] = useState<SmartContractDefense[]>(INITIAL_SMART_CONTRACTS);
  const [selectedContractId, setSelectedContractId] = useState<string>(contracts[0].id);
  const [selectedFunction, setSelectedFunction] = useState<string>(contracts[0].functions[0].name);
  const [paramInput, setParamInput] = useState<string>('acme-enterprises.corp-settlement.com');
  const [executionResult, setExecutionResult] = useState<any | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const selectedContract = contracts.find((c) => c.id === selectedContractId) || contracts[0];

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleExecute = () => {
    setIsExecuting(true);
    setExecutionResult(null);

    setTimeout(() => {
      const txHash =
        '0x' +
        Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const gas = Math.floor(Math.random() * 25000) + 28000;

      let responsePayload: any = {};

      if (selectedFunction === 'queryIOCReputation') {
        responsePayload = {
          ioc: paramInput,
          consensusThreatScore: 98,
          verdict: 'MALICIOUS_PHISHING_DOMAIN',
          confirmations: 5,
          firstReportedBy: 'Cisco Talos Threat Intelligence Node',
          activeDefenseStatus: 'BORDER_GATEWAY_BLOCKED',
        };
      } else if (selectedFunction === 'broadcastMaliciousIOC') {
        responsePayload = {
          action: 'IOC Broadcasted across all federated consortium mail gateways',
          iocHash: '0x' + txHash.slice(2, 34),
          target: paramInput,
          propagationTimeMs: 18,
          status: 'COMMITTED_TO_MEMPOOL',
        };
      } else if (selectedFunction === 'verifyEvidenceIntegrity') {
        responsePayload = {
          caseNumber: paramInput || 'CASE-BEC-0982',
          verifiedAgainstBlock: 1,
          sha256Match: true,
          legalAdmissibility: 'ISO/IEC 27037 NOTARIZED_VALID',
          notarizedBy: 'Enterprise Primary Gateway Node',
        };
      } else if (selectedFunction === 'triggerEmergencyConsortiumQuarantine') {
        responsePayload = {
          targetMailbox: paramInput || 'cfo-office@acme-global.com',
          event: 'ConsortiumQuarantineEnforced',
          mitigationRule: 'RULE_BEC_HIGH_CONFIDENCE',
          status: 'ACTIVE_QUARANTINE',
        };
      } else if (selectedFunction === 'reportAdversaryWallet') {
        responsePayload = {
          walletAddress: paramInput || 'bc1q9d842x9p8kmk281920384710293847192q84j',
          currency: 'BTC',
          threatCluster: 'Scattered Spider Extortion',
          ofacFlagged: true,
          status: 'PROPAGATED_TO_EXCHANGE_COMPLIANCE_API',
        };
      } else {
        responsePayload = {
          function: selectedFunction,
          status: 'SUCCESS',
          returnValue: '0x0000000000000000000000000000000000000001',
        };
      }

      setExecutionResult({
        txHash,
        gasUsed: gas,
        contract: selectedContract.address,
        function: selectedFunction,
        executedAt: new Date().toISOString(),
        payload: responsePayload,
      });

      // Add to event emitted list
      const newEvent = {
        eventName: selectedFunction + 'Event',
        timestamp: new Date().toISOString(),
        txHash,
        params: responsePayload,
      };

      setContracts((prev) =>
        prev.map((c) =>
          c.id === selectedContract.id
            ? {
                ...c,
                totalInvocations: c.totalInvocations + 1,
                lastExecuted: new Date().toISOString(),
                eventsEmitted: [newEvent, ...c.eventsEmitted],
              }
            : c
        )
      );

      setIsExecuting(false);
    }, 500);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header Banner */}
      <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#FF3D00]/10 border border-[#FF3D00]/30 text-[#FF3D00] shadow-[0_0_12px_rgba(255,61,0,0.25)]">
              <Code className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white uppercase tracking-widest">
                Decentralized Autonomous Cybersecurity Smart Contracts
              </h3>
              <p className="text-[10px] text-gray-500 font-sans mt-0.5">
                On-chain executable defense routines, automated SOAR firewall triggers & cryptographic evidence locks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00FF41] animate-pulse"></span>
            <span className="text-[10px] text-[#00FF41] font-bold uppercase tracking-wider">
              EVM Virtual Machine Active
            </span>
          </div>
        </div>
      </div>

      {/* 4 Smart Contract Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contracts.map((contract) => {
          const isSelected = contract.id === selectedContractId;

          return (
            <div
              key={contract.id}
              onClick={() => {
                setSelectedContractId(contract.id);
                setSelectedFunction(contract.functions[0].name);
              }}
              className={`rounded-md border p-4 cursor-pointer transition-all duration-200 space-y-2 ${
                isSelected
                  ? 'border-[#00E0FF] bg-[#00E0FF]/10 shadow-[0_0_20px_rgba(0,224,255,0.2)]'
                  : 'border-[#1A1A1F] bg-[#0A0A0F] hover:border-gray-700 shadow-[0_0_15px_rgba(0,0,0,0.5)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-sm px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                    contract.category === 'Threat Intelligence'
                      ? 'bg-[#00E0FF]/20 text-[#00E0FF]'
                      : contract.category === 'Chain of Custody'
                      ? 'bg-[#00FF41]/20 text-[#00FF41]'
                      : contract.category === 'Automated SOAR'
                      ? 'bg-[#FF3D00]/20 text-[#FF3D00]'
                      : 'bg-[#EAB308]/20 text-[#EAB308]'
                  }`}
                >
                  {contract.category}
                </span>
                <span className="text-[9px] text-gray-400">{contract.version}</span>
              </div>

              <div className="font-bold text-xs text-white truncate">{contract.name}</div>
              <p className="text-[10px] text-gray-400 font-sans line-clamp-2">
                {contract.description}
              </p>

              <div className="pt-2 border-t border-[#1A1A1F] flex items-center justify-between text-[9px] text-gray-500">
                <span>Calls: {contract.totalInvocations.toLocaleString()}</span>
                <span className="text-[#00E0FF]">Active</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contract Detail & Interactive Function Caller */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Contract Functions & Interactive Executor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 shadow-[0_0_20px_rgba(0,0,0,0.6)] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1A1A1F] pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white uppercase tracking-wider">
                    {selectedContract.name}
                  </h4>
                  <span className="rounded-sm bg-[#00FF41]/10 border border-[#00FF41]/30 px-1.5 py-0.2 text-[8px] text-[#00FF41] font-bold">
                    VERIFIED BYTECODE
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  <span>Contract Address:</span>
                  <span className="text-[#00E0FF] font-mono">{selectedContract.address}</span>
                  <button
                    onClick={() => handleCopy(selectedContract.address)}
                    className="text-gray-500 hover:text-white"
                  >
                    {copiedAddress === selectedContract.address ? (
                      <Check className="h-3 w-3 text-[#00FF41]" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-gray-400">
                Total Invocations: <span className="text-white font-bold">{selectedContract.totalInvocations}</span>
              </div>
            </div>

            {/* Interactive Function Call Workbench */}
            <div className="rounded-sm border border-[#1A1A1F] bg-[#050507] p-4 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                <Terminal className="h-4 w-4 text-[#00FF41]" />
                <span>Execute Smart Contract Method (Web3 Interface)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase font-bold">Select Function:</label>
                  <select
                    value={selectedFunction}
                    onChange={(e) => setSelectedFunction(e.target.value)}
                    className="w-full rounded-sm border border-[#1A1A1F] bg-[#0A0A0F] p-2 text-xs font-mono text-white focus:border-[#00E0FF] focus:outline-none"
                  >
                    {selectedContract.functions.map((fn) => (
                      <option key={fn.name} value={fn.name}>
                        {fn.name}() - {fn.accessLevel}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase font-bold">Parameter / Target Input:</label>
                  <input
                    type="text"
                    value={paramInput}
                    onChange={(e) => setParamInput(e.target.value)}
                    placeholder="Enter IP, domain, wallet, or hash..."
                    className="w-full rounded-sm border border-[#1A1A1F] bg-[#0A0A0F] p-2 text-xs font-mono text-white focus:border-[#00E0FF] focus:outline-none"
                  />
                </div>
              </div>

              {/* Function Description & Parameters Info */}
              {(() => {
                const fnObj = selectedContract.functions.find((f) => f.name === selectedFunction);
                if (!fnObj) return null;
                return (
                  <div className="text-xs text-gray-400 font-sans bg-[#0A0A0F] p-2.5 rounded-sm border border-[#1A1A1F] space-y-1">
                    <div className="text-white font-mono text-[11px]">
                      {fnObj.name}({fnObj.params.join(', ')})
                    </div>
                    <div>{fnObj.description}</div>
                  </div>
                );
              })()}

              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="flex items-center justify-center gap-2 rounded-sm bg-[#00FF41] px-4 py-2 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#00FF41]/90 transition-colors shadow-[0_0_15px_rgba(0,255,65,0.3)] disabled:opacity-50"
              >
                <Play className={`h-3.5 w-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
                <span>{isExecuting ? 'Broadcasting to Consortium Mempool...' : 'Execute On-Chain Transaction'}</span>
              </button>
            </div>

            {/* Execution Result Terminal Display */}
            {executionResult && (
              <div className="rounded-sm border border-[#00FF41]/40 bg-[#00FF41]/5 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-[#00FF41]/20 pb-2">
                  <div className="flex items-center gap-2 text-[#00FF41] font-bold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>TRANSACTION CONFIRMED (1 BLOCK CONFIRMATION)</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">
                    Gas Used: {executionResult.gasUsed.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-1 text-[11px] font-mono">
                  <div className="text-gray-400 truncate">
                    <span className="text-gray-500">Tx Hash: </span>
                    <span className="text-[#00E0FF]">{executionResult.txHash}</span>
                  </div>
                  <div className="text-gray-400">
                    <span className="text-gray-500">Contract: </span>
                    <span className="text-white">{executionResult.contract}</span>
                  </div>
                  <div className="text-gray-400">
                    <span className="text-gray-500">Method: </span>
                    <span className="text-[#00FF41]">{executionResult.function}()</span>
                  </div>
                  <div className="bg-[#050507] p-2.5 rounded-sm border border-[#1A1A1F] text-gray-200 mt-2">
                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">State Transition / Return Payload:</div>
                    <pre className="overflow-x-auto text-[10px] text-[#00E0FF]">
                      {JSON.stringify(executionResult.payload, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Smart Contract Events Stream */}
        <div className="space-y-4">
          <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 shadow-[0_0_20px_rgba(0,0,0,0.6)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                <Radio className="h-4 w-4 text-[#00E0FF] animate-pulse" />
                <span>On-Chain Defense Events</span>
              </div>
              <span className="text-[9px] text-gray-400 uppercase">Live EVM Logs</span>
            </div>

            <div className="space-y-2">
              {selectedContract.eventsEmitted.map((ev, idx) => (
                <div
                  key={ev.txHash + idx}
                  className="rounded-sm border border-[#1A1A1F] bg-[#050507] p-2.5 space-y-1 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#00FF41] font-bold">{ev.eventName}</span>
                    <span className="text-gray-500">
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-[9px] text-gray-400 font-mono truncate">
                    Tx: {ev.txHash}
                  </div>
                  <div className="bg-[#0A0A0F] p-1.5 rounded-sm text-[9px] text-gray-300 font-mono">
                    <pre className="overflow-x-auto">
                      {JSON.stringify(ev.params, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
