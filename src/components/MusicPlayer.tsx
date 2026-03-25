import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Track } from '../types';
import { DUMMY_TRACKS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="w-full max-w-md bg-black border-2 border-[#00ffff] p-6 shadow-[8px_8px_0_#ff00ff]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-6 mb-8">
        <div className="relative w-24 h-24 flex-shrink-0 pixel-border p-1 bg-black">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentTrack.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover grayscale contrast-125"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          {isPlaying && (
            <div className="absolute -bottom-2 -right-2 flex gap-1 bg-black p-1 border border-cyan-400">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={{ height: [2, 10, 2] }}
                  transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.1 }}
                  className="w-1.5 bg-magenta-500"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-pixel text-white truncate mb-1 glitch-text" data-text={currentTrack.title}>{currentTrack.title}</h3>
          <p className="text-cyan-400 text-xs font-mono truncate uppercase tracking-widest">ENCODER: {currentTrack.artist}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative h-4 w-full bg-black border border-cyan-400/30 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-cyan-400"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-white mix-blend-difference">
            STREAM_PROGRESS: {Math.round(progress)}%
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button className="p-2 text-cyan-400 hover:text-white transition-colors">
            <Volume2 size={18} />
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              className="pixel-button !p-2"
            >
              <SkipBack size={18} fill="currentColor" />
            </button>

            <button
              onClick={togglePlay}
              className="pixel-button !p-4 !bg-cyan-400 !text-black"
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>

            <button
              onClick={handleNext}
              className="pixel-button !p-2"
            >
              <SkipForward size={18} fill="currentColor" />
            </button>
          </div>

          <div className="w-8" />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
