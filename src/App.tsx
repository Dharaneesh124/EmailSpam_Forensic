import React, { useState } from 'react';
import { SAMPLE_INCIDENTS } from './data/sampleIncidents';
import { EmailIncident, GeoLocation, CyberBlock, ConsortiumNode, BlockchainTransaction } from './types';
import { DashboardOverview } from './components/DashboardOverview';
import { EmailAnalyzer } from './components/EmailAnalyzer';
import { MitigationCenter } from './components/MitigationCenter';
import { ForensicReportModal } from './components/ForensicReportModal';
import { LiveIngestModal } from './components/LiveIngestModal';
import { BlockchainLedgerView } from './components/BlockchainLedgerView';
import { SmartContractsView } from './components/SmartContractsView';
import { ByteCodeRainBackground } from './components/ByteCodeRainBackground';
import {
  INITIAL_CYBER_BLOCKS,
  INITIAL_CONSORTIUM_NODES,
  mineNewPoABlock,
  createBlockchainTransaction,
  sha256Sync,
} from './utils/blockchainEngine';
import {
  ShieldAlert,
  ShieldCheck,
  Radio,
  Search,
  SlidersHorizontal,
  Eye,
  EyeOff,
  Upload,
  FileText,
  Activity,
  Layers,
  CheckCircle2,
  Lock,
  Blocks,
  Code,
  Zap,
  Binary,
} from 'lucide-react';

