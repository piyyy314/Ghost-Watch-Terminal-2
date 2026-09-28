/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GitBranch, User, Server, Shield, Zap, Info, PlusCircle } from 'lucide-react';
import { OntoNode, OntoLink, NodeStatus, NodeType } from '../types';

interface OntologyPanelProps {
  nodes: OntoNode[];
  links: OntoLink[];
  onUpdateNodeStatus: (nodeId: string, status: NodeStatus) => void;
  onAddLink: (source: string, target: string, type: 'LoRa' | 'SecureTunnel' | 'Suspicious' | 'HoneypotReroute') => void;
  onAddLog: (event: string, severity: 'low' | 'medium' | 'high' | 'critical') => void;
}

export default function OntologyPanel({ nodes, links, onUpdateNodeStatus, onAddLink, onAddLog }: OntologyPanelProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // States for adding a custom semantic link
  const [linkSource, setLinkSource] = useState('');
  const [linkTarget, setLinkTarget] = useState('');
  const [linkType, setLinkType] = useState<'LoRa' | 'SecureTunnel' | 'Suspicious' | 'HoneypotReroute'>('SecureTunnel');

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  // Trigger kinetic ontological action
  const handleKineticAction = (actionName: string) => {
    if (!selectedNode) return;

    onAddLog(`Palantir Kinetic Action: Executed "${actionName}" on node "${selectedNode.label}"`, 'high');

    if (actionName === 'Quarantine Node') {
      onUpdateNodeStatus(selectedNode.id, 'quarantined');
      // Set suspicious links connected to this to HoneypotReroute or isolated
      onAddLog(`Safety Protocol: Quarantined node ${selectedNode.label} (${selectedNode.ip}) successfully. All lateral sessions suspended.`, 'medium');
    } else if (actionName === 'Isolate Host') {
      onUpdateNodeStatus(selectedNode.id, 'offline');
      onAddLog(`Aegis active interdiction: Terminated LoRa & network bridges for ${selectedNode.label}. Host offline.`, 'high');
    } else if (actionName === 'Authorize ML-KEM Shield') {
      onUpdateNodeStatus(selectedNode.id, 'online');
      onAddLog(`Cryptographic reinforcement: Enabled ML-KEM-768 quantum-safe shield on ${selectedNode.label}.`, 'low');
    } else if (actionName === 'Initiate Deception Trap Reroute') {
      // Find a honeypot node
      const honeypot = nodes.find(n => n.type === 'Honeypot');
      if (honeypot) {
        onAddLink(selectedNode.id, honeypot.id, 'HoneypotReroute');
        onUpdateNodeStatus(selectedNode.id, 'quarantined');
        onAddLog(`CADL Routing: Diverted suspicious session from ${selectedNode.label} to autonomous trap honeypot ${honeypot.label}.`, 'high');
      }
    }
  };

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkSource || !linkTarget || linkSource === linkTarget) return;
    onAddLink(linkSource, linkTarget, linkType);
    onAddLog(`Ontology Linkage: Registered semantic relationship [${linkSource}] -(${linkType})-> [${linkTarget}] in system twin`, 'medium');
    setLinkSource('');
    setLinkTarget('');
  };

  const getNodeIcon = (type: NodeType, status: NodeStatus) => {
    let color = 'text-emerald-400';
    if (status === 'compromised') color = 'text-red-400';
    if (status === 'quarantined') color = 'text-amber-500';
    if (status === 'offline') color = 'text-slate-500';

    switch (type) {
      case 'C2':
        return <Shield className={`h-5 w-5 ${color}`} />;
      case 'Gateway':
        return <Server className={`h-5 w-5 ${color}`} />;
      case 'Honeypot':
        return <Zap className={`h-5 w-5 ${color}`} />;
      default:
        return <User className={`h-5 w-5 ${color}`} />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-1">
      
      {/* Column 1: Palantir Interactive Map (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        
        <div className="border border-emerald-950/80 bg-slate-950/40 rounded-lg p-5 backdrop-blur-sm relative overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-emerald-950/50 pb-2">
            <h2 className="font-display font-semibold text-sm tracking-wide text-emerald-400 flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              PALANTIR ONTOLOGICAL GRAPH: DIGITAL TWIN VIEW
            </h2>
            <span className="text-xs font-mono text-slate-400">
              Nodes: {nodes.length} | Links: {links.length}
            </span>
          </div>

          <p className="text-xs text-slate-300 font-sans mb-4 leading-relaxed">
            The Ontology transforms flat data into mapped semantic entities. Interactive entities include 
            <span className="text-emerald-400 font-mono mx-1">Lure Documents</span>, 
            <span className="text-indigo-400 font-mono mx-1">Hosts</span>, and 
            <span className="text-red-400 font-mono mx-1">Adversaries</span>. Select any node to activate kinetic tactical maneuvers.
          </p>

          {/* SVG Map Container */}
          <div className="bg-slate-950 rounded border border-emerald-950/80 relative min-h-[350px] flex items-center justify-center p-2 shadow-inner">
            
            {/* Background grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <svg className="w-full h-[350px] absolute inset-0 z-10 pointer-events-none">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(16, 185, 129, 0.4)" />
                </marker>
                <marker id="arrow-suspicious" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(239, 68, 68, 0.6)" />
                </marker>
              </defs>

              {/* Draw Links */}
              {links.map((link) => {
                const srcNode = nodes.find(n => n.id === link.source);
                const tgtNode = nodes.find(n => n.id === link.target);
                if (!srcNode || !tgtNode) return null;

                // Scale node positions to fit cleanly on SVG viewport
                // Node positions are 0-100. Scale factor is: layout width/100, lets say 100% of container.
                // We can use percentage coordinate translation
                const x1 = `${srcNode.x}%`;
                const y1 = `${srcNode.y}%`;
                const x2 = `${tgtNode.x}%`;
                const y2 = `${tgtNode.y}%`;

                let strokeColor = 'rgba(16, 185, 129, 0.25)';
                let strokeWidth = '1.5';
                let strokeDash = undefined;

                if (link.type === 'Suspicious') {
                  strokeColor = 'rgba(239, 68, 68, 0.6)';
                  strokeWidth = '2';
                  strokeDash = '5,5';
                } else if (link.type === 'HoneypotReroute') {
                  strokeColor = 'rgba(168, 85, 247, 0.7)';
                  strokeWidth = '2';
                } else if (link.type === 'LoRa') {
                  strokeColor = 'rgba(14, 165, 233, 0.4)';
                  strokeDash = '2,3';
                }

                return (
                  <g key={link.id}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={strokeDash}
                      markerEnd={link.type === 'Suspicious' ? 'url(#arrow-suspicious)' : 'url(#arrow)'}
                    />
                    
                    {/* Floating particle animations on tunnels */}
                    {link.type === 'SecureTunnel' && (
                      <circle r="2.5" fill="#10b981">
                        <animateMotion
                          path={`M ${srcNode.x}% ${srcNode.y}% L ${tgtNode.x}% ${tgtNode.y}%`}
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    {link.type === 'HoneypotReroute' && (
                      <circle r="3" fill="#c084fc">
                        <animateMotion
                          path={`M ${srcNode.x}% ${srcNode.y}% L ${tgtNode.x}% ${tgtNode.y}%`}
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Floating Div Interactive Nodes */}
            <div className="absolute inset-0 z-20">
              {nodes.map((node) => {
                let statusColor = 'bg-emerald-500 shadow-emerald-950/80';
                if (node.status === 'compromised') statusColor = 'bg-red-500 shadow-red-950/80 animate-ping';
                if (node.status === 'quarantined') statusColor = 'bg-amber-500 shadow-amber-950/80';
                if (node.status === 'offline') statusColor = 'bg-slate-500 shadow-slate-950/80';

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-full border bg-slate-900 shadow-lg flex items-center justify-center transition-all ${
                      selectedNodeId === node.id 
                        ? 'border-indigo-400 scale-125 z-30 ring-2 ring-indigo-950' 
                        : node.status === 'compromised' ? 'border-red-500 scale-110' : 'border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {/* Radar ripple indicator for compromised nodes */}
                    {node.status === 'compromised' && (
                      <span className="radar-ping absolute inset-0 rounded-full bg-red-500/30" />
                    )}

                    {getNodeIcon(node.type, node.status)}

                    {/* Faint status indicator dot */}
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-slate-950 ${statusColor}`} />
                  </button>
                );
              })}
            </div>

            {/* Floating legend */}
            <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-900 rounded p-2 text-[9px] font-mono text-slate-400 flex flex-col gap-1 z-30">
              <span className="text-[10px] text-slate-300 font-bold mb-1">LEGEND</span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Secure Tunnel</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span>Compromised / Leak Event</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Quarantined</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Honeypot Reroute</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Column 2: Ontological Properties & Actions (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-4 h-full">
        
        {/* Node details */}
        <div className="border border-emerald-950/80 bg-slate-950/40 p-5 rounded-lg flex-1 min-h-[220px] backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-emerald-950/50 pb-2">
              <h3 className="font-display font-semibold text-xs tracking-wide text-slate-300 flex items-center gap-1.5">
                <Info className="h-4 w-4 text-indigo-400" />
                ENTITY ONTOLOGY PROPERTIES
              </h3>
            </div>

            {selectedNode ? (
              <div className="font-mono text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Object Type:</span>
                  <span className="text-indigo-400 font-bold">{selectedNode.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Human Label:</span>
                  <span className="text-slate-200">{selectedNode.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">IP Binding:</span>
                  <span className="text-slate-300">{selectedNode.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Security State:</span>
                  <span className={`font-bold ${
                    selectedNode.status === 'online' ? 'text-emerald-400' :
                    selectedNode.status === 'compromised' ? 'text-red-400 animate-pulse' :
                    selectedNode.status === 'quarantined' ? 'text-amber-500' : 'text-slate-500'
                  }`}>{selectedNode.status.toUpperCase()}</span>
                </div>

                <div className="pt-2 border-t border-slate-900 mt-3 space-y-1 text-[10px] text-slate-400">
                  <p><span className="text-slate-300 font-bold">Metadata Guard:</span> P-01 Director</p>
                  <p><span className="text-slate-300 font-bold">Group Category:</span> Sovereign_Aegis_Cluster_C</p>
                </div>

                {/* Kinetic Actions Area */}
                <div className="pt-4 border-t border-slate-900/80 mt-4 space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 block mb-1">EXECUTE KINETIC ACTIONS</p>
                  
                  {selectedNode.status === 'compromised' && (
                    <button
                      onClick={() => handleKineticAction('Initiate Deception Trap Reroute')}
                      className="w-full bg-purple-950 hover:bg-purple-900 text-purple-300 hover:text-purple-100 font-mono text-[10px] py-2 px-3 border border-purple-800 rounded tracking-wide transition-all uppercase"
                    >
                      Reroute to Honeypot
                    </button>
                  )}

                  {selectedNode.status !== 'quarantined' && selectedNode.type !== 'C2' && (
                    <button
                      onClick={() => handleKineticAction('Quarantine Node')}
                      className="w-full bg-amber-950 hover:bg-amber-900 text-amber-400 hover:text-amber-200 font-mono text-[10px] py-2 px-3 border border-amber-900/60 rounded tracking-wide transition-all uppercase"
                    >
                      Quarantine Node
                    </button>
                  )}

                  {selectedNode.status !== 'offline' && selectedNode.type !== 'C2' && (
                    <button
                      onClick={() => handleKineticAction('Isolate Host')}
                      className="w-full bg-red-950 hover:bg-red-900 text-red-400 hover:text-red-200 font-mono text-[10px] py-2 px-3 border border-red-900 rounded tracking-wide transition-all uppercase"
                    >
                      Isolate Host (Offline)
                    </button>
                  )}

                  {selectedNode.status !== 'online' && (
                    <button
                      onClick={() => handleKineticAction('Authorize ML-KEM Shield')}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-200 font-mono text-[10px] py-2 px-3 border border-slate-800 rounded tracking-wide transition-all uppercase"
                    >
                      Re-Authorize & Shield
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 font-mono text-center italic mt-12">
                Click a structural node in the graph map to pull security attributes and deploy kinetic defenses.
              </p>
            )}
          </div>
        </div>

        {/* Dynamic Link Creator form */}
        <div className="border border-emerald-950/80 bg-slate-950/40 p-4 rounded-lg backdrop-blur-sm">
          <h3 className="font-display font-semibold text-xs tracking-wide text-slate-300 flex items-center gap-1.5 mb-2 pb-1 border-b border-emerald-950/50">
            <PlusCircle className="h-4 w-4 text-emerald-400" />
            REGISTER RELATIONSHIP
          </h3>
          <form onSubmit={handleCreateLink} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] font-mono text-slate-500 mb-0.5">SOURCE ENTITY</label>
                <select
                  required
                  value={linkSource}
                  onChange={(e) => setLinkSource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 font-mono text-[10px] text-slate-300 focus:outline-none"
                >
                  <option value="">Select...</option>
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-mono text-slate-500 mb-0.5">TARGET ENTITY</label>
                <select
                  required
                  value={linkTarget}
                  onChange={(e) => setLinkTarget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 font-mono text-[10px] text-slate-300 focus:outline-none"
                >
                  <option value="">Select...</option>
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-mono text-slate-500 mb-0.5">RELATIONSHIP MODEL</label>
              <select
                value={linkType}
                onChange={(e) => setLinkType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 font-mono text-[10px] text-slate-300 focus:outline-none"
              >
                <option value="SecureTunnel">SecureTunnel</option>
                <option value="LoRa">LoRa Mesh-Net</option>
                <option value="Suspicious">Suspicious (Lateral Move)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!linkSource || !linkTarget || linkSource === linkTarget}
              className="w-full mt-1 bg-slate-900 hover:bg-slate-850 disabled:bg-slate-950 text-slate-400 disabled:text-slate-600 border border-slate-800 rounded py-1.5 text-[10px] font-mono font-bold transition-all uppercase"
            >
              Link Entities
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
