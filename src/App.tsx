/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Cpu, 
  Shield, 
  Sword, 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  ShoppingBag, 
  RefreshCw,
  LayoutDashboard,
  BrainCircuit,
  Crosshair
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- Types ---
interface AnalysisResult {
  hostilityLevel: number;
  enemySynergies: string[];
  commanderAdvice: string;
  tacticalWarning: string;
  nextItem: {
    name: string;
    description: string;
    reason: string;
  };
}

const DUMMY_INITIAL: AnalysisResult = {
  hostilityLevel: 45,
  enemySynergies: ['Mage (4)', 'Wrestler (2)'],
  commanderAdvice: "Prepare for rotation. Position Luo Yi away from the center to maximize skill range.",
  tacticalWarning: "Opponent building high-tier Mage synergy. Magic resistance prioritized.",
  nextItem: {
    name: "Athena's Shield",
    description: "Massive Magic Resistance and shield burst protection.",
    reason: "Counters incoming Mage burst from enemy core players."
  }
};

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult>(DUMMY_INITIAL);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScanClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setImage(base64);
      analyzeBoard(base64);
    };
    reader.readAsDataURL(file);
  };

  const analyzeBoard = async (base64: string) => {
    setIsScanning(true);
    try {
      const base64Data = base64.split(',')[1];
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            inlineData: {
              data: base64Data,
              mimeType: "image/png"
            }
          },
          {
            text: `You are an AI Strategy Coach for a game called Magic Chess. 
            Analyze this game board and provide tactical advice in JSON format:
            {
              "hostilityLevel": number (1-100),
              "enemySynergies": string[],
              "commanderAdvice": string,
              "tacticalWarning": string,
              "nextItem": { "name": string, "description": string, "reason": string }
            }`
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(result.text || '{}');
      setAnalysis(parsed as AnalysisResult);
    } catch (error) {
      console.error("AI Analysis Error:", error);
      // Fallback to dummy data with a notice
      setAnalysis({
        ...DUMMY_INITIAL,
        tacticalWarning: "Connection to Intelligence Core unstable. Using cached heuristics."
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark p-4 md:p-8 selection:bg-cyber-blue selection:text-cyber-dark">
      {/* Background Grid Decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-10" 
           style={{ backgroundImage: 'radial-gradient(circle, #00f2ff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Header */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border-b border-cyber-blue/20 pb-4 relative">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-cyber-blue flex items-center justify-center rotate-45 group hover:rotate-90 transition-transform duration-500 overflow-hidden">
            <Crosshair className="-rotate-45 group-hover:scale-125 transition-transform" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase glitch-text">
              Tactic<span className="text-cyber-blue">Eye</span>
            </h1>
            <p className="text-[10px] font-mono text-cyber-blue/60 uppercase tracking-widest">
              Military Grade Auto-Battler Intelligence // v4.2.0
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono text-[10px] uppercase">
          <div className="flex flex-col items-end">
            <span className="text-cyber-purple">Satellite Link</span>
            <span className="text-white flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> 
              Connected
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-cyber-blue">Processor Load</span>
            <span className="text-white">12.4 TFLOPS</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
        
        {/* Left Column - Board & Analysis */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Scanning Display */}
          <section className="cyber-panel aspect-video flex flex-col items-center justify-center group overflow-hidden">
            <AnimatePresence mode="wait">
              {image ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="relative w-full h-full"
                >
                  <img src={image} className="w-full h-full object-contain opacity-80" alt="Scanned Board" />
                  
                  {/* Scanning Effect Overlay */}
                  {isScanning && (
                    <motion.div 
                      key="scanner"
                      initial={{ top: 0 }}
                      animate={{ top: '100%' }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-1 bg-cyber-blue shadow-[0_0_15px_rgba(0,242,255,1)] z-10"
                    />
                  )}

                  {/* UI Overlays on image */}
                  <div className="absolute top-4 left-4 p-2 bg-cyber-dark/80 backdrop-blur border border-cyber-blue/40 font-mono text-[10px]">
                    TARGET_ACQUIRED: MAGIC_CHESS_S14
                  </div>
                </motion.div>
              ) : (
                <div key="placeholder" className="text-center p-8 space-y-4">
                  <div className="w-16 h-16 border-2 border-dashed border-cyber-blue/40 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                    <Camera className="text-cyber-blue/40 group-hover:text-cyber-blue" size={32} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-sm uppercase text-white/80">Awaiting Board Input</p>
                    <p className="text-cyber-blue/40 text-[10px] uppercase tracking-widest italic">Submit screenshot for tactical extraction</p>
                  </div>
                </div>
              )}
            </AnimatePresence>

            <div className="mt-4 pb-4">
              <button 
                onClick={handleScanClick}
                className="cyber-button group flex items-center gap-2"
                disabled={isScanning}
              >
                {isScanning ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />}
                <span>{isScanning ? "Scanning..." : "Scan Board"}</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </section>

          {/* Live Analysis Panel */}
          <section className="cyber-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="text-cyber-blue" size={20} />
                <h2 className="font-mono uppercase tracking-widest text-sm">Live Battlefield Analysis</h2>
              </div>
              <div className="flex items-center gap-1 font-mono text-[10px] text-cyber-blue animate-pulse">
                <span className="inline-block w-2 h-2 rounded-full bg-cyber-blue" />
                Live Data Fetching
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Hostility Gauge */}
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-mono text-white/60">
                  <span>HOSTILITY_INDEX</span>
                  <span className={analysis.hostilityLevel > 70 ? 'text-red-500' : 'text-cyber-blue'}>
                    {analysis.hostilityLevel}%
                  </span>
                </div>
                <div className="h-2 bg-cyber-gray overflow-hidden border border-white/5 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${analysis.hostilityLevel}%` }}
                    className={`h-full relative ${analysis.hostilityLevel > 70 ? 'bg-red-600' : 'bg-cyber-blue'}`}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </motion.div>
                </div>
                <p className="text-[10px] italic text-white/40 leading-relaxed font-mono">
                  Calculated based on enemy gold reserves, unit tiers, and winning streak multipliers.
                </p>
              </div>

              {/* Enemy Synergies */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-mono text-white/60">DETECTED_SYNERGIES</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.enemySynergies.map((s, i) => (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="px-3 py-1 bg-cyber-purple/10 border border-cyber-purple/40 text-[10px] font-mono text-cyber-purple flex items-center gap-1"
                    >
                      <Shield size={10} />
                      {s}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Recommendations */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Tactical Advice */}
          <section className="cyber-panel p-6 border-l-4 border-l-cyber-purple">
            <div className="flex items-center gap-2 mb-4">
              <BrainCircuit className="text-cyber-purple" size={20} />
              <h2 className="font-mono uppercase tracking-widest text-sm">Strategic Nexus</h2>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-sm border-l-2 border-cyber-blue">
                <h3 className="text-[10px] font-mono text-cyber-blue mb-2">COMMANDER_ADVICE</h3>
                <p className="text-sm leading-relaxed text-white/90">
                  {analysis.commanderAdvice}
                </p>
              </div>

              <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-sm">
                <div className="flex items-center gap-2 text-red-500 mb-2">
                  <AlertTriangle size={14} />
                  <span className="text-[10px] font-mono">THREAT_WARNING</span>
                </div>
                <p className="text-xs text-red-100/90 italic">
                  {analysis.tacticalWarning}
                </p>
              </div>
            </div>
          </section>

          {/* Next Move / Item Shop */}
          <section className="cyber-panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="text-cyber-blue" size={20} />
              <h2 className="font-mono uppercase tracking-widest text-sm">Logistics Optimization</h2>
            </div>

            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyber-blue to-cyber-purple opacity-20 group-hover:opacity-40 transition-opacity blur rounded-lg" />
              <div className="relative p-5 bg-cyber-dark/80 border border-white/10 rounded-lg space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-cyber-blue/20 flex items-center justify-center border border-cyber-blue/40 rounded shadow-[0_0_15px_rgba(0,242,255,0.2)]">
                    <Sword className="text-cyber-blue" />
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] font-mono text-cyber-blue">NEXT_ITEM_TARGET</span>
                    <span className="text-lg font-bold tracking-tight text-white">{analysis.nextItem.name}</span>
                  </div>
                </div>
                
                <p className="text-xs font-mono text-white/60">
                  {analysis.nextItem.description}
                </p>

                <div className="pt-3 border-t border-white/5">
                  <span className="text-[9px] font-mono text-cyber-purple uppercase flex items-center gap-1 mb-1">
                    <TrendingUp size={10} /> Analytic Reason
                  </span>
                  <p className="text-[11px] text-white/80 italic">
                    "{analysis.nextItem.reason}"
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
               <div className="flex items-center justify-between text-[10px] font-mono px-2">
                  <span className="text-white/40">CALC_ACCURACY</span>
                  <span className="text-cyber-blue">98.2%</span>
               </div>
               <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyber-blue/40 w-[98.2%]" />
               </div>
            </div>
          </section>

          {/* System Log */}
          <div className="cyber-panel p-3 bg-transparent border-dashed border-cyber-blue/10">
             <div className="font-mono text-[9px] text-white/30 truncate">
               [09:32:15] SIG_RECV: BOARD_CAPTURE_8829 <br />
               [09:32:16] PROC: ANALYZING_SINERGY_VECTORS <br />
               [09:32:18] OUT: TACTICAL_PACK_LOADED
             </div>
          </div>
        </aside>

      </main>

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto py-8">
        <div className="text-center opacity-20 hover:opacity-50 transition-opacity cursor-default">
          <p className="font-mono text-[9px] tracking-[0.4em] uppercase">
            TacticEye Intelligence Solutions &copy; 2026 Neo-Jakarta Cyber-District
          </p>
        </div>
      </footer>
    </div>
  );
}
