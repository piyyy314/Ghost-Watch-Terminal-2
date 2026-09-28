/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutGrid, 
  SearchCode, 
  Network, 
  Zap, 
  ShieldAlert, 
  KeyRound, 
  Users 
} from 'lucide-react';

import Header from './components/Header';
import OverviewPanel from './components/OverviewPanel';
import CanaryTrapPanel from './components/CanaryTrapPanel';
import OntologyPanel from './components/OntologyPanel';
import CadlPanel from './components/CadlPanel';
import CerberusPanel from './components/CerberusPanel';
import PqcPanel from './components/PqcPanel';
import OmegaContingency from './components/OmegaContingency';

import { Lure, ThreatLog, OntoNode, OntoLink, PqcKeyState, NodeStatus, WatermarkType } from './types';

// Normalized set of status string values representing unresolved or escalating threats
const ACTIVE_THREAT_STATUSES = new Set(['active', 'escalating']);

export default function App() {
  // System State Matrix
  const [systemIntegrity, setSystemIntegrity] = useState(true);
  const [isWiped, setIsWiped] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [pqcKeysRotated, setPqcKeysRotated] = useState(1);

  // Palantir Object Ontology State
  const [nodes, setNodes] = useState<OntoNode[]>([
    { id: 'C2', label: 'C2 Terminal [HB-9982]', type: 'C2', status: 'online', ip: '127.0.0.1', x: 50, y: 15 },
    { id: 'GTW', label: 'LoRa Gateway', type: 'Gateway', status: 'online', ip: '10.10.8.1', x: 50, y: 48 },
    { id: 'AETH', label: 'AETHER Honeypot', type: 'Honeypot', status: 'online', ip: '10.10.99.99', x: 20, y: 78 },
    { id: 'OP04', label: 'Contractor OP-04', type: 'Agent', status: 'online', ip: '10.10.8.22', x: 80, y: 78 },
    { id: 'LAE09', label: 'LAE-09 Administrator', type: 'Agent', status: 'online', ip: '10.10.8.9', x: 50, y: 85 }
  ]);

  const [links, setLinks] = useState<OntoLink[]>([
    { id: 'l1', source: 'C2', target: 'GTW', type: 'LoRa' },
    { id: 'l2', source: 'GTW', target: 'LAE09', type: 'SecureTunnel' },
    { id: 'l3', source: 'GTW', target: 'OP04', type: 'SecureTunnel' },
    { id: 'l4', source: 'GTW', target: 'AETH', type: 'HoneypotReroute' }
  ]);

  // Canary Traps (Barium Meal list)
  const [lures, setLures] = useState<Lure[]>([
    {
      id: 'GW-LURE-2026-F982',
      filename: 'tactical_operational_blueprint_v01.docx',
      targetPersona: 'Contractor OP-04',
      watermarkType: 'linguistic',
      watermarkValue: '0xF982SIG',
      dnsToken: 'audit-vault-312.contractor-op-04.ghost.watch.local',
      createdAt: '18:11:51 UTC',
      accessCount: 0,
      lastSeenIp: null,
      lastSeenGeo: null,
      status: 'active'
    },
    {
      id: 'GW-LURE-2026-A103',
      filename: 'aether_sandbox_credential_map.xlsx',
      targetPersona: 'Rogue Probe Subsystem',
      watermarkType: 'metadata',
      watermarkValue: '0xA103SIG',
      dnsToken: 'audit-vault-771.rogue-probe.ghost.watch.local',
      createdAt: '18:12:04 UTC',
      accessCount: 2,
      lastSeenIp: '194.22.181.12',
      lastSeenGeo: 'Rogue Probe Hub (Saturated Segment B)',
      status: 'triggered'
    }
  ]);

  // Consolidated Threat Logging Stream
  const [threatLogs, setThreatLogs] = useState<ThreatLog[]>([
    {
      id: 'log1',
      timestamp: '18:11:50 UTC',
      sourceIp: '127.0.0.1',
      event: 'Ghost-Watch Apex Terminal initialized with hardware binding verification ID HB-9982-AX-2026',
      severity: 'low',
      lureId: null,
      status: 'mitigated',
      cadlLevel: 1
    },
    {
      id: 'log2',
      timestamp: '18:11:51 UTC',
      sourceIp: '10.10.8.1',
      event: 'Out-of-band LoRa mesh network synchronized on 915.0 MHz',
      severity: 'low',
      lureId: null,
      status: 'mitigated',
      cadlLevel: 1
    },
    {
      id: 'log3',
      timestamp: '18:11:52 UTC',
      sourceIp: '127.0.0.1',
      event: 'PQC Suite instantiated: KEM algorithm ML-KEM-768, signature algorithm ML-DSA-65 active',
      severity: 'medium',
      lureId: null,
      status: 'mitigated',
      cadlLevel: 1
    }
  ]);

  // Post Quantum Cryptographic Key Repository
  const [pqcKeyState, setPqcKeyState] = useState<PqcKeyState>({
    kemAlgorithm: 'ML-KEM-768 (FIPS 203)',
    dsaAlgorithm: 'ML-DSA-65 (FIPS 204)',
    slhAlgorithm: 'SLH-DSA-256 (FIPS 205)',
    lastRotated: '18:11:50 UTC',
    publicKeyFingerprint: '0x9E7F6B8A2C11D4E3A0C94F99827B13',
    privateKeyFingerprint: '0x7B13E420C9114D3E0A7F6B8A2C99FC',
    sessionCount: 12
  });

  // Calculate active threat count, consistently handling status string values ('active', 'escalating', case-insensitively with trim)
  const activeThreatCount = useMemo(() => {
    return threatLogs.filter((log) => {
      if (!log || typeof log.status !== 'string') return false;
      const normalizedStatus = log.status.trim().toLowerCase();
      return ACTIVE_THREAT_STATUSES.has(normalizedStatus);
    }).length;
  }, [threatLogs]);

  // Add Log helper with explicit support for 'active', 'escalating', or 'mitigated'
  const handleAddLog = (
    event: string, 
    severity: 'low' | 'medium' | 'high' | 'critical',
    statusOverride?: 'active' | 'mitigated' | 'escalating'
  ) => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(11, 19) + ' UTC';
    const resolvedStatus: 'active' | 'mitigated' | 'escalating' = statusOverride ?? (
      severity === 'critical' ? 'escalating' : severity === 'high' ? 'active' : 'mitigated'
    );
    const newLog: ThreatLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp,
      sourceIp: '10.10.8.22', // Mock Source IP
      event,
      severity,
      lureId: null,
      status: resolvedStatus,
      cadlLevel: severity === 'critical' ? 5 : severity === 'high' ? 3 : 1
    };
    setThreatLogs(prev => [newLog, ...prev]);
  };

  // Threat resolution helpers to mitigate active/escalating incidents
  const handleMitigateThreat = (threatId: string) => {
    setThreatLogs(prev => prev.map(log => {
      if (log.id === threatId) {
        return { ...log, status: 'mitigated' as const };
      }
      return log;
    }));
  };

  const handleMitigateAllThreats = () => {
    setThreatLogs(prev => prev.map(log => {
      const norm = log.status?.trim().toLowerCase();
      if (norm === 'active' || norm === 'escalating') {
        return { ...log, status: 'mitigated' as const };
      }
      return log;
    }));
    handleAddLog('Aegis Mitigation Engine: All active and escalating threat vectors marked mitigated.', 'low', 'mitigated');
  };

  // Canary Trap deployment
  const handleCreateLure = (target: string, type: WatermarkType) => {
    const watermarkId = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
    const lureId = `GW-LURE-2026-${watermarkId}`;
    const fileNumber = lures.length + 1;
    
    const newLure: Lure = {
      id: lureId,
      filename: `tactical_operational_blueprint_v0${fileNumber}.docx`,
      targetPersona: target,
      watermarkType: type,
      watermarkValue: `0x${watermarkId}SIG`,
      dnsToken: `audit-vault-${Math.floor(100 + Math.random() * 900)}.${target.toLowerCase().replace(/\s+/g, '-')}.ghost.watch.local`,
      createdAt: new Date().toISOString().slice(11, 19) + ' UTC',
      accessCount: 0,
      lastSeenIp: null,
      lastSeenGeo: null,
      status: 'active'
    };

    setLures(prev => [newLure, ...prev]);
    handleAddLog(`Identifier Injection Engine: Deployed watermarked document ${newLure.filename} to target ${target}`, 'medium');
  };

  // Simulate adversary clicks a decoy canary trap
  const handleSimulateLureClick = (lureId: string) => {
    const updatedLures = lures.map(lure => {
      if (lure.id === lureId) {
        return {
          ...lure,
          accessCount: lure.accessCount + 1,
          lastSeenIp: '194.22.181.12',
          lastSeenGeo: 'Rogue Probe Hub (Saturated Segment B)',
          status: 'triggered' as const
        };
      }
      return lure;
    });

    setLures(updatedLures);
    const clickedLure = lures.find(l => l.id === lureId);
    
    if (clickedLure) {
      // Trigger a direct threat event and update contractor node to compromised on Palantir Graph!
      setNodes(prevNodes => prevNodes.map(node => {
        if (node.id === 'OP04') {
          return { ...node, status: 'compromised' };
        }
        return node;
      }));

      // Set link to OP04 as Suspicious
      setLinks(prevLinks => prevLinks.map(link => {
        if (link.target === 'OP04') {
          return { ...link, type: 'Suspicious' };
        }
        return link;
      }));

      handleAddLog(`Canary Network alert: DNS Resolution beacon tripped on lure token ${clickedLure.dnsToken}! Exfiltration attempt confirmed!`, 'high');
      
      // Pivot to CADL tab automatically so the user observes the active defense
      setActiveTab('cadl');
    }
  };

  // Triggered when manual target seed is deployed in Cerberus tab
  const handleDeployTargetedLure = (targetName: string) => {
    handleCreateLure(targetName, 'linguistic');
    setActiveTab('acts');
  };

  // Palantir Link and Node management
  const handleUpdateNodeStatus = (nodeId: string, status: NodeStatus) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status } : n));
  };

  const handleAddLink = (source: string, target: string, type: 'LoRa' | 'SecureTunnel' | 'Suspicious' | 'HoneypotReroute') => {
    const newLink: OntoLink = {
      id: `l-${Date.now()}`,
      source,
      target,
      type
    };
    setLinks(prev => [...prev, newLink]);
  };

  // PQC key rotatons
  const handleRotateKeys = () => {
    setPqcKeysRotated(prev => prev + 1);
    setPqcKeyState(prev => ({
      ...prev,
      lastRotated: new Date().toISOString().replace('T', ' ').slice(11, 19) + ' UTC',
      publicKeyFingerprint: '0x' + Math.floor(Math.random() * 1e16).toString(16).toUpperCase(),
      privateKeyFingerprint: '0x' + Math.floor(Math.random() * 1e16).toString(16).toUpperCase(),
      sessionCount: prev.sessionCount + 1
    }));
  };

  // Simulate general intrusion probe
  const handleSimulateIntrusion = () => {
    setNodes(prevNodes => prevNodes.map(node => {
      if (node.id === 'OP04') {
        return { ...node, status: 'compromised' };
      }
      return node;
    }));
  };

  // Omega contingency trigger
  const handleTriggerWipe = () => {
    setIsWiped(true);
    setSystemIntegrity(false);
    handleAddLog('OMEGA CONTINGENCY TRIGGERED: Wiping core registers and isolating digital sovereignty...', 'critical', 'escalating');
  };

  const handleRestoreSystem = () => {
    setIsWiped(false);
    setSystemIntegrity(true);
    handleAddLog('Sovereign Restore: Restored Ghost cryptographic identity successfully from Cryo-Vault backups.', 'low', 'mitigated');
    
    // Transition any unresolved active or escalating threats to mitigated state
    setThreatLogs(prev => prev.map(log => {
      const norm = log.status?.trim().toLowerCase();
      if (norm === 'active' || norm === 'escalating') {
        return { ...log, status: 'mitigated' as const };
      }
      return log;
    }));

    // Reset compromises
    setNodes(prev => prev.map(n => ({ ...n, status: 'online' })));
    setLinks(prev => prev.map(l => l.type === 'Suspicious' ? { ...l, type: 'SecureTunnel' } : l));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-emerald-900/50 selection:text-emerald-300">
      
      {/* Background neon grids and subtle visual elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-950/5 to-transparent pointer-events-none" />

      {/* Terminal Header */}
      <Header 
        systemIntegrity={systemIntegrity} 
        activeThreats={activeThreatCount}
        pqcKeysRotated={pqcKeysRotated}
        onTriggerWipe={handleTriggerWipe}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">

        {/* Tab Navigation Menu */}
        <div className="flex flex-wrap items-center gap-2 border-b border-emerald-950/40 pb-4 font-mono text-xs">
          {[
            { id: 'overview', name: 'OVERVIEW BMC', icon: <LayoutGrid className="h-4 w-4" /> },
            { id: 'acts', name: 'CANARY TRAPS (ACTS)', icon: <SearchCode className="h-4 w-4" /> },
            { id: 'ontology', name: 'ONTOLOGY GRAPH', icon: <Network className="h-4 w-4" /> },
            { id: 'cadl', name: 'DECEPTION LEVEL (CADL)', icon: <Zap className="h-4 w-4" /> },
            { id: 'cerberus', name: 'INSIDER SCANNER', icon: <Users className="h-4 w-4" /> },
            { id: 'pqc', name: 'PQC CIPHERS', icon: <KeyRound className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2.5 px-4 rounded border transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold shadow-md shadow-emerald-950/30'
                  : 'bg-slate-900/70 hover:bg-slate-850 border-slate-850 hover:border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tactical Alerts Banner */}
        {activeThreatCount > 0 && (
          <div className="flex items-center justify-between gap-4 p-4 border border-red-900/50 bg-red-950/15 rounded-lg font-mono text-xs text-red-400 animate-pulse">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              <span>
                <span className="font-bold uppercase">ALARM:</span> ACTIVE LATERAL EXFILTRATION DETECTED ({activeThreatCount} ACTIVE / ESCALATING). CADL IS MANIPULATING TRAFFIC STREAMS.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleMitigateAllThreats}
                className="px-2.5 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 rounded font-bold transition-all uppercase text-[10px]"
                title="Mark all active and escalating threat events as mitigated"
              >
                Mitigate Threats
              </button>
              <button 
                onClick={() => setActiveTab('cadl')}
                className="px-2.5 py-1.5 bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 rounded font-bold transition-all uppercase text-[10px]"
              >
                Interdiction Hub
              </button>
            </div>
          </div>
        )}

        {/* Active Tab Screen */}
        <div className="transition-all duration-150">
          {activeTab === 'overview' && (
            <OverviewPanel 
              nodes={nodes} 
              threatLogs={threatLogs} 
              onAddLog={handleAddLog}
              activeThreatCount={activeThreatCount}
              onMitigateThreat={handleMitigateThreat}
              onMitigateAllThreats={handleMitigateAllThreats}
            />
          )}

          {activeTab === 'acts' && (
            <CanaryTrapPanel 
              lures={lures} 
              onCreateLure={handleCreateLure} 
              onSimulateLureClick={handleSimulateLureClick} 
            />
          )}

          {activeTab === 'ontology' && (
            <OntologyPanel 
              nodes={nodes} 
              links={links} 
              onUpdateNodeStatus={handleUpdateNodeStatus}
              onAddLink={handleAddLink}
              onAddLog={handleAddLog}
            />
          )}

          {activeTab === 'cadl' && (
            <CadlPanel 
              onAddLog={handleAddLog} 
              onSimulateIntrusion={handleSimulateIntrusion}
              activeThreatCount={activeThreatCount}
              onTriggerWipe={handleTriggerWipe}
            />
          )}

          {activeTab === 'cerberus' && (
            <CerberusPanel 
              onAddLog={handleAddLog} 
              onDeployTargetedLure={handleDeployTargetedLure} 
            />
          )}

          {activeTab === 'pqc' && (
            <PqcPanel 
              keyState={pqcKeyState} 
              onRotateKeys={handleRotateKeys} 
              onAddLog={handleAddLog} 
            />
          )}
        </div>

      </main>

      {/* Omega Contingency Lockdown Portal */}
      <OmegaContingency 
        isWiped={isWiped} 
        onRestoreSystem={handleRestoreSystem} 
      />

    </div>
  );
}
