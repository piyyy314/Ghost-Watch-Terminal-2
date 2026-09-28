/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { KeyRound, ShieldAlert, CheckCircle, RefreshCw, Zap, Binary, Lock, Unlock } from 'lucide-react';
import { PqcKeyState } from '../types';

interface PqcPanelProps {
  keyState: PqcKeyState;
  onRotateKeys: () => void;
  onAddLog: (event: string, severity: 'low' | 'medium' | 'high' | 'critical') => void;
}

export default function PqcPanel({ keyState, onRotateKeys, onAddLog }: PqcPanelProps) {
  const [isRotating, setIsRotating] = useState(false);
  const [encryptMessage, setEncryptMessage] = useState('COMS_CHANNEL_01_SECURE');
  const [sessionKey, setSessionKey] = useState('');
  const [cipherText, setCipherText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [cryptoStage, setCryptoStage] = useState<'idle' | 'encapsulated' | 'decrypted'>('idle');

  const handleRotate = () => {
    if (isRotating) return;
    setIsRotating(true);
    onAddLog('PQC Crypto Matrix: Launching key rotation cycle across KEM-768 & DSA-65 registers...', 'medium');

    setTimeout(() => {
      onRotateKeys();
      setIsRotating(false);
      onAddLog('PQC Crypto Matrix: Securely rotated NIST FIPS 203/204/205 operational credentials.', 'medium');
    }, 1500);
  };

  const handleEncapsulate = () => {
    if (!encryptMessage.trim()) return;

    // Simulate ML-KEM-768 encapsulation
    const seedBytes = encryptMessage + keyState.publicKeyFingerprint;
    
    // Simple custom hash simulations to represent AES-256-GCM hex outputs
    let hashedSecret = '';
    for (let i = 0; i < seedBytes.length; i++) {
      hashedSecret += seedBytes.charCodeAt(i).toString(16);
    }
    const derivedKey = 'AES_GCM_256_' + hashedSecret.substring(0, 32).toUpperCase();
    const mockCipher = 'CT_MLKEM_768_0x' + hashedSecret.substring(20, 64).toLowerCase();

    setSessionKey(derivedKey);
    setCipherText(mockCipher);
    setDecryptedText('');
    setCryptoStage('encapsulated');
    onAddLog(`ML-KEM-768: Encapsulated peer session secret. Generated ephemeral key: ${derivedKey.substring(0, 15)}...`, 'low');
  };

  const handleDecapsulate = () => {
    // Restore and verify signature
    setDecryptedText(encryptMessage);
    setCryptoStage('decrypted');
    onAddLog('ML-DSA-65: Verified FIPS 204 signature successfully. Payload decrypted and authenticated.', 'low');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-1">
      
      {/* Column 1: Crypto Matrices (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        <div className="border border-emerald-950/80 bg-slate-950/40 p-5 rounded-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4 border-b border-emerald-950/50 pb-2">
            <h2 className="font-display font-semibold text-sm tracking-wide text-emerald-400 flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-emerald-500 animate-pulse" />
              NIST FIPS POST-QUANTUM CRYPTO MATRIX
            </h2>
            <button
              onClick={handleRotate}
              disabled={isRotating}
              className="bg-emerald-950 hover:bg-emerald-900 disabled:bg-slate-900 text-emerald-300 disabled:text-slate-600 font-mono text-[10px] py-1.5 px-3 border border-emerald-800 disabled:border-slate-950 rounded flex items-center gap-1.5 transition-all uppercase font-bold"
            >
              <RefreshCw className={`h-3 w-3 ${isRotating ? 'animate-spin' : ''}`} />
              {isRotating ? 'ROTATING...' : 'ROTATE CIPHER SUITES'}
            </button>
          </div>

          <p className="text-xs text-slate-300 font-sans mb-4 leading-relaxed">
            The transition to post-quantum standards protects local credentials from "harvest now, decrypt later" attacks. Ephemeral sessions employ hybrid ML-KEM key exchanges and classical ECDH derivations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[11px] mb-4">
            
            <div className="bg-slate-900/50 p-3.5 rounded border border-slate-850">
              <div className="flex justify-between mb-1 text-slate-400">
                <span>KEM (FIPS 203)</span>
                <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>
              <p className="text-slate-200 text-xs font-bold">{keyState.kemAlgorithm}</p>
              <span className="text-[9px] text-slate-500 block mt-1">Key encapsulation</span>
            </div>

            <div className="bg-slate-900/50 p-3.5 rounded border border-slate-850">
              <div className="flex justify-between mb-1 text-slate-400">
                <span>DSS (FIPS 204)</span>
                <span className="text-teal-400 font-bold">ACTIVE</span>
              </div>
              <p className="text-slate-200 text-xs font-bold">{keyState.dsaAlgorithm}</p>
              <span className="text-[9px] text-slate-500 block mt-1">Digital signatures</span>
            </div>

            <div className="bg-slate-900/50 p-3.5 rounded border border-slate-850">
              <div className="flex justify-between mb-1 text-slate-400">
                <span>L-TRM (FIPS 205)</span>
                <span className="text-indigo-400 font-bold">ACTIVE</span>
              </div>
              <p className="text-slate-200 text-xs font-bold">{keyState.slhAlgorithm}</p>
              <span className="text-[9px] text-slate-500 block mt-1">Root of trust protection</span>
            </div>

          </div>

          <div className="bg-slate-950 p-4 rounded border border-emerald-950 font-mono text-xs space-y-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide border-b border-slate-900 pb-1.5 mb-2">
              ACTIVE CRYPTOGRAPHIC KEY FINGERPRINTS
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]">
              <div>
                <span className="text-slate-500 block uppercase text-[9px]">PUBLIC KEY REPOSITORIES (ML-KEM)</span>
                <span className="text-slate-300 block bg-slate-900 p-2 rounded border border-slate-850 font-bold select-all overflow-x-auto whitespace-nowrap">
                  {isRotating ? 'Regenerating...' : keyState.publicKeyFingerprint}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase text-[9px]">PRIVATE KEY REPOSITORIES (ML-DSA)</span>
                <span className="text-slate-300 block bg-slate-900 p-2 rounded border border-slate-850 font-bold select-all overflow-x-auto whitespace-nowrap">
                  {isRotating ? 'Regenerating...' : keyState.privateKeyFingerprint}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-[10px] text-slate-500 pt-1.5">
              <span>Last cycled: {keyState.lastRotated}</span>
              <span>Total Session Key derivations: {keyState.sessionCount}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Column 2: Key Exchange Simulator (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        <div className="border border-emerald-950/80 bg-slate-950/40 p-5 rounded-lg backdrop-blur-sm flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-emerald-950/50 pb-2">
              <h2 className="font-display font-semibold text-sm tracking-wide text-indigo-400 flex items-center gap-2">
                <Binary className="h-4 w-4" />
                SECURE HYBRID KEY EXCHANGE SIMULATOR
              </h2>
            </div>

            <p className="text-xs text-slate-300 font-sans mb-4 leading-relaxed">
              Test the speed-of-light key encapsulation mechanism. Input a custom channel or command, and observe the quantum-resistant payload encapsulation.
            </p>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase mb-1">DATA CHANNELS PAYLOAD</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={encryptMessage}
                    onChange={(e) => setEncryptMessage(e.target.value)}
                    placeholder="e.g., COMS_CHANNEL_01_SECURE"
                    className="flex-1 bg-slate-950 border border-emerald-950 rounded p-2 text-xs text-emerald-400 focus:outline-none"
                  />
                  <button
                    onClick={handleEncapsulate}
                    className="bg-indigo-950 hover:bg-indigo-900 text-indigo-300 hover:text-indigo-100 font-mono text-[10px] px-3 rounded border border-indigo-950/60 uppercase font-bold"
                  >
                    Encapsulate
                  </button>
                </div>
              </div>

              {cryptoStage !== 'idle' && (
                <div className="space-y-3 bg-slate-950/80 p-3 rounded border border-slate-900 text-[10px] space-y-2.5">
                  <div>
                    <span className="text-slate-500 block uppercase text-[9px] flex items-center gap-1">
                      <Lock className="h-3 w-3 text-indigo-400" />
                      EPHEMERAL SYMMETRIC SESSION KEY (HKDF-SHA256)
                    </span>
                    <span className="text-emerald-300 font-bold block bg-slate-900 p-1.5 rounded border border-slate-850 mt-1 select-all overflow-x-auto whitespace-nowrap">
                      {sessionKey}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block uppercase text-[9px] flex items-center gap-1">
                      <Binary className="h-3 w-3 text-indigo-400" />
                      ENCRYPTED CIPHERTEXT PAYLOAD (AES-255-GCM ENCRYPTED)
                    </span>
                    <span className="text-slate-300 block bg-slate-900 p-1.5 rounded border border-slate-850 mt-1 select-all overflow-x-auto whitespace-nowrap">
                      {cipherText}
                    </span>
                  </div>

                  {cryptoStage === 'encapsulated' && (
                    <button
                      onClick={handleDecapsulate}
                      className="w-full bg-slate-900 hover:bg-slate-850 text-indigo-400 border border-slate-800 rounded py-1.5 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1"
                    >
                      <Unlock className="h-3.5 w-3.5" />
                      Decapsulate & Verify Signatures (ML-DSA)
                    </button>
                  )}

                  {cryptoStage === 'decrypted' && (
                    <div className="bg-emerald-950/35 border border-emerald-900/50 p-2 rounded text-emerald-300">
                      <p className="font-bold flex items-center gap-1 text-[11px] mb-0.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                        DECRYPTION INTEGRITY VERIFIED
                      </p>
                      Original message: <span className="underline font-bold text-slate-200">{decryptedText}</span>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
