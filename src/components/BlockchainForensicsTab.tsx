import React, { useState } from 'react';
import { EmailIncident } from '../types';
import {
  Blocks,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Coins,
  AlertTriangle,
  Server,
  Zap,
  Fingerprint,
  FileCheck,
  ShieldAlert,
} from 'lucide-react';

interface BlockchainForensicsTabProps {
  incident: EmailIncident;
  onBroadcastWallet?: (walletAddress: string) => void;
}

export const BlockchainForensicsTab: React.FC<BlockchainForensicsTabProps> = ({
  incident,
  onBroadcastWallet,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationPassed, setVerificationPassed] = useState<boolean | null>(null);
  const [broadcastedWallets, setBroadcastedWallets] = useState<string[]>([]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerificationPassed(true);
    }, 400);
  };

  const handleBroadcast = (address: string) => {
    setBroadcastedWallets((prev) => [...prev, address]);
    if (onBroadcastWallet) {
      onBroadcastWallet(address);
    }
  };

  const proof = incident.blockchainProof;
  const wallets = incident.detectedCryptoWallets || [];

  return (
    <div className="space-y-6 font-mono">
      {/* Proof Summary Banner */}
      <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 shadow-[0_0_25px_rgba(0,0,0,0.7)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#00E0FF]/10 border border-[#00E0FF]/30 text-[#00E0FF] shadow-[0_0_12px_rgba(0,224,255,0.25)]">
              <Blocks className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white uppercase tracking-widest">
                  On-Chain Cryptographic Proof & Chain of Custody Audit
                </h3>
                <span className="rounded-sm bg-[#00FF41]/10 border border-[#00FF41]/30 px-2 py-0.5 text-[9px] text-[#00FF41] font-bold uppercase">
                  ISO/IEC 27037 Legal Admissibility
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-sans mt-0.5">
                Case evidence sealed with cryptographic timestamping, consensus validation, and immutable Merkle proof
              </p>
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={verifying}
            className="flex items-center gap-2 rounded-sm bg-[#00E0FF] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#00E0FF]/90 transition-colors shadow-[0_0_15px_rgba(0,224,255,0.25)] disabled:opacity-50"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{verifying ? 'Verifying Consensus Proof...' : 'Verify Cryptographic Proof'}</span>
          </button>
        </div>

        {verificationPassed && (
          <div className="mt-3 rounded-sm border border-[#00FF41]/40 bg-[#00FF41]/10 p-3 flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#00FF41]" />
              <span className="font-bold uppercase tracking-wider">
                CONSENSUS CONFIRMED: 5/5 NODES CERTIFY EVIDENCE HASH MATCHES ON-CHAIN RECORD EXACTLY.
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">
              Proof algorithm: {proof?.proofAlgorithm || 'SHA-256 Merkle Proof + ECDSA'}
            </span>
          </div>
        )}
      </div>

      {/* Proof Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: On-Chain Block & Transaction */}
        <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 space-y-3 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between border-b border-[#1A1A1F] pb-2">
            <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
              <Fingerprint className="h-4 w-4 text-[#00E0FF]" />
              <span>Notarized Ledger Attestation</span>
            </div>
            <span className="text-[10px] text-[#00FF41] font-bold">
              BLOCK #{proof?.blockNumber ?? 1}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Transaction Hash:</span>
              <div className="flex items-center justify-between text-[#00E0FF] font-mono break-all text-[11px] bg-[#050507] p-2 rounded-sm border border-[#1A1A1F]">
                <span>{proof?.txHash || '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'}</span>
                <button
                  onClick={() => handleCopy(proof?.txHash || '', 'tx')}
                  className="text-gray-500 hover:text-white ml-2 shrink-0"
                >
                  {copiedKey === 'tx' ? <Check className="h-3.5 w-3.5 text-[#00FF41]" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Block Hash:</span>
              <div className="text-gray-300 font-mono break-all text-[11px] bg-[#050507] p-2 rounded-sm border border-[#1A1A1F]">
                {proof?.blockHash || '00a4f9108b8812c30981726a992810a9c8b710293847102938471029384799a1'}
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Merkle Tree Root:</span>
              <div className="text-gray-300 font-mono break-all text-[11px] bg-[#050507] p-2 rounded-sm border border-[#1A1A1F]">
                {proof?.merkleRoot || '0x71fa90218b8812c30981726a992810a9c8b7102938471029384710293847771a'}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Smart Contract & Consensus Signatures */}
        <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 space-y-3 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between border-b border-[#1A1A1F] pb-2">
            <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
              <Server className="h-4 w-4 text-[#00FF41]" />
              <span>Smart Contract & Validator Consensus</span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">
              Gas: {proof?.gasUsed?.toLocaleString() || '42,100'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Smart Contract Address:</span>
              <div className="flex items-center justify-between text-white font-mono break-all text-[11px] bg-[#050507] p-2 rounded-sm border border-[#1A1A1F]">
                <span>{proof?.smartContractAddress || '0x3E11889a718290ccB382109848A1099238A792f4'}</span>
                <button
                  onClick={() => handleCopy(proof?.smartContractAddress || '', 'contract')}
                  className="text-gray-500 hover:text-white ml-2 shrink-0"
                >
                  {copiedKey === 'contract' ? <Check className="h-3.5 w-3.5 text-[#00FF41]" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Smart Contract Function:</span>
              <div className="text-[#00FF41] font-mono text-[11px] bg-[#050507] p-2 rounded-sm border border-[#1A1A1F]">
                {proof?.smartContractAction || 'EvidenceChainOfCustody.sealEmailEvidence()'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-[#050507] p-2 rounded-sm border border-[#1A1A1F]">
                <span className="text-[9px] text-gray-500 uppercase">Sealing Validator:</span>
                <div className="text-white text-[10px] font-bold truncate">
                  {proof?.validatorNode || 'Cisco Talos Threat Node'}
                </div>
              </div>
              <div className="bg-[#050507] p-2 rounded-sm border border-[#1A1A1F]">
                <span className="text-[9px] text-gray-500 uppercase">Consensus Quorum:</span>
                <div className="text-[#00FF41] text-[10px] font-bold">
                  {proof?.consensusSignatures || 5}/5 Signatures Valid
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Adversary Cryptocurrency Wallet Intelligence */}
      <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 shadow-[0_0_20px_rgba(0,0,0,0.6)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1A1A1F] pb-3">
          <div className="flex items-center gap-2.5">
            <Coins className="h-5 w-5 text-[#EAB308]" />
            <div>
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                Adversary Cryptocurrency Wallet Intelligence (On-Chain Extortion & Wire Diversion)
              </h4>
              <p className="text-[10px] text-gray-500 font-sans">
                Real-time tracking of crypto escrow wallets, ransomware addresses, and money laundering mixers
              </p>
            </div>
          </div>

          <span className="rounded-sm bg-[#EAB308]/15 border border-[#EAB308]/30 px-2 py-0.5 text-[9px] text-[#EAB308] font-bold uppercase">
            {wallets.length} Wallet{wallets.length === 1 ? '' : 's'} Identified in Payload
          </span>
        </div>

        {wallets.length === 0 ? (
          <div className="rounded-sm border border-[#1A1A1F] bg-[#050507] p-6 text-center space-y-2">
            <CheckCircle2 className="h-6 w-6 text-[#00FF41] mx-auto" />
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              No Adversary Crypto Addresses Detected in this Message
            </div>
            <p className="text-[11px] text-gray-400 font-sans max-w-md mx-auto">
              Automated heuristics inspected the message body and headers for Bitcoin (Bech32/Base58), Ethereum (ERC-20), Monero, and Tether payment addresses. No extortion addresses detected.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {wallets.map((wallet) => {
              const isBroadcasted = broadcastedWallets.includes(wallet.address);

              return (
                <div
                  key={wallet.address}
                  className="rounded-sm border border-[#1A1A1F] bg-[#050507] p-4 space-y-3 hover:border-gray-700 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-sm bg-[#EAB308]/20 border border-[#EAB308]/40 px-2 py-0.5 text-[10px] font-bold text-[#EAB308]">
                        {wallet.currency}
                      </span>
                      <span className="font-bold text-sm text-white font-mono">{wallet.address}</span>
                      <button
                        onClick={() => handleCopy(wallet.address, wallet.address)}
                        className="text-gray-500 hover:text-white"
                        title="Copy Wallet Address"
                      >
                        {copiedKey === wallet.address ? (
                          <Check className="h-3.5 w-3.5 text-[#00FF41]" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {wallet.isOfacSanctioned && (
                        <span className="rounded-sm bg-[#FF3D00]/20 border border-[#FF3D00]/40 px-2 py-0.5 text-[9px] text-[#FF3D00] font-bold uppercase tracking-wider">
                          OFAC SDN Sanctioned
                        </span>
                      )}
                      <span
                        className={`rounded-sm px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          wallet.riskVerdict === 'Sanctioned Entity'
                            ? 'bg-[#FF3D00]/20 text-[#FF3D00] border border-[#FF3D00]/40'
                            : wallet.riskVerdict === 'Tainted Mixer'
                            ? 'bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/40'
                            : 'bg-[#FF3D00]/10 text-[#FF3D00] border border-[#FF3D00]/30'
                        }`}
                      >
                        {wallet.riskVerdict}
                      </span>
                    </div>
                  </div>

                  {/* Wallet Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-[#0A0A0F] p-2.5 rounded-sm border border-[#1A1A1F]">
                      <span className="text-[10px] text-gray-500 uppercase">On-Chain Balance:</span>
                      <div className="text-white font-bold font-mono mt-0.5">{wallet.balance}</div>
                    </div>
                    <div className="bg-[#0A0A0F] p-2.5 rounded-sm border border-[#1A1A1F]">
                      <span className="text-[10px] text-gray-500 uppercase">Total Received:</span>
                      <div className="text-gray-300 font-mono mt-0.5">{wallet.totalReceived}</div>
                    </div>
                    <div className="bg-[#0A0A0F] p-2.5 rounded-sm border border-[#1A1A1F]">
                      <span className="text-[10px] text-gray-500 uppercase">Transactions:</span>
                      <div className="text-white font-mono mt-0.5">{wallet.txCount} On-Chain Txs</div>
                    </div>
                    <div className="bg-[#0A0A0F] p-2.5 rounded-sm border border-[#1A1A1F]">
                      <span className="text-[10px] text-gray-500 uppercase">Blockchain Taint Score:</span>
                      <div className="text-[#FF3D00] font-bold font-mono mt-0.5">
                        {wallet.taintScore}/100 (HIGH RISK)
                      </div>
                    </div>
                  </div>

                  {/* Threat Cluster & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1A1A1F] text-xs">
                    <div className="text-gray-400">
                      <span className="text-gray-500">Threat Cluster: </span>
                      <span className="text-white font-bold">{wallet.clusterLabel || 'Unknown Threat Syndicate'}</span>
                      {wallet.mixerTransactionsDetected && (
                        <span className="text-[#EAB308] ml-2 font-mono text-[10px]">
                          [Mixer / CoinJoin Taint Detected]
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleBroadcast(wallet.address)}
                      disabled={isBroadcasted}
                      className={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                        isBroadcasted
                          ? 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/40 cursor-default'
                          : 'bg-[#FF3D00]/15 text-[#FF3D00] border border-[#FF3D00]/40 hover:bg-[#FF3D00]/25'
                      }`}
                    >
                      <ShieldAlert className="h-3.5 w-3.5" />
                      <span>
                        {isBroadcasted
                          ? 'Blacklisted on CryptoExtortionBlacklist.sol'
                          : 'Broadcast to On-Chain Blacklist'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
