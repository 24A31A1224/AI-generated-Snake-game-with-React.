import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Music, Gamepad2, Trophy, Terminal } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#000000] text-[#00ffff] font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      {/* CRT Overlay Effects */}
      <div className="scanline" />
      <div className="absolute inset-0 neon-grid pointer-events-none opacity-20" />
      
      {/* Header */}
      <header className="relative z-10 px-8 py-6 flex justify-between items-center border-b-2 border-[#00ffff] bg-black">
        <div className="flex items-center gap-4 tear">
          <div className="w-12 h-12 bg-[#00ffff] flex items-center justify-center shadow-[4px_4px_0_#ff00ff]">
            <Gamepad2 className="text-black" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-pixel tracking-tighter uppercase glitch-text" data-text="NEON_SNAKE.EXE">NEON_SNAKE.EXE</h1>
            <p className="text-xs text-magenta-400 font-mono tracking-[0.3em] uppercase opacity-70">SYSTEM_STATUS: OPERATIONAL</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 px-6 py-3 bg-black border-2 border-[#00ffff] shadow-[4px_4px_0_#ff00ff]">
            <Trophy size={20} className="text-magenta-400" />
            <span className="font-digital text-xl tracking-[0.2em] uppercase">
              DATA_COLLECTED: <span className="text-white font-black glitch-text inline-block min-w-[3ch]" data-text={score}>{score}</span>
            </span>
          </div>
          <div className="hidden md:flex flex-col items-end font-mono text-[10px] text-gray-500 uppercase">
            <span>[SESSION_ID: 0x495282454213]</span>
            <span>[USER: kavyasankuru@gmail.com]</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center justify-center gap-16">
        {/* Left Side - System Logs */}
        <div className="hidden xl:flex flex-col gap-8 w-72">
          <div className="p-6 bg-black border-2 border-[#00ffff] shadow-[4px_4px_0_#ff00ff]">
            <div className="flex items-center gap-2 mb-4 border-b border-[#00ffff]/30 pb-2">
              <Terminal size={14} />
              <h4 className="text-xs font-pixel uppercase tracking-widest">LOG_STREAM</h4>
            </div>
            <div className="space-y-2 text-[11px] font-mono text-cyan-400/80 uppercase">
              <p className="flex gap-2"><span className="text-magenta-500">[OK]</span> INITIALIZING_CORE...</p>
              <p className="flex gap-2"><span className="text-magenta-500">[OK]</span> LOADING_AUDIO_DRIVERS...</p>
              <p className="flex gap-2"><span className="text-magenta-500">[OK]</span> SYNCING_NEURAL_INTERFACE...</p>
              <p className="flex gap-2 animate-pulse"><span className="text-white">&gt;</span> AWAITING_INPUT_COMMANDS</p>
            </div>
          </div>
          
          <div className="p-4 bg-magenta-500/10 border border-magenta-500 text-[10px] font-pixel leading-relaxed">
            WARNING: PROLONGED EXPOSURE TO THE GRID MAY RESULT IN TEMPORAL DISPLACEMENT.
          </div>
        </div>

        {/* Center - Game Interface */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-shrink-0 relative"
        >
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-[#ff00ff]" />
          <div className="absolute -top-4 -right-4 w-8 h-8 border-t-4 border-r-4 border-[#ff00ff]" />
          <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-4 border-l-4 border-[#ff00ff]" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-[#ff00ff]" />
          
          <SnakeGame onScoreChange={setScore} />
        </motion.div>

        {/* Right Side - Audio Module */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-4 px-2">
            <Music size={16} className="text-magenta-400" />
            <span className="text-xs font-pixel text-cyan-400 uppercase tracking-widest glitch-text" data-text="AUDIO_MODULE_v4.0">AUDIO_MODULE_v4.0</span>
          </div>
          <div className="pixel-border p-1 bg-[#ff00ff]/20">
            <MusicPlayer />
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full px-8 py-4 flex justify-between items-center text-[10px] font-mono text-gray-600 uppercase tracking-[0.2em] border-t border-[#00ffff]/10">
        <span className="tear">SYSTEM_CLOCK: {new Date().toISOString()}</span>
        <div className="flex gap-6">
          <span className="hover:text-[#00ffff] cursor-pointer transition-colors">[PROTOCOL_X]</span>
          <span className="hover:text-[#ff00ff] cursor-pointer transition-colors">[ENCRYPT_DATA]</span>
        </div>
      </footer>
    </div>
  );
}
