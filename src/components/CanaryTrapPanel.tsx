/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Sparkles, AlertCircle, Copy, Check, Info } from 'lucide-react';
import { Lure, WatermarkType } from '../types';

interface CanaryTrapPanelProps {
  lures: Lure[];
  onCreateLure: (target: string, type: WatermarkType) => void;
  onSimulateLureClick: (lureId: string) => void;
}

export default function CanaryTrapPanel({ lures, onCreateLure, onSimulateLureClick }: CanaryTrapPanelProps) {
  const [target, setTarget] = useState('');
  const [watermarkType, setWatermarkType] = useState<WatermarkType>('linguistic');
  const [copiedLureId, setCopiedLureId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim()) return;
    onCreateLure(target.trim(), watermarkType);
    setTarget('');
  };

  const handleCopy = (token: string, lureId: string) => {
    const decoyUrl = `https://${token}`;
    navigator.clipboard.writeText(decoyUrl);
    setCopiedLureId(lureId);
    setTimeout(() => setCopiedLureId(null), 2000);
  };

  const getWatermarkExplanation = (type: WatermarkType) => {
    switch (type) {
      case 'linguistic':
        return 'Subtle syntactic synonym replacements (WE-FORGE algorithm) targeting core technical words. Hard to detect, guarantees leak identification.';
      case 'metadata':
        return 'Hidden tracking tags added into document properties or non-functional cells in tabular outputs.';
      case 'steganographic':
        return 'Least Significant Bit (LSB) encoding. Embedded markers inside schematic diagrams or visual PDF blocks.';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-1">
      
      {/* Column 1: Lure Deployer Forms (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Trap deployer control panel */}
        <div className="border border-emerald-950/80 bg-slate-950/40 p-5 rounded-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4 border-b border-emerald-950/50 pb-2">
            <h2 className="font-display font-semibold text-sm tracking-wide text-emerald-400 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              IDENTIFIER INJECTION ENGINE (IIE)
            </h2>
            <span className="text-[10px] font-mono text-emerald-500 bg-emerald-950/50 border border-emerald-900 px-1.5 rounded">
              WE-FORGE ACTIVE
            </span>
          </div>

          <p className="text-xs text-slate-300 font-sans mb-4 leading-relaxed">
            Generate customized decoy blueprints and operational guides containing unique cryptographic watermarks (Barium Meal test). Deploying lures anchors leak traceability in the physical/external workspace.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                TARGET PERSONA / SUSPECT DEVICE ID
              </label>
              <input
                type="text"
                required
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g., LAE-Node-09 (Security Specialist)"
                className="w-full bg-slate-950 border border-emerald-950/80 rounded p-2.5 font-mono text-xs text-emerald-400 focus:outline-none focus:border-emerald-500 placeholder-emerald-950/40"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                WATERMARK CLASSIFICATION
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['linguistic', 'metadata', 'steganographic'] as WatermarkType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setWatermarkType(type)}
                    className={`p-2.5 rounded border text-[10px] font-mono capitalize transition-all ${
                      watermarkType === type
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/50 p-3 rounded border border-slate-800 flex items-start gap-2.5">
              <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 leading-normal font-sans">
                <span className="font-bold text-slate-300">Modality:</span> {getWatermarkExplanation(watermarkType)}
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-950 hover:bg-emerald-900 text-emerald-300 hover:text-emerald-100 font-mono text-xs font-bold py-3 px-4 border border-emerald-800 rounded shadow-md transition-all uppercase tracking-wider"
            >
              DEPLOY ADVANCED CANARY TRAP
            </button>
          </form>

        </div>

        {/* Tactical advisory */}
        <div className="border border-emerald-950/50 bg-slate-950/20 p-5 rounded-lg backdrop-blur-sm">
          <h3 className="font-display font-semibold text-xs tracking-wide text-slate-300 flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-emerald-500" />
            OPERATIONAL DECEPTION DOCTRINE
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            "Barium meal" protocols allow full security tracing without active agent intrusion on client nodes. Once a recipient attempts to resolve or distribute the marked blueprint, the DNS Canary network captures authorization tokens, transmitting telemetry to the C2 server instantly.
          </p>
        </div>

      </div>

      {/* Column 2: Active Trap Ledger & Decoys (7 cols) */}
      <div className="lg:col-span-7 flex flex-col h-full">
        
        <div className="border border-emerald-950/80 bg-slate-950/40 p-5 rounded-lg flex flex-col h-full flex-1 backdrop-blur-sm">
          
          <div className="flex items-center justify-between mb-4 border-b border-emerald-950/50 pb-2">
            <h2 className="font-display font-semibold text-sm tracking-wide text-indigo-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              ATTRIBUTION DATABASE (ADB) LEDGER
            </h2>
            <span className="text-xs font-mono text-slate-400">
              Active: {lures.length}
            </span>
          </div>

          {/* Trap List */}
          <div className="flex-1 overflow-y-auto space-y-4 max-h-[480px]">
            {lures.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                <Shield className="h-10 w-10 text-slate-600 mb-3 animate-pulse" />
                <p className="text-xs text-slate-400 font-mono">No traps deployed on this segment.</p>
                <p className="text-[10px] text-slate-500 font-sans mt-1">Use the left generator panel to seed active lures.</p>
              </div>
            ) : (
              lures.map((lure) => (
                <div
                  key={lure.id}
                  className={`p-4 rounded border transition-all ${
                    lure.status === 'triggered'
                      ? 'bg-red-950/20 border-red-900/60 shadow-md shadow-red-950/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase ${
                        lure.status === 'triggered' ? 'bg-red-950 text-red-400 border-red-800' : 'bg-emerald-950 text-emerald-400 border-emerald-900'
                      }`}>
                        {lure.status}
                      </span>
                      <h3 className="font-mono text-xs font-bold text-slate-200 mt-1">{lure.filename}</h3>
                      <p className="text-[10px] text-slate-400 font-mono">Target: <span className="text-emerald-400">{lure.targetPersona}</span></p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(lure.dnsToken, lure.id)}
                        className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded border border-slate-850 font-mono text-[9px] flex items-center gap-1.5"
                        title="Copy decoy DNS token/URL link"
                      >
                        {copiedLureId === lure.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Decoy URL
                          </>
                        )}
                      </button>

                      {lure.status === 'active' && (
                        <button
                          onClick={() => onSimulateLureClick(lure.id)}
                          className="px-2 py-1 bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-400 hover:text-indigo-200 border border-indigo-900/80 rounded font-mono text-[9px]"
                          title="Simulate adversary access of this trap"
                        >
                          Trigger Trapping
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/60 p-2.5 rounded border border-slate-900 font-mono text-[10px]">
                    <div>
                      <span className="text-slate-500 block text-[9px]">WATERMARK</span>
                      <span className="text-slate-300 capitalize">{lure.watermarkType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">SECT KEY SIG</span>
                      <span className="text-slate-300 font-mono">{lure.watermarkValue}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">CANARY DNS</span>
                      <span className="text-teal-400 overflow-hidden text-ellipsis block whitespace-nowrap" title={lure.dnsToken}>
                        {lure.dnsToken}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">ACCESS LOGS</span>
                      <span className={lure.accessCount > 0 ? "text-red-400 font-bold" : "text-slate-400"}>
                        {lure.accessCount} Hits
                      </span>
                    </div>
                  </div>

                  {lure.status === 'triggered' && lure.lastSeenIp && (
                    <div className="mt-2 text-[10px] font-mono bg-red-950/35 border border-red-900/50 p-2 rounded text-red-300">
                      🚨 LEAK DETECTED: Intruder accessed this lure from <span className="font-bold underline">{lure.lastSeenIp}</span> ({lure.lastSeenGeo})
                    </div>
                  )}

                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
