/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Shield, AlertTriangle, Radio, Activity, Download } from 'lucide-react';
import { OntoNode, ThreatLog } from '../types';

interface OverviewPanelProps {
  nodes: OntoNode[];
  threatLogs: ThreatLog[];
  onAddLog: (event: string, severity: 'low' | 'medium' | 'high' | 'critical', status?: 'active' | 'mitigated' | 'escalating') => void;
  activeThreatCount: number;
  onMitigateThreat?: (id: string) => void;
  onMitigateAllThreats?: () => void;
}

export default function OverviewPanel({ 
  nodes, 
  threatLogs, 
  onAddLog, 
  activeThreatCount,
  onMitigateThreat,
  onMitigateAllThreats
}: OverviewPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedRadarNode, setSelectedRadarNode] = useState<OntoNode | null>(null);
  const [frequency, setFrequency] = useState(915.0);
  const [isJitterActive, setIsJitterActive] = useState(false);

  // Radar Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let angle = 0;

    // Fixed node coordinates mapped onto the canvas (size is 300x300)
    // Center is (150, 150), radius is 140
    const renderRadar = () => {
      ctx.clearRect(0, 0, 300, 300);

      // Draw background circle
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.arc(150, 150, 140, 0, Math.PI * 2);
      ctx.fill();

      // Draw concentric green grids
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.lineWidth = 1;
      for (let r = 35; r <= 140; r += 35) {
        ctx.beginPath();
        ctx.arc(150, 150, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw crosshairs
      ctx.beginPath();
      ctx.moveTo(150, 10);
      ctx.lineTo(150, 290);
      ctx.moveTo(10, 150);
      ctx.lineTo(290, 150);
      ctx.stroke();

      // Draw sweeping line
      const sweepX = 150 + Math.cos(angle) * 140;
      const sweepY = 150 + Math.sin(angle) * 140;

      // Draw sweep gradient wedge
      const grad = ctx.createRadialGradient(150, 150, 0, 150, 150, 140);
      grad.addColorStop(0, 'rgba(16, 185, 129, 0.03)');
      grad.addColorStop(1, 'rgba(16, 185, 129, 0.15)');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(150, 150);
      ctx.arc(150, 150, 140, angle - 0.2, angle);
      ctx.lineTo(150, 150);
      ctx.fill();

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(150, 150);
      ctx.lineTo(sweepX, sweepY);
      ctx.stroke();

      // Draw nodes on radar
      nodes.forEach((node) => {
        // Map 0-100 coordinates to canvas radius (scale from center 150,150)
        // Convert node x,y relative to center
        const dx = ((node.x - 50) / 50) * 110;
        const dy = ((node.y - 50) / 50) * 110;
        const nx = 150 + dx;
        const ny = 150 + dy;

        // Calculate angle of this node from center
        const nodeAngle = Math.atan2(dy, dx);
        // Calculate difference in angle from sweep
        let angleDiff = (angle - nodeAngle) % (Math.PI * 2);
        if (angleDiff < 0) angleDiff += Math.PI * 2;

        let opacity = 0;
        if (angleDiff < 1) {
          opacity = 1 - angleDiff; // fade out after sweep passes
        } else {
          opacity = 0.15; // default faint ping
        }

        // Color based on status
        let color = '16, 185, 129'; // emerald (online)
        if (node.status === 'compromised') color = '239, 68, 68'; // red
        if (node.status === 'quarantined') color = '245, 158, 11'; // amber
        if (node.status === 'offline') color = '100, 116, 139'; // slate

        // Pulse size if compromised
        const sizePulse = node.status === 'compromised' ? 2 * Math.sin(Date.now() / 150) : 0;

        ctx.fillStyle = `rgba(${color}, ${opacity})`;
        ctx.beginPath();
        ctx.arc(nx, ny, 5 + sizePulse, 0, Math.PI * 2);
        ctx.fill();

        // Draw selection ring
        if (selectedRadarNode && selectedRadarNode.id === node.id) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(nx, ny, 10, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Tag label
        ctx.fillStyle = `rgba(226, 232, 240, ${Math.max(0.3, opacity)})`;
        ctx.font = '9px monospace';
        ctx.fillText(node.label, nx + 8, ny + 3);
      });

      angle = (angle + 0.015) % (Math.PI * 2);
      animationId = requestAnimationFrame(renderRadar);
    };

    renderRadar();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [nodes, selectedRadarNode]);

  // Handle radar click to select node
  const handleRadarClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    let closestNode: OntoNode | null = null;
    let minDistance = 15;

    nodes.forEach((node) => {
      const dx = ((node.x - 50) / 50) * 110;
      const dy = ((node.y - 50) / 50) * 110;
      const nx = 150 + dx;
      const ny = 150 + dy;

      const dist = Math.sqrt((clickX - nx) ** 2 + (clickY - ny) ** 2);
      if (dist < minDistance) {
        minDistance = dist;
        closestNode = node;
      }
    });

    setSelectedRadarNode(closestNode);
  };

  const handleJitterToggle = () => {
    setIsJitterActive(!isJitterActive);
    if (!isJitterActive) {
      onAddLog('LoRa Comms: Strategic Spectrum Hopping/Jitter enabled on 915.0MHz band', 'low');
    } else {
      onAddLog('LoRa Comms: Reverted to steady frequency locking', 'low');
    }
  };

  useEffect(() => {
    if (isJitterActive) {
      const interval = setInterval(() => {
        setFrequency(+(915.0 + (Math.random() - 0.5) * 4).toFixed(3));
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setFrequency(915.0);
    }
  }, [isJitterActive]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-1">
      
      {/* Column 1: Active Stats and Radar (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Citron Tree Combat Dashboard Metrics */}
        <div className="border border-emerald-950/80 bg-slate-950/40 p-5 rounded-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4 border-b border-emerald-950/50 pb-2">
            <h2 className="font-display font-semibold text-sm tracking-wide text-emerald-400 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              AEGIS ACTIVE DEFENSE CENTER
            </h2>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            <div className="bg-slate-900/50 p-3 rounded border border-slate-800">
              <p className="text-[10px] text-slate-400 font-mono">BATTLE STATUS</p>
              <p className={`text-base font-display font-bold mt-1 ${activeThreatCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {activeThreatCount > 0 ? 'ENGAGEMENT ACTIVE' : 'STEADY PATROL'}
              </p>
              <span className="text-[9px] text-slate-500 font-mono">Citron Tree BMC</span>
            </div>

            <div className="bg-slate-900/50 p-3 rounded border border-slate-800">
              <p className="text-[10px] text-slate-400 font-mono">THREAT SEVERITY</p>
              <p className={`text-base font-display font-bold mt-1 ${activeThreatCount > 2 ? 'text-red-500' : activeThreatCount > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                {activeThreatCount > 2 ? 'CRITICAL' : activeThreatCount > 0 ? 'HIGH' : 'LOW'}
              </p>
              <span className="text-[9px] text-slate-500 font-mono">Active tracking</span>
            </div>

            <div className="bg-slate-900/50 p-3 rounded border border-slate-800 col-span-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-slate-400 font-mono">LORA MESH TRANSCEIVER</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold animate-pulse">LIVE TRANSMIT</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-lg font-mono text-emerald-300 font-bold">{frequency} MHz</p>
                <button
                  onClick={handleJitterToggle}
                  className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${isJitterActive ? 'bg-indigo-950/40 border-indigo-500 text-indigo-300 animate-pulse' : 'bg-slate-850 hover:bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {isJitterActive ? 'DISABLE JITTER' : 'ENABLE JITTER'}
                </button>
              </div>
              <div className="w-full bg-slate-950 h-1 mt-2 rounded overflow-hidden relative">
                <div 
                  className={`h-full bg-emerald-500 transition-all duration-300 ${isJitterActive ? 'w-full animate-pulse' : 'w-4/5'}`} 
                />
              </div>
            </div>

            <div className="bg-slate-900/50 p-3 rounded border border-slate-800 col-span-2">
              <p className="text-[10px] text-slate-400 font-mono">SYSTEM SECURITY FORENSICS</p>
              <div className="flex justify-between items-center mt-2 gap-2">
                <span className="text-[11px] text-slate-300 font-sans leading-tight">
                  Export complete cryptographically verified active threat logs for out-of-band audit.
                </span>
                <button
                  onClick={() => {
                    const dataStr = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(threatLogs, null, 2));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", `ghost_watch_forensic_dump_${Date.now()}.json`);
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                    onAddLog("Security Forensic Export: Extracted cryptographically verified operational journal telemetry to secure disk store.", "low");
                  }}
                  className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 hover:text-emerald-100 font-mono text-[10px] py-2 px-3 border border-emerald-800 rounded flex items-center gap-1.5 shrink-0 transition-all uppercase font-bold shadow-sm"
                  title="Export telemetry logs as JSON file"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-400 animate-bounce" />
                  FORENSIC DUMP
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Tactical Sweep Radar */}
        <div className="border border-emerald-950/80 bg-slate-950/40 p-5 rounded-lg flex flex-col items-center backdrop-blur-sm">
          <div className="w-full flex items-center justify-between mb-4 border-b border-emerald-950/50 pb-2">
            <h3 className="font-display font-semibold text-xs tracking-wide text-slate-300 flex items-center gap-2">
              <Radio className="h-4 w-4 text-emerald-500" />
              915.0 MHz SPECTRUM RADAR SWEEP
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">HB-9982 LINKED</span>
          </div>

          <div className="relative bg-slate-950 p-2 rounded-full border border-emerald-900/40 shadow-inner shadow-emerald-950">
            <div className="scanline-effect absolute inset-0 rounded-full pointer-events-none" />
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              onClick={handleRadarClick}
              className="cursor-crosshair rounded-full"
            />
          </div>

          <div className="mt-4 w-full bg-slate-900/50 p-3 rounded border border-slate-800 min-h-[70px]">
            {selectedRadarNode ? (
              <div className="font-mono text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-1 mb-1">
                  <span className="text-slate-400">Node Identifier:</span>
                  <span className="text-slate-200 font-bold">{selectedRadarNode.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <span className="text-slate-500">Node IP:</span>
                  <span className="text-slate-300 text-right">{selectedRadarNode.ip}</span>
                  <span className="text-slate-500">Architecture:</span>
                  <span className="text-indigo-400 text-right">{selectedRadarNode.type}</span>
                  <span className="text-slate-500">Status:</span>
                  <span className={`text-right font-bold ${
                    selectedRadarNode.status === 'online' ? 'text-emerald-400' :
                    selectedRadarNode.status === 'compromised' ? 'text-red-400' :
                    selectedRadarNode.status === 'quarantined' ? 'text-amber-500' : 'text-slate-500'
                  }`}>{selectedRadarNode.status.toUpperCase()}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-mono text-center italic mt-2">
                Click a radar signal ping to lock telemetry and inspect node characteristics
              </p>
            )}
          </div>

        </div>

      </div>

      {/* Column 2: Log Stream / Command console (7 cols) */}
      <div className="lg:col-span-7 flex flex-col h-full min-h-[500px]">
        
        <div className="border border-emerald-950/80 bg-slate-950/60 rounded-lg flex flex-col h-full flex-1 p-5 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-emerald-950/50 pb-2">
            <h2 className="font-display font-semibold text-sm tracking-wide text-indigo-400 flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              INTEGRATED SOVEREIGN JOURNAL & C2 LOGGER
            </h2>
            <div className="flex items-center gap-2">
              {activeThreatCount > 0 && onMitigateAllThreats && (
                <button
                  onClick={onMitigateAllThreats}
                  className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 font-mono text-[9px] py-1 px-2 border border-emerald-800 rounded transition-all uppercase font-bold"
                  title="Mark all active and escalating threats as mitigated"
                >
                  MITIGATE ALL ({activeThreatCount})
                </button>
              )}
              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">Telemetry logs</span>
              <button 
                onClick={() => {
                  const dataStr = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(threatLogs, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `ghost_watch_forensic_dump_${Date.now()}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                  onAddLog("Security Forensic Export: Extracted cryptographically verified operational journal telemetry to secure disk store.", "low", "mitigated");
                }}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-slate-100 font-mono text-[9px] py-1 px-2.5 border border-slate-800 rounded flex items-center gap-1.5 transition-all uppercase"
                title="Download JSON telemetry log"
              >
                <Download className="h-3 w-3 text-emerald-400" />
                EXPORTS (JSON)
              </button>
            </div>
          </div>

          {/* Log Stream */}
          <div className="flex-1 overflow-y-auto bg-slate-950/90 p-4 rounded border border-emerald-950/55 font-mono text-xs text-slate-300 min-h-[350px] max-h-[460px] shadow-inner">
            <div className="space-y-2">
              {threatLogs.map((log) => {
                let colorClass = 'text-slate-300';
                if (log.severity === 'critical') colorClass = 'text-red-400 font-bold';
                else if (log.severity === 'high') colorClass = 'text-amber-400';
                else if (log.severity === 'medium') colorClass = 'text-teal-400';

                const normalizedStatus = (log.status || '').trim().toLowerCase();
                const isUnresolved = normalizedStatus === 'active' || normalizedStatus === 'escalating';
                
                return (
                  <div key={log.id} className="border-b border-slate-900/60 pb-1.5 flex flex-col gap-0.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>[{log.timestamp}]</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.2 rounded border uppercase text-[8px] font-bold ${
                          log.severity === 'critical' ? 'bg-red-950/40 border-red-900 text-red-400' :
                          log.severity === 'high' ? 'bg-amber-950/40 border-amber-900 text-amber-400' :
                          log.severity === 'medium' ? 'bg-teal-950/40 border-teal-900 text-teal-400' :
                          'bg-slate-900 border-slate-800 text-slate-400'
                        }`}>
                          {log.severity}
                        </span>

                        <span className={`px-1.5 py-0.2 rounded border uppercase text-[8px] font-bold ${
                          normalizedStatus === 'escalating' ? 'bg-purple-950/50 border-purple-800 text-purple-300 animate-pulse' :
                          normalizedStatus === 'active' ? 'bg-red-950/50 border-red-800 text-red-300 animate-pulse' :
                          'bg-slate-900 border-slate-800 text-slate-500'
                        }`}>
                          {log.status}
                        </span>

                        {isUnresolved && onMitigateThreat && (
                          <button
                            onClick={() => onMitigateThreat(log.id)}
                            className="bg-slate-850 hover:bg-emerald-950 text-slate-400 hover:text-emerald-300 border border-slate-750 hover:border-emerald-700 px-1.5 py-0.2 rounded text-[8px] font-mono uppercase transition-colors"
                            title="Mark this threat as mitigated"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                    <p className={`${colorClass} mt-0.5 leading-relaxed`}>
                      <span className="text-slate-500 font-bold">&gt;</span> {log.event}
                    </p>
                    {log.sourceIp && (
                      <span className="text-[10px] text-slate-400/80">Source Address: {log.sourceIp}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick interactive terminal prompt */}
          <div className="mt-4 flex gap-2">
            <span className="text-emerald-500 font-mono text-sm self-center">&gt;</span>
            <input
              type="text"
              placeholder="Inject command or notes into operational ledger... (e.g., 'Secure comms lock initialized')"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const input = e.currentTarget;
                  if (input.value.trim() !== '') {
                    onAddLog(`Director Memo: ${input.value}`, 'medium');
                    input.value = '';
                  }
                }
              }}
              className="flex-1 bg-slate-950 border border-emerald-950 rounded p-2.5 font-mono text-xs text-emerald-400 placeholder-emerald-950/60 focus:outline-none focus:border-emerald-500"
            />
          </div>

        </div>

      </div>

    </div>
  );
}
