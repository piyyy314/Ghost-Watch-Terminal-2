/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Cpu, Clock, Zap, AlertOctagon } from 'lucide-react';

interface CadlPanelProps {
  onAddLog: (event: string, severity: 'low' | 'medium' | 'high' | 'critical', status?: 'active' | 'mitigated' | 'escalating') => void;
  onSimulateIntrusion: () => void;
  activeThreatCount: number;
  onTriggerWipe: () => void;
}

export default function CadlPanel({ onAddLog, onSimulateIntrusion, activeThreatCount, onTriggerWipe }: CadlPanelProps) {
  const [latency, setLatency] = useState(500); // ms delay
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStepText, setSimStepText] = useState('');
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);

  // Simulation parameters for the frustration chart
  const attackerFrustration = Math.min(100, Math.floor((latency / 2000) * 100) + 10);
  const scrapingSpeed = Math.max(0, 100 - Math.floor((latency / 2000) * 95));

  const runFullEscalation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationLogs([]);
    onSimulateIntrusion();

    const steps = [
      {
        level: 1,
        text: 'LEVEL 1 ENGAGED: Capturing intruder fingerprint (DNS resolving gateway). digital-dust captured: IP 194.22.181.12, Location: Northern Asia.',
        logText: 'CADL L1 Monitor: Sniffing raw threat packet headers. Logged interactive digital dust.',
        severity: 'medium' as const,
        status: 'mitigated' as const,
        delay: 1500,
      },
      {
        level: 2,
        text: `LEVEL 2 ENGAGED: Injecting synthetic latency of ${latency}ms into data queries. Scanning automated scrapers stalled.`,
        logText: `CADL L2 Delay: Active response introduced synthetic jitter of ${latency}ms. Attacker bandwidth choked.`,
        severity: 'medium' as const,
        status: 'mitigated' as const,
        delay: 2000,
      },
      {
        level: 3,
        text: 'LEVEL 3 ENGAGED: Israel Aegis intercept active. Transparently rerouting session traffic away from Cryo-Vault onto P-91 AETHER Honeypot.',
        logText: 'CADL L3 Reroute: Rerouted external session to secure sandbox cage.',
        severity: 'high' as const,
        status: 'active' as const,
        delay: 2500,
      },
      {
        level: 4,
        text: 'LEVEL 4 ENGAGED: Feeding poisoned cryptographic datasets. Saturating adversarial decryption clusters with high-entropy entropy pools.',
        logText: 'CADL L4 Degrade: Injecting structured deceptive vectors into attacker sockets.',
        severity: 'high' as const,
        status: 'active' as const,
        delay: 2500,
      },
      {
        level: 5,
        text: 'LEVEL 5 ENGAGED: EXTREME ANOMALY MET. Executing Aegis Active Defense kill-switch. Revoking secure multipass token. Hard lockout active!',
        logText: 'CADL L5 Neutralize: Triggered full automated termination action.',
        severity: 'critical' as const,
        status: 'escalating' as const,
        delay: 2000,
      }
    ];

    let currentStep = 0;
    const runStep = () => {
      if (currentStep >= steps.length) {
        setIsSimulating(false);
        setActiveLevel(null);
        setSimStepText('Simulation completed successfully. Threat vectors neutralized.');
        return;
      }

      const step = steps[currentStep];
      setActiveLevel(step.level);
      setSimStepText(step.text);
      setSimulationLogs(prev => [...prev, `[CADL L${step.level}] - ${step.text}`]);
      onAddLog(step.logText, step.severity, step.status);

      currentStep++;
      setTimeout(runStep, step.delay);
    };

    runStep();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-1">
      
      {/* Column 1: Levels of active defense (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        <div className="border border-emerald-950/80 bg-slate-950/40 p-5 rounded-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4 border-b border-emerald-950/50 pb-2">
            <h2 className="font-display font-semibold text-sm tracking-wide text-emerald-400 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              COGNITIVE-ADAPTIVE DECEPTION LAYER (CADL) CONTROL PANEL
            </h2>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                activeThreatCount > 0 
                  ? 'text-red-400 border-red-900 bg-red-950/60 font-bold animate-pulse' 
                  : 'text-slate-400 border-slate-800 bg-slate-900/50'
              }`}>
                {activeThreatCount > 0 ? `${activeThreatCount} THREATS ACTIVE` : 'ALL THREATS MITIGATED'}
              </span>
              <span className="text-[10px] font-mono text-indigo-400 border border-indigo-900 bg-indigo-950/50 px-2 py-0.5 rounded">
                EVENT-DRIVEN PYTHON ENGINE
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-sans mb-5 leading-relaxed">
            The CADL operates a 5-level escalation model. Instead of hard-terminating connections immediately, CADL slowly degrades adversary intelligence gathering, giving security operators time to capture full attribution details.
          </p>

          {/* Interactive Escalation Grid */}
          <div className="space-y-3">
            {[
              { lv: 1, name: 'L1: Monitor', desc: "Gathers telemetry & logs 'Digital Dust' covertly." },
              { lv: 2, name: 'L2: Delay', desc: 'Introduces artificial packet delays to deter scanners.' },
              { lv: 3, name: 'L3: Reroute', desc: 'Transparently moves sessions to an AI-driven Honeypot.' },
              { lv: 4, name: 'L4: Degrade', desc: 'Feeds watermarked/poisoned quantum data packets.' },
              { lv: 5, name: 'L5: Neutralize', desc: 'Automated multipass revocation and session wipe.' }
            ].map((level) => {
              const isActive = activeLevel === level.lv;
              return (
                <div
                  key={level.lv}
                  className={`p-3 rounded border transition-all flex items-center justify-between ${
                    isActive 
                      ? 'bg-emerald-950/45 border-emerald-400 shadow-emerald-950 shadow-md' 
                      : 'bg-slate-900/50 border-slate-850 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold border ${
                      isActive 
                        ? 'bg-emerald-500 text-slate-950 border-emerald-300 animate-pulse' 
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}>
                      {level.lv}
                    </span>
                    <div>
                      <h4 className={`font-mono text-xs font-bold ${isActive ? 'text-emerald-300' : 'text-slate-200'}`}>{level.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{level.desc}</p>
                    </div>
                  </div>

                  {isActive && (
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Trigger button */}
          <div className="mt-5 pt-4 border-t border-slate-900 flex gap-3">
            <button
              onClick={runFullEscalation}
              disabled={isSimulating}
              className="flex-1 bg-emerald-950 hover:bg-emerald-900 disabled:bg-slate-900 text-emerald-300 disabled:text-slate-600 font-mono text-xs font-bold py-2.5 px-4 border border-emerald-800 disabled:border-slate-950 rounded shadow-md transition-all uppercase"
            >
              {isSimulating ? 'SIMULATION IN PROGRESS...' : 'SIMULATE MULTI-STAGE INTRUSION'}
            </button>
            <button
              onClick={() => {
                onAddLog('Emergency Override: Executed direct level 5 manual session termination', 'critical');
                onTriggerWipe();
              }}
              className="bg-red-950/60 hover:bg-red-900 text-red-400 hover:text-red-200 font-mono text-xs font-bold py-2.5 px-4 border border-red-800 rounded shadow-md transition-all uppercase"
            >
              MANUAL KILL-SWITCH
            </button>
          </div>

        </div>

      </div>

      {/* Column 2: Deception Metrics and Live Feed (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Dynamic Frustration Index Gauges */}
        <div className="border border-emerald-950/80 bg-slate-950/40 p-5 rounded-lg backdrop-blur-sm">
          <h3 className="font-display font-semibold text-xs tracking-wide text-slate-300 flex items-center gap-1.5 mb-3 border-b border-emerald-950/50 pb-2">
            <Cpu className="h-4 w-4 text-indigo-400" />
            L2 DECEPTION METRIC CONTROLS
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">SYNTHETIC QUERY LATENCY</span>
                <span className="text-emerald-400 font-bold">{latency} ms</span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="50"
                value={latency}
                onChange={(e) => {
                  const val = +e.target.value;
                  setLatency(val);
                  if (val > 1500) {
                    onAddLog(`System settings: Injected extreme delay of ${val}ms to degrade lateral port scanners`, 'medium');
                  }
                }}
                className="w-full accent-emerald-500 bg-slate-900"
              />
            </div>

            {/* Metrics visualization */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-900/40 p-3 rounded border border-slate-800">
                <span className="text-[9px] text-slate-500 block font-mono uppercase">ATTACKER FRUSTRATION</span>
                <p className="text-lg font-display font-bold text-amber-400 mt-1">{attackerFrustration}%</p>
                <div className="w-full bg-slate-950 h-1 mt-1 rounded overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${attackerFrustration}%` }} />
                </div>
              </div>

              <div className="bg-slate-900/40 p-3 rounded border border-slate-800">
                <span className="text-[9px] text-slate-500 block font-mono uppercase">SCRAPER HARVEST VELOCITY</span>
                <p className="text-lg font-display font-bold text-emerald-400 mt-1">{scrapingSpeed}%</p>
                <div className="w-full bg-slate-950 h-1 mt-1 rounded overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${scrapingSpeed}%` }} />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Live simulation typewriter output */}
        <div className="border border-emerald-950/80 bg-slate-950/40 p-5 rounded-lg flex-1 min-h-[180px] backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display font-semibold text-xs tracking-wide text-indigo-400 flex items-center gap-1.5 mb-2 border-b border-emerald-950/50 pb-2">
              <Zap className="h-4 w-4" />
              SIMULATOR STACK STREAM
            </h3>
            
            {simStepText ? (
              <div className="font-mono text-[11px] space-y-2 mt-2">
                <p className="text-emerald-300 leading-relaxed bg-slate-950 p-3 rounded border border-emerald-950">
                  {simStepText}
                </p>
                
                {/* Scroll container of past steps during active simulation */}
                <div className="max-h-[140px] overflow-y-auto space-y-1 text-slate-500 text-[10px]">
                  {simulationLogs.slice(0, -1).map((histLog, idx) => (
                    <div key={idx} className="border-l border-slate-800 pl-2">
                      {histLog}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center h-full">
                <AlertOctagon className="h-8 w-8 text-slate-600 mb-2 animate-pulse" />
                <p className="text-[10px] text-slate-500 font-mono italic">
                  Awaiting operational simulation events. Trigger an intrusion to observe telemetry responses.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
