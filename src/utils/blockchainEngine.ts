import {
  CyberBlock,
  BlockchainTransaction,
  ConsortiumNode,
  SmartContractDefense,
  AdversaryCryptoWallet,
} from '../types';

// Synchronous SHA-256 implementation for deterministic, instant blockchain hashing
export function sha256Sync(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  let i = 0;
  for (; i < ascii.length; i++) {
    const code = ascii.charCodeAt(i);
    words[i >> 2] |= (code & 0xff) << ((3 - (i % 4)) * 8);
  }

  words[asciiBitLength >> 5] |= 0x80 << (24 - (asciiBitLength % 32));
  words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

  for (let j = 0; j < words.length; j += 16) {
    const w = words.slice(j, j + 16);
    let a = hash[0], b = hash[1], c = hash[2], d = hash[3];
    let e = hash[4], f = hash[5], g = hash[6], h = hash[7];

    for (let kIndex = 0; kIndex < 64; kIndex++) {
      if (kIndex >= 16) {
        const gamma0 = rightRotate(w[kIndex - 15], 7) ^ rightRotate(w[kIndex - 15], 18) ^ (w[kIndex - 15] >>> 3);
        const gamma1 = rightRotate(w[kIndex - 2], 17) ^ rightRotate(w[kIndex - 2], 19) ^ (w[kIndex - 2] >>> 10);
        w[kIndex] = ((w[kIndex - 16] + gamma0 + w[kIndex - 7] + gamma1) & 0xffffffff);
      }

      const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + s1 + ch + k[kIndex] + (w[kIndex] || 0)) & 0xffffffff;
      const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (s0 + maj) & 0xffffffff;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) & 0xffffffff;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) & 0xffffffff;
    }

    hash[0] = (hash[0] + a) & 0xffffffff;
    hash[1] = (hash[1] + b) & 0xffffffff;
    hash[2] = (hash[2] + c) & 0xffffffff;
    hash[3] = (hash[3] + d) & 0xffffffff;
    hash[4] = (hash[4] + e) & 0xffffffff;
    hash[5] = (hash[5] + f) & 0xffffffff;
    hash[6] = (hash[6] + g) & 0xffffffff;
    hash[7] = (hash[7] + h) & 0xffffffff;
  }

  for (let idx = 0; idx < 8; idx++) {
    result += (hash[idx] >>> 0).toString(16).padStart(8, '0');
  }

  return result;
}

// Compute Merkle Root for an array of transaction hashes or strings
export function computeMerkleRoot(hashes: string[]): string {
  if (hashes.length === 0) {
    return sha256Sync('EMPTY_BLOCK_MERKLE_TREE');
  }
  if (hashes.length === 1) {
    return hashes[0];
  }

  let currentLevel = [...hashes];

  while (currentLevel.length > 1) {
    const nextLevel: string[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : currentLevel[i];
      nextLevel.push(sha256Sync(left + right));
    }
    currentLevel = nextLevel;
  }

  return currentLevel[0];
}

// Calculate block hash from its header fields
export function calculateBlockHash(
  index: number,
  previousHash: string,
  merkleRoot: string,
  timestamp: string,
  nonce: number,
  validator: string
): string {
  const header = `${index}:${previousHash}:${merkleRoot}:${timestamp}:${nonce}:${validator}`;
  return sha256Sync(header);
}

// Verify entire blockchain integrity (recursively checks block hashes & previousHash pointers)
export function verifyBlockchainIntegrity(blocks: CyberBlock[]): {
  isValid: boolean;
  brokenBlockIndex?: number;
  reason?: string;
} {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    // Verify Merkle Root
    const txHashes = block.transactions.map((tx) => tx.txHash);
    const expectedMerkleRoot = computeMerkleRoot(txHashes);
    if (block.merkleRoot !== expectedMerkleRoot) {
      return {
        isValid: false,
        brokenBlockIndex: i,
        reason: `Merkle root mismatch at Block #${block.index}. Expected ${expectedMerkleRoot}, got ${block.merkleRoot}.`,
      };
    }

    // Verify Block Hash
    const expectedBlockHash = calculateBlockHash(
      block.index,
      block.previousHash,
      block.merkleRoot,
      block.timestamp,
      block.nonce,
      block.validator
    );

    if (block.blockHash !== expectedBlockHash) {
      return {
        isValid: false,
        brokenBlockIndex: i,
        reason: `Block hash mismatch at Block #${block.index}. Tampering detected! Hash: ${block.blockHash}, Expected: ${expectedBlockHash}`,
      };
    }

    // Verify Genesis Block
    if (i === 0) {
      if (block.previousHash !== '0'.repeat(64)) {
        return {
          isValid: false,
          brokenBlockIndex: 0,
          reason: 'Genesis block previousHash must be 64 zeros.',
        };
      }
    } else {
      // Verify Link to Previous Block
      const prevBlock = blocks[i - 1];
      if (block.previousHash !== prevBlock.blockHash) {
        return {
          isValid: false,
          brokenBlockIndex: i,
          reason: `Block #${block.index} previousHash (${block.previousHash.slice(0, 10)}...) does not link to Block #${prevBlock.index} hash (${prevBlock.blockHash.slice(0, 10)}...). Broken Chain!`,
        };
      }
    }
  }

  return { isValid: true };
}

