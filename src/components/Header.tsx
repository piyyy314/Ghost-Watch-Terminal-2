/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Cpu, Radio, KeyRound, Clock } from 'lucide-react';

interface HeaderProps {
  systemIntegrity: boolean;
  activeThreats: number;
  pqcKeysRotated: number;
  onTriggerWipe: () => void;
}

export default function Header({ systemIntegrity, activeThreats, pqcKeysRotated, onTriggerWipe }: HeaderProps) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(d.toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-emerald-950/80 bg-slate-950/90 text-slate-100 p-4 sticky top-0 z-40 backdrop-blur-md shadow-lg shadow-emerald-950/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo and Hardware Binding */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded border ${systemIntegrity ? 'border-emerald-500 bg-emerald-950/30' : 'border-red-500 bg-red-950/30'}`}>
            {systemIntegrity ? (
              <Shield className="h-6 w-6 text-emerald-400 animate-pulse" />
            ) : (
              <ShieldAlert className="h-6 w-6 text-red-500 animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                GHOST-WATCH C2 TERMINAL
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                APEX TIER
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Hardware Binding: <span className="text-emerald-300 font-medium">HB-9982-AX-2026</span>
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap items-center gap-3 md:gap-5 text-xs font-mono">
          
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-all ${
            activeThreats > 0 ? 'bg-red-950/40 border-red-800 text-red-400' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <ShieldAlert className={`h-3.5 w-3.5 ${activeThreats > 0 ? 'text-red-400 animate-pulse' : 'text-slate-500'}`} />
            <div>
              <span className="text-slate-400 block text-[10px]">ACTIVE THREATS</span>
              <span className={`font-bold ${activeThreats > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {activeThreats} {activeThreats === 1 ? 'INCIDENT' : 'INCIDENTS'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-900 border border-slate-800">
            <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <div>
              <span className="text-slate-400 block text-[10px]">LORA COMMS</span>
              <span className="text-emerald-300">915.0 MHz [UP]</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-900 border border-slate-800">
            <KeyRound className="h-3.5 w-3.5 text-teal-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">PQ CIPHER SUITES</span>
              <span className="text-teal-300">NIST APPROVED ({pqcKeysRotated})</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-900 border border-slate-800">
            <Cpu className="h-3.5 w-3.5 text-indigo-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">INTEGRITY MONITOR</span>
              <span className={systemIntegrity ? "text-emerald-400" : "text-red-500 font-bold"}>
                {systemIntegrity ? "SECURE" : "COMPROMISED"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-900 border border-slate-800 min-w-[150px]">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">OPERATION TIME</span>
              <span className="text-slate-200 font-mono tracking-wider">{timeStr}</span>
            </div>
          </div>

          {systemIntegrity && (
            <button
              onClick={onTriggerWipe}
              className="px-3 py-2 bg-red-950 hover:bg-red-900 text-red-400 hover:text-red-200 font-mono text-xs font-bold border border-red-800 rounded shadow-md transition-all animate-pulse"
              title="Trigger instant terminal clean and memory scrub"
            >
              WIPE CORE
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
