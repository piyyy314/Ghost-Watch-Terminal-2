/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AlertTriangle, KeyRound, ShieldAlert, CheckCircle, RefreshCw, Sparkles } from 'lucide-react';

interface OmegaContingencyProps {
  isWiped: boolean;
  onRestoreSystem: () => void;
}

export default function OmegaContingency({ isWiped, onRestoreSystem }: OmegaContingencyProps) {
  // Mnemonic seed words in order
  const seedWords = [
    "vortex", "neon", "carbon", "phantom", "nexus", "tactical", 
    "sierra", "pulse", "zenith", "echo", "quartz", "cobalt", 
    "cipher", "orbit", "binary", "flux", "omega", "hunter", 
    "stealth", "grid", "shadow", "vertex", "ionic", "static"
  ];

  // Randomize indices to challenge the user for restoration
  // Let's ask for indices: 0 (vortex), 2 (carbon), 16 (omega), 23 (static)
  const challengeIndices = [0, 2, 16, 23];
  
  const [answers, setAnswers] = useState<{[key: number]: string}>({
    0: '',
    2: '',
    16: '',
    23: ''
  });
  const [errorText, setErrorText] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sound/siren effect in interface during lockout
  useEffect(() => {
    if (isWiped) {
      setAnswers({0: '', 2: '', 16: '', 23: ''});
      setErrorText('');
      setSuccess(false);
    }
  }, [isWiped]);

  const handleInputChange = (idx: number, val: string) => {
    setAnswers(prev => ({ ...prev, [idx]: val.trim().toLowerCase() }));
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    // Check if answers match the correct seed words
    let isCorrect = true;
    challengeIndices.forEach((idx) => {
      if (answers[idx] !== seedWords[idx]) {
        isCorrect = false;
      }
    });

    if (isCorrect) {
      setIsRestoring(true);
      setTimeout(() => {
        setIsRestoring(false);
        setSuccess(true);
        setTimeout(() => {
          onRestoreSystem();
        }, 1500);
      }, 2000);
    } else {
      setErrorText('INVALID MNEMONIC WORD VERIFICATION. CRYO-VAULT IDENTITY FAILS INTEGRITY BINDING.');
    }
  };

  if (!isWiped) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      
      <div className="max-w-xl w-full border border-red-500 bg-slate-950 p-6 rounded-lg shadow-2xl shadow-red-950/20 relative">
        
        {/* Sirens blinking red banner */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 animate-pulse" />

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-red-950/30 border border-red-500 rounded-full animate-bounce">
            <ShieldAlert className="h-10 w-10 text-red-500" />
          </div>

          <div>
            <h2 className="font-display font-extrabold text-lg text-red-500 tracking-wider">
              OMEGA CONTINGENCY RECOVERY PORTAL
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-1">
              HARDWARE ID: <span className="text-red-400">HB-9982-AX-2026 LOCKED</span>
            </p>
          </div>

          <div className="bg-red-950/20 border border-red-900/40 rounded p-4 text-left font-mono text-[11px] leading-relaxed text-red-300">
            <p className="font-bold flex items-center gap-1.5 mb-1 text-xs">
              <AlertTriangle className="h-4 w-4" />
              TERMINAL HARD-CLEAN COMPLETED
            </p>
            Memory addresses, active socket buffers, and local cryptographic session indices have been fully purged from this segment. To re-authorize operating trust, input the geography-split mnemonic words from your metal plate Cryo-Vault seeds.
          </div>

          {/* restoration form */}
          <form onSubmit={handleVerify} className="w-full text-left space-y-4 pt-2">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              
              <div>
                <label className="block text-slate-400 mb-1.5 uppercase text-[9px]">Word #1 (Starts with 'v')</label>
                <input
                  required
                  type="text"
                  placeholder="vortex"
                  value={answers[0]}
                  onChange={(e) => handleInputChange(0, e.target.value)}
                  className="w-full bg-slate-900 border border-red-900 rounded p-2 text-xs text-red-400 placeholder-red-900/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 uppercase text-[9px]">Word #3 (Starts with 'c')</label>
                <input
                  required
                  type="text"
                  placeholder="carbon"
                  value={answers[2]}
                  onChange={(e) => handleInputChange(2, e.target.value)}
                  className="w-full bg-slate-900 border border-red-900 rounded p-2 text-xs text-red-400 placeholder-red-900/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 uppercase text-[9px]">Word #17 (Starts with 'o')</label>
                <input
                  required
                  type="text"
                  placeholder="omega"
                  value={answers[16]}
                  onChange={(e) => handleInputChange(16, e.target.value)}
                  className="w-full bg-slate-900 border border-red-900 rounded p-2 text-xs text-red-400 placeholder-red-900/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 uppercase text-[9px]">Word #24 (Starts with 's')</label>
                <input
                  required
                  type="text"
                  placeholder="static"
                  value={answers[23]}
                  onChange={(e) => handleInputChange(23, e.target.value)}
                  className="w-full bg-slate-900 border border-red-900 rounded p-2 text-xs text-red-400 placeholder-red-900/40 focus:outline-none"
                />
              </div>

            </div>

            {errorText && (
              <p className="text-[10px] font-mono text-red-400 text-center bg-red-950/40 border border-red-900/40 p-2 rounded">
                {errorText}
              </p>
            )}

            {success ? (
              <div className="bg-emerald-950/40 border border-emerald-900 p-3 rounded text-center text-emerald-300 font-mono text-xs flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                CRYO-VAULT CRYPTOGRAPHIC RESTORE SUCCESSFUL. RE-AUTHORIZING TERMINAL LOGIC...
              </div>
            ) : (
              <button
                type="submit"
                disabled={isRestoring}
                className="w-full bg-red-950 hover:bg-red-900 disabled:bg-slate-900 text-red-400 disabled:text-slate-600 font-mono text-xs font-bold py-3 border border-red-800 disabled:border-slate-950 rounded shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isRestoring ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    RECONSTRUCTING CRYPTOGRAPHIC VAULT...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    RELOAD CRYO-VAULT IDENTITY
                  </>
                )}
              </button>
            )}

          </form>

          {/* Hint disclosure */}
          <div className="pt-2">
            <p className="text-[9px] font-mono text-slate-600 max-w-sm">
              Hint: Challenge words are taken from the BIP39 seed splits. Required answers: #1 = vortex, #3 = carbon, #17 = omega, #24 = static
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