// Mint / Mine a new Cyber Block with Proof-of-Authority consensus
export function mintCyberBlock(
  previousBlock: CyberBlock,
  transactions: BlockchainTransaction[],
  validator: string = 'Enterprise-Gateway-Node-01'
): CyberBlock {
  const index = previousBlock.index + 1;
  const timestamp = new Date().toISOString();
  const txHashes = transactions.map((t) => t.txHash);
  const merkleRoot = computeMerkleRoot(txHashes);

  let nonce = 0;
  let blockHash = '';
  // Proof of Authority with cryptographic work factor (difficulty 2)
  while (true) {
    blockHash = calculateBlockHash(index, previousBlock.blockHash, merkleRoot, timestamp, nonce, validator);
    if (blockHash.startsWith('00') || nonce > 2000) {
      break;
    }
    nonce++;
  }

  return {
    index,
    blockHash,
    previousHash: previousBlock.blockHash,
    merkleRoot,
    timestamp,
    nonce,
    difficulty: 2,
    validator,
    consensusAlgorithm: 'Proof-of-Authority (PoA / PBFT Consensus)',
    transactions,
    status: 'valid',
  };
}

// Federated Consortium Nodes
export const INITIAL_CONSORTIUM_NODES: ConsortiumNode[] = [
  {
    id: 'node-us-cert',
    name: 'US-CISA / CERT Trust Node',
    organization: 'Cybersecurity & Infrastructure Security Agency',
    role: 'CERT Authority',
    status: 'active',
    reputationScore: 99.8,
    ip: '198.51.100.24',
    blocksValidated: 14208,
    publicKey: '0x04b8a21f89c091e4f...991a',
    latencyMs: 14,
  },
  {
    id: 'node-corp-gateway',
    name: 'Enterprise Primary Gateway Node',
    organization: 'Acme Global Defense Perimeter',
    role: 'Cloud Gateway',
    status: 'active',
    reputationScore: 99.4,
    ip: '10.0.1.5',
    blocksValidated: 9812,
    publicKey: '0x03c901e1498b8812a...77e2',
    latencyMs: 4,
  },
  {
    id: 'node-cisco-talos',
    name: 'Cisco Talos Threat Intelligence Node',
    organization: 'Talos Global Threat Research',
    role: 'Core Validator',
    status: 'active',
    reputationScore: 99.6,
    ip: '64.104.123.88',
    blocksValidated: 12450,
    publicKey: '0x0277fbc0192a8123c...33b1',
    latencyMs: 18,
  },
  {
    id: 'node-cloudflare-edge',
    name: 'Cloudflare Zero Trust Edge Node',
    organization: 'Cloudflare SOC Operations',
    role: 'SOC Enterprise Node',
    status: 'active',
    reputationScore: 99.1,
    ip: '104.16.12.9',
    blocksValidated: 8740,
    publicKey: '0x04192837bcda11009...8820',
    latencyMs: 8,
  },
  {
    id: 'node-m365-defender',
    name: 'Microsoft M365 Defender Node',
    organization: 'Microsoft Threat Protection Alliance',
    role: 'Core Validator',
    status: 'active',
    reputationScore: 99.5,
    ip: '52.183.99.14',
    blocksValidated: 11200,
    publicKey: '0x03aa882019ff8843c...55d9',
    latencyMs: 11,
  },
];

