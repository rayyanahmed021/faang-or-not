'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

type ResumeData = {
  id: number;
  resume_link: string;
  is_faang: boolean;
  company_name: string;
  location: string;
};

export default function FaangQuiz() {
  const [gameQueue, setGameQueue] = useState<ResumeData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'start' | 'loading' | 'playing' | 'feedback' | 'finished'>('start');
  const [lastGuessCorrect, setLastGuessCorrect] = useState<boolean>(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  // Inside your FaangQuiz component, add these new states:
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset zoom when the profile changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  const handleZoom = (delta: number) => {
    setScale((prev) => Math.min(Math.max(prev + delta, 1), 3)); // Limit zoom between 1x and 3x
  };

  // Panning Logic
  const onMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const onMouseUp = () => setIsDragging(false);

  async function fetchQuiz() {
    setGameState('loading');
    try {
      const res = await fetch('/api/quiz');
      const data = await res.json();
      setGameQueue(data);
      setCurrentIndex(0);
      setStats({ correct: 0, incorrect: 0 });
      setScore(0);
      setGameState('playing');
    } catch (error) {
      setGameState('start');
      console.error("Failed to fetch", error);
    }
  }

  const handleGuess = (guessFaang: boolean) => {
    const currentResume = gameQueue[currentIndex];
    const isCorrect = currentResume.is_faang === guessFaang;
    setStats((prev) => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect,
    }));
    setLastGuessCorrect(isCorrect);
    setGameState('feedback');
  };

  const handleNext = () => {
    if (currentIndex < 4) {
      setCurrentIndex((prev) => prev + 1);
      setGameState('playing');
    } else {
      setGameState('finished');
    }
  };

  if (gameState === 'start') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f172a] p-6">
        {/* Outer Frame - Matching your game aesthetics */}
        <div className="relative bg-slate-800 rounded-[2.5rem] p-2 shadow-2xl border border-white/5 w-full max-w-xl animate-in fade-in zoom-in duration-700">
          <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-10 text-center border border-white/10 relative overflow-hidden">

            {/* Background Glow Decoration */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 blur-[80px] rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/20 blur-[80px] rounded-full" />

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="bg-indigo-600 text-white px-2 py-1 rounded-md font-black text-sm tracking-tighter">FAANG</span>
                <span className="text-white font-bold text-2xl tracking-tighter uppercase">Resume Screening</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight uppercase">
                Spot the <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Talent</span>
              </h1>

              <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-sm mx-auto">
                Every profile in this simulation belongs to a real SWE intern. Analyze the experience. Make the call. Think you have what it takes?
              </p>

              <button
                onClick={fetchQuiz}
                className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-xl hover:bg-indigo-50 transition-all active:scale-95 shadow-2xl shadow-white/10 flex items-center justify-center gap-3 group"
              >
                START SCREENING
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <p className="mt-8 text-[11px] text-slate-500 font-medium uppercase tracking-[0.2em] leading-relaxed">
                Note: Many legendary founders and engineers were rejected multiple times.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'loading') {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0f172a] text-white">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-medium animate-pulse">Sourcing Resumes...</p>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f172a] p-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-10 text-center shadow-2xl">
          <h1 className="text-4xl font-black text-white mb-2">Final Score</h1>
          <div className="text-8xl font-black bg-gradient-to-br from-indigo-400 to-cyan-400 bg-clip-text text-transparent my-6">
            {stats.correct}/5
          </div>
          <p className="text-indigo-200 text-lg mb-8">
            {stats.correct === 5 ? "Elite Resume Reviwer! 🏆" : "Keep Reviewing Resumes! 🔍"}
          </p>
          <button
            onClick={fetchQuiz}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const currentItem = gameQueue[currentIndex];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="w-full border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white p-1 rounded font-black text-xs">FAANG</span>
            <span className="font-bold tracking-tighter text-xl text-white uppercase">or Fake</span>
          </div>

          {/* LIVE STATS COUNTER */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-sm font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                <span className="text-emerald-400">{stats.correct}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
                <span className="text-rose-400">{stats.incorrect}</span>
              </div>
            </div>

            <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <div className="h-2 w-24 bg-white/10 rounded-full overflow-hidden hidden md:block">
                <div
                  className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                  style={{ width: `${((currentIndex + 1) / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs font-black text-indigo-400 tabular-nums">
                {currentIndex + 1} / 5
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-10">

        {/* Left Column: The Resume */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
          <div className="relative group bg-slate-800 rounded-3xl p-2 shadow-2xl border border-white/5 h-[65vh] lg:h-[75vh] flex flex-col overflow-hidden">

            {/* Floating Zoom Controls */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
              <button
                onClick={() => handleZoom(0.25)}
                className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center border border-white/10 transition-all"
              >
                ➕
              </button>
              <button
                onClick={() => handleZoom(-0.25)}
                className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center border border-white/10 transition-all"
              >
                ➖
              </button>
              <button
                onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }}
                className="bg-indigo-600/80 backdrop-blur-md hover:bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center border border-white/10 transition-all text-xs font-bold"
              >
                RESET
              </button>
            </div>

            {/* Image Container */}
            <div
              className={`bg-[#f8fafc] rounded-2xl h-full overflow-hidden relative isolate ${scale > 1 ? 'cursor-grab' : 'cursor-default'} ${isDragging ? 'cursor-grabbing' : ''}`}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            >
              <div
                className="w-full h-full transition-transform duration-200 ease-out flex items-center justify-center"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: 'center'
                }}
              >
                <img
                  src={currentItem.resume_link}
                  alt="Resume"
                  className="w-full h-full object-contain p-4 select-none pointer-events-none"
                />
              </div>

              {/* Correct/Wrong Overlay Badge - Hidden when zoomed in to avoid clutter */}
              {gameState === 'feedback' && scale === 1 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-300 z-10">
                  <div className={`text-6xl font-black py-4 px-10 rounded-2xl border-4 rotate-[-10deg] shadow-2xl animate-in zoom-in duration-300 ${currentItem.is_faang ? 'bg-green-500 border-green-300 text-white' : 'bg-red-500 border-red-300 text-white'}`}>
                    {currentItem.is_faang ? 'HIRED' : 'REJECTED'}
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-center text-slate-500 text-xs">
            {scale > 1 ? "Click and drag to pan" : "Use + / - to inspect details"}
          </p>
        </div>

        {/* Right Column: Interaction Area */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-center">
          {gameState === 'playing' ? (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl justify-center p-8 relative animate-in">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tight">The Verdict?</h2>
                <p className="text-slate-400">Analyze the experience and tech stack. Did this candidate clear the FAANG bar?</p> <br />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => handleGuess(true)}
                  className="group relative flex items-center justify-between bg-emerald-500 hover:bg-emerald-400 text-white p-6 rounded-2xl font-black text-xl transition-all active:scale-[0.98] shadow-xl shadow-emerald-500/20"
                >
                  <span>FAANG YES</span>
                  <span className="text-2xl group-hover:translate-x-1 transition-transform">🚀</span>
                </button>

                <button
                  onClick={() => handleGuess(false)}
                  className="group relative flex items-center justify-between bg-rose-500 hover:bg-rose-400 text-white p-6 rounded-2xl font-black text-xl transition-all active:scale-[0.98] shadow-xl shadow-rose-500/20"
                >
                  <span>NOT QUITE</span>
                  <span className="text-2xl group-hover:translate-x-1 transition-transform">❌</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8 animate-in zoom-in-95 duration-300">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 text-4xl shadow-inner ${lastGuessCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {lastGuessCorrect ? '✓' : '✕'}
                </div>
                <h3 className={`text-3xl font-black ${lastGuessCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {lastGuessCorrect ? 'Eagle Eye!' : 'Tricked You!'}
                </h3>
              </div>
              {
                currentItem.company_name != null ?
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/5 space-y-1 flex flex-col items-center text-center">
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Confirmed Career</p>
                    <p className="text-2xl font-black text-white">{currentItem.company_name}</p>
                    <p className="text-slate-400 font-medium">{currentItem.location}</p>
                  </div> : <></>
              }

              <button
                onClick={handleNext}
                className="w-full bg-white text-slate-900 py-4 rounded-xl font-black text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2 group"
              >
                {currentIndex < 4 ? 'Next Profile' : 'View Results'}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}