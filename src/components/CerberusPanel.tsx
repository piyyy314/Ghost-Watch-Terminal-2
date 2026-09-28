/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, EyeOff, ShieldAlert, CheckCircle, Search, RefreshCw, Sparkles } from 'lucide-react';

interface SuspectOperator {
  id: string;
  name: string;
  role: string;
  riskScore: number;
  anomalies: string[];
  lastSeenTime: string;
  status: 'clean' | 'suspicious' | 'monitored';
}

interface CerberusPanelProps {
  onAddLog: (event: string, severity: 'low' | 'medium' | 'high' | 'critical') => void;
  onDeployTargetedLure: (targetName: string) => void;
}

export default function CerberusPanel({ onAddLog, onDeployTargetedLure }: CerberusPanelProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  
  // High-fidelity mock operator database for Cerberus behavioral logs
  const [operators, setOperators] = useState<SuspectOperator[]>([
    {
      id: 'OP-04',
      name: 'P-04 External Contractor',
      role: 'Hardware Firmware Engineer',
      riskScore: 78,
      anomalies: [
        'Attempted hardware dump of HB-9982-AX-2026 security register',
        'Logged in from external sub-net at 03:14 AM (unauthorized operational shift)',
        'Extracted 420MB of cryo-vault recovery seed documentation'
      ],
      lastSeenTime: '10 mins ago',
      status: 'suspicious',
    },
    {
      id: 'OP-09',
      name: 'LAE-09 Administrator',
      role: 'Lead Systems Architect',
      riskScore: 12,
      anomalies: [],
      lastSeenTime: 'Active now',
      status: 'clean',
    },
    {
      id: 'OP-17',
      name: 'NSITA Junior Analyst',
      role: 'Comms Telemetry Overseer',
      riskScore: 45,
      anomalies: [
        'Irregular spectrum frequency modifications on 915.0 MHz',
        'Attempted credential bypass on AETHER sandbox environment'
      ],
      lastSeenTime: '2 hours ago',
      status: 'monitored',
    }
  ]);

  const runCerberusScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    onAddLog('Cerberus BSAU: Initiating total spectrum behavioral scan across active personnel registries...', 'medium');

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setScanProgress(100);
        setIsScanning(false);
        onAddLog('Cerberus BSAU: Scan completed. Identified 1 High-Risk anomaly and 1 Medium-Risk anomaly.', 'high');
        
        // Randomly increase risk of suspect contractor to make it feel real
        setOperators(prevOps => prevOps.map(op => {
          if (op.id === 'OP-04') {
            return { ...op, riskScore: 84, status: 'suspicious' };
          }
          return op;
        }));
      } else {
        setScanProgress(currentProgress);
      }
    }, 150);
  };

  const handleMitigateOperator = (operatorId: string, name: string) => {
    setOperators(prev => prev.map(op => {
      if (op.id === operatorId) {
        return { ...op, riskScore: 5, anomalies: [], status: 'clean' };
      }
      return op;
    }));
    onAddLog(`Cerberus BSAU: Reset risk score and applied key re-authorizations for operator ${name}`, 'low');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-1">
      
      {/* Column 1: Scanner Dashboard (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        <div className="border border-emerald-950/80 bg-slate-950/40 p-5 rounded-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4 border-b border-emerald-950/50 pb-2">
            <h2 className="font-display font-semibold text-sm tracking-wide text-indigo-400 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              CERBERUS CONTROLLERS (BSAU)
            </h2>
            <span className="text-[10px] font-mono text-emerald-400">
              BSAU SECURED
            </span>
          </div>

          <p className="text-xs text-slate-300 font-sans mb-5 leading-relaxed">
            The **Behavioral Study and Analysis Unit (BSAU)** tracks anomalies, lateral shifts, and unauthorized credential bypasses within the active directory cluster.
          </p>

          <div className="bg-slate-950 p-4 rounded border border-indigo-950/40 space-y-4">
            <h3 className="text-xs font-mono text-slate-400">SPECTRUM ANALYSIS COMMANDS</h3>
            
            {isScanning ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-indigo-400 animate-pulse">Scanning registries...</span>
                  <span className="text-slate-300">{scanProgress}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-150"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <span className="text-[9px] text-slate-500 block font-mono">Querying: personnel badge logs, active file operations...</span>
              </div>
            ) : (
              <button
                onClick={runCerberusScan}
                className="w-full bg-indigo-950 hover:bg-indigo-900 text-indigo-300 hover:text-indigo-100 font-mono text-xs font-bold py-2.5 px-4 border border-indigo-850 rounded flex items-center justify-center gap-2 transition-all"
              >
                <Search className="h-4 w-4" />
                TRIGGER COGNITIVE AUDIT SCAN
              </button>
            )}
          </div>

          <div className="bg-slate-900/50 p-4 rounded border border-slate-800 mt-4">
            <h4 className="font-mono text-[10px] font-bold text-slate-400 uppercase mb-2">Cerberus Metrics</h4>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Anomaly Index:</span>
                <span className="text-red-400">HIGH (Contractor OP-04)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Integrity Score:</span>
                <span className="text-emerald-400">92% Average</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Column 2: Threat operators tracker list (8 cols) */}
      <div className="lg:col-span-8 flex flex-col h-full">
        
        <div className="border border-emerald-950/80 bg-slate-950/40 p-5 rounded-lg flex flex-col h-full flex-1 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4 border-b border-emerald-950/50 pb-2">
            <h2 className="font-display font-semibold text-sm tracking-wide text-emerald-400 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-emerald-400" />
              INTELLIGENCE ATTRIBUTION OPERATOR MATRIX
            </h2>
            <span className="text-xs font-mono text-slate-400">
              BSAU Logs: {operators.length} Active Nodes
            </span>
          </div>

          <div className="space-y-4">
            {operators.map((op) => {
              let scoreColor = 'text-emerald-400';
              let scoreBg = 'bg-emerald-950/30 border-emerald-900';
              if (op.riskScore > 65) {
                scoreColor = 'text-red-400 animate-pulse';
                scoreBg = 'bg-red-950/30 border-red-900';
              } else if (op.riskScore > 35) {
                scoreColor = 'text-amber-400';
                scoreBg = 'bg-amber-950/30 border-amber-900';
              }

              return (
                <div
                  key={op.id}
                  className={`p-4 rounded border ${
                    op.riskScore > 65 
                      ? 'bg-red-950/10 border-red-900/40 shadow-md shadow-red-950/5' 
                      : 'bg-slate-900/60 border-slate-850'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                          op.status === 'suspicious' ? 'bg-red-950 text-red-400 border-red-900' :
                          op.status === 'monitored' ? 'bg-amber-950 text-amber-400 border-amber-900' :
                          'bg-emerald-950 text-emerald-400 border-emerald-900'
                        }`}>
                          {op.status}
                        </span>
                        <h3 className="font-display font-bold text-slate-200 text-sm">{op.name}</h3>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{op.role} | Last active: {op.lastSeenTime}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1.5 rounded border ${scoreBg} flex flex-col items-center`}>
                        <span className="text-[8px] font-mono text-slate-500 uppercase block">Risk Factor</span>
                        <span className={`text-sm font-display font-bold ${scoreColor}`}>{op.riskScore}%</span>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        {op.status === 'suspicious' && (
                          <button
                            onClick={() => {
                              onDeployTargetedLure(op.name);
                              onAddLog(`Cerberus BSAU: Directed targeting script on ${op.name}. Injected specific WE-FORGE custom blueprints.`, 'high');
                            }}
                            className="bg-indigo-950 hover:bg-indigo-900 text-indigo-300 hover:text-indigo-100 border border-indigo-800 rounded font-mono text-[9px] py-1 px-2.5 flex items-center gap-1 transition-all"
                          >
                            <Sparkles className="h-3 w-3 text-indigo-400" />
                            Deploy Lure Trap
                          </button>
                        )}
                        {op.riskScore > 35 && (
                          <button
                            onClick={() => handleMitigateOperator(op.id, op.name)}
                            className="bg-slate-950 hover:bg-slate-900 text-emerald-400 hover:text-emerald-200 border border-emerald-900 rounded font-mono text-[9px] py-1 px-2.5 transition-all"
                          >
                            Mitigate Node Credentials
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {op.anomalies.length > 0 ? (
                    <div className="mt-2 pt-2 border-t border-slate-900 space-y-1">
                      <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">Detected Behavioral Anomalies</span>
                      {op.anomalies.map((anomaly, idx) => (
                        <p key={idx} className="text-[10px] text-slate-300 font-mono leading-relaxed pl-3 border-l-2 border-red-500">
                          {anomaly}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2 pt-2 border-t border-slate-900/40 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Zero suspicious behaviors identified in current cycle logs
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