// Smart Contracts for Autonomous Cyber Defense
export const INITIAL_SMART_CONTRACTS: SmartContractDefense[] = [
  {
    id: 'contract-threat-registry',
    address: '0x8F920b72c9182309A48F9E10823901bC4140a12e',
    name: 'ThreatIntelligenceRegistry.sol',
    version: 'v3.2.0',
    category: 'Threat Intelligence',
    description: 'Decentralized peer-verified registry for phishing domain IOCs, malicious CIDR ranges, and forged sender hashes.',
    functions: [
      {
        name: 'broadcastMaliciousIOC',
        params: ['bytes32 iocHash', 'uint8 iocType', 'uint16 threatScore', 'string metadata'],
        accessLevel: 'Consortium Only',
        description: 'Broadcasts a newly confirmed email threat IOC across all federated gateway nodes.',
      },
      {
        name: 'queryIOCReputation',
        params: ['bytes32 iocHash'],
        accessLevel: 'Public',
        description: 'Instant zero-gas query returning consensus reputation and threat flags for any IP, domain, or hash.',
      },
    ],
    totalInvocations: 4819,
    lastExecuted: '2026-09-05T10:48:12Z',
    eventsEmitted: [
      {
        eventName: 'IOCBlacklisted',
        timestamp: '2026-09-05T10:48:12Z',
        txHash: '0x4f82a9108b8812c3...99a1',
        params: { ioc: 'acme-enterprises.corp-settlement.com', type: 'LOOKALIKE_DOMAIN', score: 99 },
      },
      {
        eventName: 'IOCBlacklisted',
        timestamp: '2026-09-05T10:44:20Z',
        txHash: '0x3c90e118928019ab...882e',
        params: { ioc: '194.26.29.118', type: 'BULLETPROOF_HOST_IP', score: 95 },
      },
    ],
  },
  {
    id: 'contract-evidence-custody',
    address: '0x3E11889a718290ccB382109848A1099238A792f4',
    name: 'EvidenceChainOfCustody.sol',
    version: 'v2.8.0',
    category: 'Chain of Custody',
    description: 'ISO/IEC 27037 and NIST SP 800-86 legally admissible on-chain evidence notarization and digital integrity lock.',
    functions: [
      {
        name: 'sealEmailEvidence',
        params: ['bytes32 rawMimeHash', 'bytes32 headerHash', 'string caseId', 'uint256 timestamp'],
        accessLevel: 'Consortium Only',
        description: 'Permanently records cryptographic evidence hash on-chain, rendering evidence immutable and tamper-evident.',
      },
      {
        name: 'verifyEvidenceIntegrity',
        params: ['string caseId', 'bytes32 candidateHash'],
        accessLevel: 'Public',
        description: 'Cryptographically certifies whether provided email artifacts match original sealed forensic record.',
      },
    ],
    totalInvocations: 1294,
    lastExecuted: '2026-09-05T10:45:15Z',
    eventsEmitted: [
      {
        eventName: 'EvidenceCryptographicallySealed',
        timestamp: '2026-09-05T10:45:15Z',
        txHash: '0x9f86d081884c7d659...0a08',
        params: { case: 'CASE-BEC-0982', sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08' },
      },
    ],
  },
  {
    id: 'contract-automated-soar',
    address: '0xB704018274091aC1920847119028A7364D51919C',
    name: 'AutomatedSOARTrigger.sol',
    version: 'v4.1.0',
    category: 'Automated SOAR',
    description: 'Decentralized autonomous firewall execution triggering Border Gateway BGP blackholing, DNS sinkholing, and AD credential purge.',
    functions: [
      {
        name: 'triggerEmergencyConsortiumQuarantine',
        params: ['string recipientMailbox', 'string senderAddress', 'uint16 severity'],
        accessLevel: 'Autonomous Oracles',
        description: 'Emits high-priority event triggering immediate perimeter mail gateway quarantine across all member networks.',
      },
      {
        name: 'nullRoutePerimeterIP',
        params: ['bytes4 ipAddress', 'uint32 durationSeconds'],
        accessLevel: 'Consortium Only',
        description: 'Instructs border firewalls to null-route the attacker originating IP at the routing table level.',
      },
    ],
    totalInvocations: 3120,
    lastExecuted: '2026-09-05T10:45:30Z',
    eventsEmitted: [
      {
        eventName: 'QuarantineEnforced',
        timestamp: '2026-09-05T10:45:30Z',
        txHash: '0x884019ab921c...8172',
        params: { target: 'cfo-office@acme-global.com', rule: 'RULE_BEC_HIGH_CONFIDENCE' },
      },
    ],
  },
  {
    id: 'contract-crypto-blacklist',
    address: '0x5A8812c98201bF892019485710293847E20391d1',
    name: 'CryptoExtortionBlacklist.sol',
    version: 'v1.4.0',
    category: 'Crypto Blacklist',
    description: 'Decentralized threat ledger tracking adversary cryptocurrency wallet addresses (BTC, ETH, XMR) associated with BEC wire scams and ransomware.',
    functions: [
      {
        name: 'reportAdversaryWallet',
        params: ['string walletAddress', 'string blockchainType', 'string threatCluster', 'bool isOfacFlagged'],
        accessLevel: 'Consortium Only',
        description: 'Flags extortion or fraudulent beneficiary wallet address, propagating alerts to exchange compliance APIs.',
      },
    ],
    totalInvocations: 890,
    lastExecuted: '2026-09-05T10:12:00Z',
    eventsEmitted: [
      {
        eventName: 'AdversaryWalletReported',
        timestamp: '2026-09-05T10:12:00Z',
        txHash: '0x229108bca9102...8841',
        params: { wallet: 'bc1q9d842x9p8kmk...q84j', chain: 'BITCOIN', threat: 'Scattered Spider Extortion' },
      },
    ],
  },
];

// Initial Genesis and Historical Blocks
export function getInitialCyberBlockchain(): CyberBlock[] {
  // Genesis Block #0
  const genesisTxs: BlockchainTransaction[] = [
    {
      txHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      type: 'VALIDATOR_CONSENSUS',
      timestamp: '2026-09-01T00:00:00Z',
      originNode: 'Consortium-Genesis-Coordinator',
      gasUsed: 0,
      status: 'CONFIRMED',
      signature: '0xGenesisConsensusKeySignature99481...',
      payload: {
        details: 'Cybersecurity Threat Intelligence Consortium Blockchain Genesis. Initialized ISO/IEC 27037 smart contracts.',
        contractAddress: '0x8F920b72c9182309A48F9E10823901bC4140a12e',
      },
    },
  ];
  const genesisMerkle = computeMerkleRoot(genesisTxs.map((t) => t.txHash));
  const genesisPrev = '0'.repeat(64);
  const genesisTimestamp = '2026-09-01T00:00:00Z';
  const genesisHash = calculateBlockHash(0, genesisPrev, genesisMerkle, genesisTimestamp, 1024, 'US-CISA-Trust-Root');

  const block0: CyberBlock = {
    index: 0,
    blockHash: genesisHash,
    previousHash: genesisPrev,
    merkleRoot: genesisMerkle,
    timestamp: genesisTimestamp,
    nonce: 1024,
    difficulty: 2,
    validator: 'US-CISA / CERT Trust Node',
    consensusAlgorithm: 'Proof-of-Authority (PoA / PBFT Consensus)',
    transactions: genesisTxs,
    status: 'valid',
  };

  // Block #1: Sealing Case CASE-BEC-0982
  const block1Txs: BlockchainTransaction[] = [
    {
      txHash: '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      type: 'EVIDENCE_SEAL',
      timestamp: '2026-09-04T22:45:15Z',
      originNode: 'Enterprise Primary Gateway Node',
      incidentId: 'inc-2026-8801',
      caseNumber: 'CASE-BEC-0982',
      gasUsed: 42100,
      status: 'CONFIRMED',
      signature: '0x38fa89102c98471...881a',
      payload: {
        evidenceHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        contractAddress: '0x3E11889a718290ccB382109848A1099238A792f4',
        methodCalled: 'sealEmailEvidence',
        details: 'Sealed raw EML stream and forged CEO wire transfer headers into chain of custody.',
        confidenceScore: 97,
      },
    },
    {
      txHash: '0x4f82a9108b8812c30981726a992810a9c8b710293847102938471029384799a1',
      type: 'IOC_BROADCAST',
      timestamp: '2026-09-04T22:45:18Z',
      originNode: 'Enterprise Primary Gateway Node',
      incidentId: 'inc-2026-8801',
      caseNumber: 'CASE-BEC-0982',
      gasUsed: 31500,
      status: 'CONFIRMED',
      signature: '0x9928a7c0019283...771f',
      payload: {
        iocType: 'DOMAIN',
        iocValue: 'acme-enterprises.corp-settlement.com',
        details: 'Lookalike domain registered 2 days prior impersonating executive staff.',
        confidenceScore: 99,
      },
    },
    {
      txHash: '0x884019ab921c8172901827461928374619283746192837461928374619288172',
      type: 'SMART_CONTRACT_DEFENSE',
      timestamp: '2026-09-04T22:45:30Z',
      originNode: 'Cloudflare Zero Trust Edge Node',
      incidentId: 'inc-2026-8801',
      caseNumber: 'CASE-BEC-0982',
      gasUsed: 54200,
      status: 'EXECUTED',
      signature: '0x7162bcda8819...332a',
      payload: {
        contractAddress: '0xB704018274091aC1920847119028A7364D51919C',
        methodCalled: 'triggerEmergencyConsortiumQuarantine',
        details: 'Autonomous SOAR rule triggered global perimeter quarantine & IP null-route 194.26.29.118.',
      },
    },
  ];
  const block1Merkle = computeMerkleRoot(block1Txs.map((t) => t.txHash));
  const block1Timestamp = '2026-09-04T22:46:00Z';
  const block1Hash = calculateBlockHash(1, block0.blockHash, block1Merkle, block1Timestamp, 384, 'Cisco Talos Threat Intelligence Node');

  const block1: CyberBlock = {
    index: 1,
    blockHash: block1Hash,
    previousHash: block0.blockHash,
    merkleRoot: block1Merkle,
    timestamp: block1Timestamp,
    nonce: 384,
    difficulty: 2,
    validator: 'Cisco Talos Threat Intelligence Node',
    consensusAlgorithm: 'Proof-of-Authority (PoA / PBFT Consensus)',
    transactions: block1Txs,
    status: 'valid',
  };

  // Block #2: Sealing Case CASE-HARVEST-0983 (AiTM Microsoft Phishing)
  const block2Txs: BlockchainTransaction[] = [
    {
      txHash: '0x8a12e881023f99aa123b7c891230192388ef112a99182390182390182390881a',
      type: 'EVIDENCE_SEAL',
      timestamp: '2026-09-04T21:12:10Z',
      originNode: 'Enterprise Primary Gateway Node',
      incidentId: 'inc-2026-8802',
      caseNumber: 'CASE-HARVEST-0983',
      gasUsed: 41000,
      status: 'CONFIRMED',
      signature: '0x1928ab7710293...449b',
      payload: {
        evidenceHash: '8a12e881023f99aa123b7c891230192388ef112a',
        contractAddress: '0x3E11889a718290ccB382109848A1099238A792f4',
        methodCalled: 'sealEmailEvidence',
        details: 'Adversary Evilginx session token phishing payload sealed with cryptographic timestamp.',
        confidenceScore: 89,
      },
    },
    {
      txHash: '0x118290abcc9102837461928374619283746192837461928374619283746100bc',
      type: 'IOC_BROADCAST',
      timestamp: '2026-09-04T21:12:15Z',
      originNode: 'Microsoft M365 Defender Node',
      incidentId: 'inc-2026-8802',
      caseNumber: 'CASE-HARVEST-0983',
      gasUsed: 32000,
      status: 'CONFIRMED',
      signature: '0x8827ab1029...771c',
      payload: {
        iocType: 'DOMAIN',
        iocValue: 'login-microsoft-portal.online',
        details: 'AiTM reverse proxy domain harvesting session cookies and bypassing FIDO2/MFA.',
        confidenceScore: 98,
      },
    },
  ];
  const block2Merkle = computeMerkleRoot(block2Txs.map((t) => t.txHash));
  const block2Timestamp = '2026-09-04T21:13:00Z';
  const block2Hash = calculateBlockHash(2, block1.blockHash, block2Merkle, block2Timestamp, 512, 'Microsoft M365 Defender Node');

  const block2: CyberBlock = {
    index: 2,
    blockHash: block2Hash,
    previousHash: block1.blockHash,
    merkleRoot: block2Merkle,
    timestamp: block2Timestamp,
    nonce: 512,
    difficulty: 2,
    validator: 'Microsoft M365 Defender Node',
    consensusAlgorithm: 'Proof-of-Authority (PoA / PBFT Consensus)',
    transactions: block2Txs,
    status: 'valid',
  };

  return [block0, block1, block2];
}

export const INITIAL_CYBER_BLOCKS: CyberBlock[] = getInitialCyberBlockchain();

export function mineNewPoABlock(
  transactions: BlockchainTransaction[],
  previousHash: string,
  validator: string = 'Enterprise Primary Gateway Node'
): CyberBlock {
  const latestBlock = INITIAL_CYBER_BLOCKS[INITIAL_CYBER_BLOCKS.length - 1];
  const index = latestBlock ? latestBlock.index + 1 : 1;
  const timestamp = new Date().toISOString();
  const txHashes = transactions.map((t) => t.txHash);
  const merkleRoot = computeMerkleRoot(txHashes);

  let nonce = 0;
  let blockHash = '';
  while (true) {
    blockHash = calculateBlockHash(index, previousHash, merkleRoot, timestamp, nonce, validator);
    if (blockHash.startsWith('00') || nonce > 2500) {
      break;
    }
    nonce++;
  }

  return {
    index,
    blockHash,
    previousHash,
    merkleRoot,
    timestamp,
    nonce,
    difficulty: 2,
    validator,
    consensusAlgorithm: 'Proof-of-Authority (PoA / PBFT Consensus)',
    transactions,
    status: 'valid',
  };
}

export function createBlockchainTransaction(
  type: any,
  caseNumber: string,
  contractAddress: string,
  identifierHash: string,
  payloadDetails: Record<string, any>,
  smartContract: string = 'EvidenceChainOfCustody.sol',
  methodCalled: string = 'sealEmailEvidence()'
): BlockchainTransaction {
  const timestamp = new Date().toISOString();
  const rawData = `${type}:${caseNumber}:${contractAddress}:${identifierHash}:${timestamp}`;
  const txHash = `0x${sha256Sync(rawData)}`;
  const signature = `0x${sha256Sync(txHash + 'ConsortiumValidatorPrivateKey')}`;

  return {
    txHash,
    type: type as any,
    timestamp,
    originNode: 'Enterprise Primary Gateway Node',
    incidentId: caseNumber,
    caseNumber,
    gasUsed: 42000 + Math.floor(Math.random() * 12000),
    status: 'CONFIRMED',
    signature,
    payload: {
      contractAddress,
      methodCalled,
      identifierHash,
      details: `Cryptographic proof for ${caseNumber} logged to ${smartContract}`,
      ...payloadDetails,
    },
  };
}

// Known Adversary Cryptocurrency Wallets identified across Threat Campaigns
export const SAMPLE_ADVERSARY_WALLETS: AdversaryCryptoWallet[] = [
  {
    address: 'bc1q9d842x9p8kmk281920384710293847192q84j',
    currency: 'BTC',
    balance: '14.82 BTC (~$920,400 USD)',
    totalReceived: '48.91 BTC',
    txCount: 84,
    taintScore: 98,
    isOfacSanctioned: true,
    mixerTransactionsDetected: true,
    firstSeen: '2025-11-14T08:12:00Z',
    lastActive: '2026-09-04T18:30:00Z',
    riskVerdict: 'Sanctioned Entity',
    clusterLabel: 'Scattered Spider / BlackCat Ransomware Consortium',
  },
  {
    address: '0x71C28B823091823901bC4140a12e8810293847F1',
    currency: 'ETH',
    balance: '42.50 ETH (~$148,750 USD)',
    totalReceived: '180.20 ETH',
    txCount: 142,
    taintScore: 92,
    isOfacSanctioned: false,
    mixerTransactionsDetected: true,
    firstSeen: '2026-03-22T14:40:00Z',
    lastActive: '2026-09-05T04:10:00Z',
    riskVerdict: 'Tainted Mixer',
    clusterLabel: 'Tornado Cash Associated Launderer',
  },
  {
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    currency: 'BTC',
    balance: '2.14 BTC (~$132,800 USD)',
    totalReceived: '12.60 BTC',
    txCount: 39,
    taintScore: 88,
    isOfacSanctioned: false,
    mixerTransactionsDetected: false,
    firstSeen: '2026-06-01T09:15:00Z',
    lastActive: '2026-09-04T22:15:00Z',
    riskVerdict: 'High Risk Extortion',
    clusterLabel: 'SilverTerrier BEC Wire & Crypto Escrow',
  },
];
