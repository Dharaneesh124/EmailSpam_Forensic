export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low' | 'benign';

export type ClassificationType = 
  | 'Legitimate'
  | 'Suspicious'
  | 'Impersonation'
  | 'Phishing'
  | 'BEC_Fraud'
  | 'Malware_Delivery';

export type IncidentStatus = 'quarantined' | 'investigating' | 'blocked' | 'released' | 'resolved';

export interface GeoLocation {
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  isp: string;
  asn: string;
  org: string;
  isTor: boolean;
  isVpn: boolean;
  isProxy: boolean;
  isCloudHosting: boolean;
  threatScore: number; // 0 - 100
}

export interface RelayHop {
  hopNumber: number;
  fromHost: string;
  fromIP: string;
  byHost: string;
  protocol: string;
  timestamp: string;
  delayMs: number;
  isOriginating: boolean;
  isAnomalous: boolean;
  anomalyNote?: string;
  geo?: GeoLocation;
}

export interface SPFValidation {
  status: 'pass' | 'fail' | 'softfail' | 'neutral' | 'none';
  domain: string;
  clientIp: string;
  record: string;
  aligned: boolean;
  explanation: string;
}

export interface DKIMValidation {
  status: 'pass' | 'fail' | 'none';
  domain: string;
  selector: string;
  signatureHeaderValid: boolean;
  bodyHashValid: boolean;
  aligned: boolean;
  explanation: string;
}

export interface DMARCValidation {
  status: 'pass' | 'fail' | 'none';
  policy: 'reject' | 'quarantine' | 'none';
  alignment: 'aligned' | 'unaligned';
  disposition: 'quarantine' | 'reject' | 'pass';
  explanation: string;
}

export interface ProtocolForensics {
  spf: SPFValidation;
  dkim: DKIMValidation;
  dmarc: DMARCValidation;
  returnPathMatch: boolean;
  returnPath: string;
  fromHeader: string;
  replyToHeader: string;
  replyToMismatch: boolean;
  messageIdAnomaly: boolean;
  messageId: string;
  tlsVersion: string;
  cipherSuite: string;
  forgedSenderSuspected: boolean;
}

export interface DomainIntelligence {
  domain: string;
  registrar: string;
  creationDate: string;
  ageDays: number;
  expiryDate: string;
  nameServers: string[];
  mxRecords: string[];
  threatReputationScore: number; // 0-100 (high = malicious)
  isLookalike: boolean;
  lookalikeTarget?: string;
  punycode: boolean;
  knownMaliciousHistory: boolean;
}

export interface ExtractedUrl {
  originalUrl: string;
  domain: string;
  resolvedIp?: string;
  isObfuscated: boolean;
  isShortened: boolean;
  threatCategory?: string;
  safetyScore: number; // 0-100
  suspiciousQueryParam?: string;
}

export interface ExtractedAttachment {
  filename: string;
  filesize: string;
  filetype: string;
  sha256: string;
  isMacroEnabled: boolean;
  isDoubleExtension: boolean;
  verdict: 'safe' | 'suspicious' | 'malicious';
}

export interface SocialEngineeringAnalysis {
  urgencyScore: number; // 0 - 100
  authorityImpersonationScore: number; // 0 - 100
  financialCoercionScore: number; // 0 - 100
  fearPressureScore: number; // 0 - 100
  detectedCues: string[];
  executiveImpersonated?: string;
  paymentDiversionDetails?: {
    requestedAmount?: string;
    bankName?: string;
    accountReference?: string;
  };
}

export interface AttributionInsight {
  category: 'Compromised Account' | 'Spoofed Domain' | 'Anonymized Infrastructure' | 'Direct Malicious Actor';
  confidenceScore: number; // 0 - 100
  probableActorOrSyndicate: string;
  campaignCluster: string;
  reasoning: string;
  mitreAttackTechniques: string[];
  actorOriginEstimate: string;
}

export interface ChainOfCustodyItem {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  verificationHash: string;
}

export interface EmailIncident {
  id: string;
  caseNumber: string;
  subject: string;
  senderDisplay: string;
  senderAddress: string;
  recipientAddress: string;
  receivedAt: string;
  threatSeverity: ThreatSeverity;
  fraudScore: number; // 0 - 100
  classification: ClassificationType;
  status: IncidentStatus;
  
  // Content & Hashes
  bodyText: string;
  bodyHtml?: string;
  rawHeaders: string;
  rawMime?: string;
  sha256: string;
  sha1: string;
  md5: string;

