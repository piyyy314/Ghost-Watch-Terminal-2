/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type WatermarkType = 'linguistic' | 'metadata' | 'steganographic';

export interface Lure {
  id: string;
  filename: string;
  targetPersona: string;
  watermarkType: WatermarkType;
  watermarkValue: string;
  dnsToken: string;
  createdAt: string;
  accessCount: number;
  lastSeenIp: string | null;
  lastSeenGeo: string | null;
  status: 'active' | 'triggered' | 'revoked';
}

export interface ThreatLog {
  id: string;
  timestamp: string;
  sourceIp: string;
  event: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  lureId: string | null;
  status: 'active' | 'mitigated' | 'escalating';
  cadlLevel: number; // 1-5
}

export type NodeType = 'C2' | 'Gateway' | 'Agent' | 'Honeypot' | 'External';
export type NodeStatus = 'online' | 'offline' | 'compromised' | 'quarantined';

export interface OntoNode {
  id: string;
  label: string;
  type: NodeType;
  status: NodeStatus;
  ip: string;
  x: number;
  y: number;
}

export interface OntoLink {
  id: string;
  source: string;
  target: string;
  type: 'LoRa' | 'SecureTunnel' | 'Suspicious' | 'HoneypotReroute';
}

export interface PqcKeyState {
  kemAlgorithm: string; // ML-KEM-768
  dsaAlgorithm: string; // ML-DSA-65
  slhAlgorithm: string; // SLH-DSA-256
  lastRotated: string;
  publicKeyFingerprint: string;
  privateKeyFingerprint: string;
  sessionCount: number;
}