export default function App() {
  const [incidents, setIncidents] = useState<EmailIncident[]>(SAMPLE_INCIDENTS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(SAMPLE_INCIDENTS[0].id);
  const [activeView, setActiveView] = useState<
    'dashboard' | 'analyzer' | 'mitigation' | 'blockchain' | 'smart_contracts'
  >('dashboard');

  // Blockchain Ledger State
  const [blocks, setBlocks] = useState<CyberBlock[]>(INITIAL_CYBER_BLOCKS);
  const [nodes, setNodes] = useState<ConsortiumNode[]>(INITIAL_CONSORTIUM_NODES);

  // Security Analyst Preferences & Cyber UI Effects
  const [maskPii, setMaskPii] = useState(false);
  const [byteCodeFlow, setByteCodeFlow] = useState(true);
  const [byteCodeTheme, setByteCodeTheme] = useState<'cyan' | 'matrix' | 'hybrid'>('matrix');

  // Modals
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [ingestModalOpen, setIngestModalOpen] = useState(false);
  const [reportIncident, setReportIncident] = useState<EmailIncident>(SAMPLE_INCIDENTS[0]);

  // Active Selected Incident
  const currentIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  // Actions
  const handleSelectIncident = (inc: EmailIncident) => {
    setSelectedIncidentId(inc.id);
    setActiveView('analyzer');
  };

  const handleSelectGeo = (geo: GeoLocation) => {
    const matched = incidents.find((i) => i.originatingGeo.ip === geo.ip);
    if (matched) {
      setSelectedIncidentId(matched.id);
      setActiveView('analyzer');
    }
  };

  // Helper to record on-chain transaction
  const recordOnChainAction = (
    type: 'SOAR_ACTION_TRIGGERED' | 'IOC_REGISTERED' | 'THREAT_BLACKLISTED',
    incidentCaseNumber: string,
    payload: Record<string, any>
  ) => {
    const tx = createBlockchainTransaction(
      type,
      incidentCaseNumber,
      '0x3E11889a718290ccB382109848A1099238A792f4',
      `SOAR_AUTOMATION_${Date.now()}`,
      payload,
      'AutomatedSOARTrigger.sol',
      'AutomatedSOARTrigger.DefenseExecuted()'
    );

    // Mine a new block with this transaction
    const latestBlock = blocks[blocks.length - 1];
    const newBlock = mineNewPoABlock([tx], latestBlock.blockHash, nodes[0].address);
    setBlocks((prev) => [...prev, newBlock]);
    return tx.txHash;
  };

  const handleQuarantine = (id: string) => {
    const targetInc = incidents.find((i) => i.id === id);
    const txHash = recordOnChainAction('SOAR_ACTION_TRIGGERED', targetInc?.caseNumber || 'CASE-UNK', {
      action: 'GATEWAY_QUARANTINE',
      target: targetInc?.recipientAddress,
    });

    setIncidents((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: 'quarantined',
              mitigationHistory: [
                {
                  id: 'mit-' + Date.now(),
                  type: 'quarantine',
                  target: i.recipientAddress,
                  executedAt: new Date().toISOString(),
                  user: 'Analyst (Auto/SOAR)',
                  status: 'active',
                  txHash,
                  smartContractEvent: 'AutomatedSOARTrigger.GlobalQuarantineEnforced()',
                },
                ...i.mitigationHistory,
              ],
            }
          : i
      )
    );
  };

  const handleBlockIp = (ip: string) => {
    const targetInc = incidents.find((i) => i.originatingGeo.ip === ip);
    const txHash = recordOnChainAction('THREAT_BLACKLISTED', targetInc?.caseNumber || 'CASE-UNK', {
      action: 'BORDER_FIREWALL_NULL_ROUTE',
      ip,
    });

    setIncidents((prev) =>
      prev.map((i) =>
        i.originatingGeo.ip === ip
          ? {
              ...i,
              status: 'blocked',
              mitigationHistory: [
                {
                  id: 'mit-' + Date.now(),
                  type: 'block_ip',
                  target: ip,
                  executedAt: new Date().toISOString(),
                  user: 'SOC Lead',
                  status: 'active',
                  txHash,
                  smartContractEvent: 'AutomatedSOARTrigger.FirewallNullRouteDispatched()',
                },
                ...i.mitigationHistory,
              ],
            }
          : i
      )
    );
  };

  const handleExecuteMitigationAction = (
    incidentId: string,
    actionType: any,
    target: string
  ) => {
    const targetInc = incidents.find((i) => i.id === incidentId);
    const txHash = recordOnChainAction('SOAR_ACTION_TRIGGERED', targetInc?.caseNumber || 'CASE-UNK', {
      action: actionType,
      target,
    });

    setIncidents((prev) =>
      prev.map((i) =>
        i.id === incidentId
          ? {
              ...i,
              status: 'quarantined',
              mitigationHistory: [
                {
                  id: 'mit-' + Date.now(),
                  type: actionType,
                  target,
                  executedAt: new Date().toISOString(),
                  user: 'SOC Lead (Manual)',
                  status: 'active',
                  txHash,
                  smartContractEvent: 'AutomatedSOARTrigger.DefenseExecuted()',
                },
                ...i.mitigationHistory,
              ],
            }
          : i
      )
    );
  };

  const handleBroadcastIOC = (iocValue: string, iocType: string) => {
    recordOnChainAction('IOC_REGISTERED', currentIncident.caseNumber, {
      iocValue,
      iocType,
      registrar: 'CISA-AIS-NODE-01',
      consensusApproved: true,
    });
  };

  const handleMineBlock = (transactions: BlockchainTransaction[]) => {
    const latestBlock = blocks[blocks.length - 1];
    const newBlock = mineNewPoABlock(transactions, latestBlock.hash, nodes[0].address);
    setBlocks((prev) => [...prev, newBlock]);
  };

  const handleIngestSuccess = (newIncident: EmailIncident) => {
    // Record on-chain evidence seal transaction
    const tx = createBlockchainTransaction(
      'EVIDENCE_SEALED',
      newIncident.caseNumber,
      '0x3E11889a718290ccB382109848A1099238A792f4',
      newIncident.sha256,
      {
        subject: newIncident.subject,
        sender: newIncident.senderAddress,
        fraudScore: newIncident.fraudScore,
        classification: newIncident.classification,
      },
      'EvidenceChainOfCustody.sol',
      'EvidenceChainOfCustody.EvidenceSealed()'
    );

    const latestBlock = blocks[blocks.length - 1];
    const newBlock = mineNewPoABlock([tx], latestBlock.blockHash, nodes[0].address);
    setBlocks((prev) => [...prev, newBlock]);

    // Update incident proof to reference the newly minted block
    newIncident.blockchainProof = {
      blockNumber: newBlock.index,
      blockHash: newBlock.blockHash,
      txHash: tx.txHash,
      timestamp: newBlock.timestamp,
      merkleRoot: newBlock.merkleRoot,
      smartContractAddress: '0x3E11889a718290ccB382109848A1099238A792f4',
      smartContractAction: 'EvidenceChainOfCustody.sealEmailEvidence()',
      consensusSignatures: 5,
      validatorNode: nodes[0].name,
      isImmutable: true,
    };

    setIncidents((prev) => [newIncident, ...prev]);
    setSelectedIncidentId(newIncident.id);
    setActiveView('analyzer');
  };

  const handleOpenReport = (incident: EmailIncident) => {
    setReportIncident(incident);
    setReportModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#000000] text-[#E5E7EB] font-sans antialiased selection:bg-[#00FF41]/30 selection:text-[#00FF41] overflow-x-hidden">
      {/* Cyber Bytecode Running Flow (0's and 1's stream effect in background) */}
      {byteCodeFlow && (
        <ByteCodeRainBackground
          opacity={0.2}
          speed={1.0}
          theme={byteCodeTheme}
        />
      )}

      {/* Top Enterprise Header Bar - Immersive UI Theme */}
      <header className="sticky top-0 z-40 border-b border-[#1F2937] bg-[#000000]/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand Logo & Telemetry Beacon */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-[#00FF41] rounded-sm flex items-center justify-center shadow-[0_0_18px_rgba(0,255,65,0.4)] shrink-0">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-bold tracking-widest text-[#E5E7EB] uppercase flex items-center gap-2">
                  <span>EMAIL<span className="text-[#00FF41]">FORENSICS</span></span>
                </h1>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-[#1F2937]/60 p-1 rounded-sm border border-[#1F2937]">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all uppercase tracking-wider ${
                  activeView === 'dashboard'
                    ? 'bg-[#1F2937] text-[#00FF41] border border-[#00FF41]/40 shadow-[0_0_12px_rgba(0,255,65,0.25)]'
                    : 'text-[#E5E7EB]/60 hover:text-[#E5E7EB] border border-transparent'
                }`}
              >
                <Activity className="h-3.5 w-3.5" />
                <span>Threat Dashboard</span>
              </button>

              <button
                onClick={() => setActiveView('analyzer')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all uppercase tracking-wider ${
                  activeView === 'analyzer'
                    ? 'bg-[#1F2937] text-[#00FF41] border border-[#00FF41]/40 shadow-[0_0_12px_rgba(0,255,65,0.25)]'
                    : 'text-[#E5E7EB]/60 hover:text-[#E5E7EB] border border-transparent'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Forensic Workbench</span>
              </button>

              <button
                onClick={() => setActiveView('mitigation')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all uppercase tracking-wider ${
                  activeView === 'mitigation'
                    ? 'bg-[#1F2937] text-[#00FF41] border border-[#00FF41]/40 shadow-[0_0_12px_rgba(0,255,65,0.25)]'
                    : 'text-[#E5E7EB]/60 hover:text-[#E5E7EB] border border-transparent'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>SOAR Mitigation</span>
              </button>

              <button
                onClick={() => setActiveView('blockchain')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all uppercase tracking-wider ${
                  activeView === 'blockchain'
                    ? 'bg-[#1F2937] text-[#00FF41] border border-[#00FF41]/40 shadow-[0_0_12px_rgba(0,255,65,0.25)]'
                    : 'text-[#E5E7EB]/60 hover:text-[#E5E7EB] border border-transparent'
                }`}
              >
                <Blocks className="h-3.5 w-3.5 text-[#00FF41]" />
                <span>Threat Blockchain</span>
                <span className="bg-[#00FF41]/20 text-[#00FF41] px-1 py-0.2 rounded text-[9px]">
                  #{blocks.length - 1}
                </span>
              </button>

              <button
                onClick={() => setActiveView('smart_contracts')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all uppercase tracking-wider ${
                  activeView === 'smart_contracts'
                    ? 'bg-[#1F2937] text-[#00FF41] border border-[#00FF41]/40 shadow-[0_0_12px_rgba(0,255,65,0.25)]'
                    : 'text-[#E5E7EB]/60 hover:text-[#E5E7EB] border border-transparent'
                }`}
              >
                <Code className="h-3.5 w-3.5 text-[#00FF41]" />
                <span>Smart Contracts</span>
              </button>
            </nav>

            {/* Right Telemetry & Quick Action */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-4 border-r border-[#1F2937] pr-4">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] text-[#E5E7EB]/60 uppercase font-bold tracking-wider">
                    PoA Consortium Quorum
                  </span>
                  <span className="text-xs text-[#00FF41] font-mono flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00FF41] animate-pulse"></span>
                    5/5 NODES SYNCED
                  </span>
                </div>
                <div className="h-6 w-[1px] bg-[#1F2937]"></div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] text-[#E5E7EB]/60 uppercase font-bold tracking-wider">
                    Block Height
                  </span>
                  <span className="text-xs text-[#E5E7EB] font-mono font-bold">
                    #{blocks.length - 1} ({blocks.reduce((acc, b) => acc + b.transactions.length, 0)} Txs)
                  </span>
                </div>
              </div>

              {/* Bytecode Stream Animation Toggle */}
              <div className="flex items-center rounded-sm border border-[#1F2937] bg-[#000000] p-0.5 font-mono text-xs">
                <button
                  onClick={() => setByteCodeFlow(!byteCodeFlow)}
                  title="Toggle Cinema Hacker Rain (0's and 1's long cascading streams)"
                  className={`flex items-center gap-1.5 px-2 py-1 transition-colors uppercase tracking-wider rounded-sm ${
                    byteCodeFlow
                      ? 'bg-[#00FF41]/15 text-[#00FF41] border border-[#00FF41]/40 shadow-[0_0_10px_rgba(0,255,65,0.2)]'
                      : 'text-[#E5E7EB]/50 hover:text-[#E5E7EB]'
                  }`}
                >
                  <Binary className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{byteCodeFlow ? 'HACKER RAIN: ON' : 'RAIN: OFF'}</span>
                </button>
                {byteCodeFlow && (
                  <button
                    onClick={() => setByteCodeTheme(byteCodeTheme === 'matrix' ? 'cyan' : 'matrix')}
                    title={`Current theme: ${byteCodeTheme.toUpperCase()}. Click to switch color.`}
                    className="px-1.5 py-1 text-[10px] text-[#E5E7EB]/60 hover:text-[#00FF41] uppercase transition-colors border-l border-[#1F2937]"
                  >
                    {byteCodeTheme === 'matrix' ? 'GRN' : 'CYN'}
                  </button>
                )}
              </div>

              {/* PII Masking Toggle */}
              <button
                onClick={() => setMaskPii(!maskPii)}
                title="Toggle PII Masking (GDPR / Privacy Compliance)"
                className={`flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-xs font-mono transition-colors uppercase tracking-wider ${
                  maskPii
                    ? 'border-[#00FF41]/40 bg-[#00FF41]/10 text-[#00FF41]'
                    : 'border-[#1F2937] bg-[#000000] text-[#E5E7EB]/70 hover:text-[#E5E7EB]'
                }`}
              >
                {maskPii ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{maskPii ? 'PII MASKED' : 'PII RAW'}</span>
              </button>

              {/* Ingest Simulator Button */}
              <button
                onClick={() => setIngestModalOpen(true)}
                className="flex items-center gap-1.5 rounded-sm bg-[#00FF41] hover:bg-[#00e63a] text-black font-mono font-bold px-3.5 py-1.5 text-xs uppercase tracking-wider transition-all shadow-[0_0_18px_rgba(0,255,65,0.4)]"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Live Ingest</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Mobile View Switcher */}
        <div className="md:hidden flex flex-wrap items-center justify-center gap-1 bg-[#1F2937]/50 p-1 rounded-sm border border-[#1F2937] font-mono text-xs">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`flex-1 min-w-[70px] py-1.5 rounded-sm text-center font-bold uppercase ${
              activeView === 'dashboard' ? 'bg-[#1F2937] text-[#00FF41] border border-[#00FF41]/40' : 'text-[#E5E7EB]/60'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('analyzer')}
            className={`flex-1 min-w-[70px] py-1.5 rounded-sm text-center font-bold uppercase ${
              activeView === 'analyzer' ? 'bg-[#1F2937] text-[#00FF41] border border-[#00FF41]/40' : 'text-[#E5E7EB]/60'
            }`}
          >
            Workbench
          </button>
          <button
            onClick={() => setActiveView('mitigation')}
            className={`flex-1 min-w-[70px] py-1.5 rounded-sm text-center font-bold uppercase ${
              activeView === 'mitigation' ? 'bg-[#1F2937] text-[#00FF41] border border-[#00FF41]/40' : 'text-[#E5E7EB]/60'
            }`}
          >
            Mitigation
          </button>
          <button
            onClick={() => setActiveView('blockchain')}
            className={`flex-1 min-w-[70px] py-1.5 rounded-sm text-center font-bold uppercase ${
              activeView === 'blockchain' ? 'bg-[#1F2937] text-[#00FF41] border border-[#00FF41]/40' : 'text-[#E5E7EB]/60'
            }`}
          >
            Ledger
          </button>
          <button
            onClick={() => setActiveView('smart_contracts')}
            className={`flex-1 min-w-[70px] py-1.5 rounded-sm text-center font-bold uppercase ${
              activeView === 'smart_contracts' ? 'bg-[#1F2937] text-[#00FF41] border border-[#00FF41]/40' : 'text-[#E5E7EB]/60'
            }`}
          >
            Contracts
          </button>
        </div>

        {/* View Switch */}
        {activeView === 'dashboard' && (
          <DashboardOverview
            incidents={incidents}
            onSelectIncident={handleSelectIncident}
            selectedIncident={currentIncident}
            onSelectGeo={handleSelectGeo}
            blockchainHeight={blocks.length}
          />
        )}

        {activeView === 'analyzer' && (
          <EmailAnalyzer
            incident={currentIncident}
            onQuarantine={handleQuarantine}
            onBlockIp={handleBlockIp}
            onGenerateReport={handleOpenReport}
            maskPii={maskPii}
          />
        )}

        {activeView === 'mitigation' && (
          <MitigationCenter
            incidents={incidents}
            onExecuteAction={handleExecuteMitigationAction}
            onBroadcastIOC={handleBroadcastIOC}
          />
        )}

        {activeView === 'blockchain' && (
          <BlockchainLedgerView
            blocks={blocks}
            nodes={nodes}
            onNavigateToIncident={(caseNum) => {
              const matched = incidents.find((i) => i.caseNumber === caseNum);
              if (matched) {
                setSelectedIncidentId(matched.id);
                setActiveView('analyzer');
              }
            }}
            onMineBlock={handleMineBlock}
          />
        )}

        {activeView === 'smart_contracts' && (
          <SmartContractsView />
        )}
      </main>

      {/* Footer Bar */}
      <footer className="mt-8 border-t border-[#1F2937] bg-[#000000] py-4 text-center text-[10px] font-mono text-[#E5E7EB]/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <div>NODE: SENTINEL-PRIMARY-01 // CONSORTIUM: CTI-POA-NET // BLOCK #{blocks.length - 1}</div>
          <div>CYBERSECURITY BLOCKCHAIN FORENSICS // ISO/IEC 27037 ADMISSIBLE</div>
        </div>
      </footer>

      {/* Forensic Report Modal */}
      {reportModalOpen && (
        <ForensicReportModal
          incident={reportIncident}
          onClose={() => setReportModalOpen(false)}
        />
      )}

      {/* Live Ingest Modal */}
      {ingestModalOpen && (
        <LiveIngestModal
          onClose={() => setIngestModalOpen(false)}
          onIngestSuccess={handleIngestSuccess}
        />
      )}
    </div>
  );
}