  // Forensic Deep-Dive
  protocols: ProtocolForensics;
  relayHops: RelayHop[];
  originatingGeo: GeoLocation;
  domainIntel: DomainIntelligence;
  urls: ExtractedUrl[];
  attachments: ExtractedAttachment[];
  nlpAnalysis: SocialEngineeringAnalysis;
  attribution: AttributionInsight;
  
  // Audit & Chain of Custody
  chainOfCustody: ChainOfCustodyItem[];
  mitigationHistory: {
    id: string;
    type: string;
    target: string;
    executedAt: string;
    user: string;
    status: 'active' | 'reverted';
    txHash?: string;
    smartContractEmitted?: string;
    smartContractEvent?: string;
  }[];

  // Blockchain Threat Ledger & Cryptographic Proof
  blockchainProof?: {
    blockNumber: number;
    blockHash: string;
    txHash: string;
    merkleRoot: string;
    timestamp: string;
    validatorNode: string;
    consensusSignatures: number;
    isVerifiedOnChain?: boolean;
    isImmutable?: boolean;
    smartContractAddress: string;
    smartContractAction: string;
    gasUsed?: number;
    proofAlgorithm?: string;
  };
  detectedCryptoWallets?: AdversaryCryptoWallet[];
}

export interface AdversaryCryptoWallet {
  address: string;
  currency: 'BTC' | 'ETH' | 'USDT' | 'XMR';
  balance: string;
  totalReceived: string;
  txCount: number;
  taintScore: number; // 0 - 100
  isOfacSanctioned: boolean;
  mixerTransactionsDetected: boolean;
  firstSeen: string;
  lastActive: string;
  riskVerdict: 'High Risk Extortion' | 'Sanctioned Entity' | 'Tainted Mixer' | 'Under Investigation';
  clusterLabel?: string;
}

export type BlockchainTxType =
  | 'EVIDENCE_SEAL'
  | 'IOC_BROADCAST'
  | 'SMART_CONTRACT_DEFENSE'
  | 'ADVERSARY_WALLET_BLACKLIST'
  | 'VALIDATOR_CONSENSUS';

export interface BlockchainTransaction {
  txHash: string;
  type: BlockchainTxType;
  timestamp: string;
  originNode: string;
  incidentId?: string;
  caseNumber?: string;
  gasUsed: number;
  status: 'CONFIRMED' | 'EXECUTED';
  signature: string;
  payload: {
    evidenceHash?: string;
    identifierHash?: string;
    iocType?: 'IP' | 'DOMAIN' | 'EMAIL_HASH' | 'CRYPTO_WALLET';
    iocValue?: string;
    contractAddress?: string;
    methodCalled?: string;
    details: string;
    confidenceScore?: number;
    [key: string]: any;
  };
}

export interface CyberBlock {
  index: number;
  blockHash: string;
  previousHash: string;
  merkleRoot: string;
  timestamp: string;
  nonce: number;
  difficulty: number;
  validator: string;
  consensusAlgorithm: string;
  transactions: BlockchainTransaction[];
  status: 'valid' | 'tampered' | 'pending';
  tamperNote?: string;
}

export interface SmartContractDefense {
  id: string;
  address: string;
  name: string;
  version: string;
  description: string;
  category: 'Threat Intelligence' | 'Chain of Custody' | 'Automated SOAR' | 'Crypto Blacklist';
  functions: {
    name: string;
    params: string[];
    accessLevel: 'Consortium Only' | 'Public' | 'Autonomous Oracles';
    description: string;
  }[];
  totalInvocations: number;
  lastExecuted: string;
  eventsEmitted: {
    eventName: string;
    timestamp: string;
    txHash: string;
    params: Record<string, any>;
  }[];
}

export interface ConsortiumNode {
  id: string;
  name: string;
  organization: string;
  role: 'Core Validator' | 'SOC Enterprise Node' | 'CERT Authority' | 'Cloud Gateway';
  status: 'active' | 'syncing' | 'offline';
  reputationScore: number;
  ip: string;
  blocksValidated: number;
  publicKey: string;
  latencyMs: number;
}

export interface ThreatOverviewStats {
  totalAnalyzed: number;
  criticalBlocked: number;
  becAttempts: number;
  credentialHarvesting: number;
  averageFraudScore: number;
  activeCampaignsCount: number;
  gatewayUptime: string;
  // Blockchain Metrics
  blockchainHeight: number;
  activeConsortiumNodes: number;
  totalOnChainIOCs: number;
  smartContractDefenseInvocations: number;
  verifiedChainIntegrity: boolean;
}
