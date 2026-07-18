"use client";

import React, { useEffect, useState } from "react";
import { useAudio } from "../lib/AudioContext";

interface LoadingScreenProps {
  onEnter: () => void;
}

export default function LoadingScreen({ onEnter }: LoadingScreenProps) {
  const { togglePlay } = useAudio();
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Smooth loading progression
  useEffect(() => {
    let start = 0;
    const duration = 2000; // 2 seconds
    const intervalTime = 30;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      start += step + Math.random() * 3;
      if (start >= 100) {
        setProgress(100);
        setIsLoaded(true);
        clearInterval(timer);
      } else {
        setProgress(Math.floor(start));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const handleEnterClick = () => {
    setIsExiting(true);
    // Initialize audio node graph on user gesture to obey autoplay policies
    togglePlay();

    setTimeout(() => {
      onEnter();
    }, 1000); // 1s exit fade out
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center bg-bg-primary text-text-primary transition-all duration-1000 ${
        isExiting ? "opacity-0 blur-md scale-[1.02]" : "opacity-100 blur-0 scale-100"
      }`}
      style={{ pointerEvents: isExiting ? "none" : "all" }}
    >
      {/* Spacer atas: 35% layar agar konten berada di zona nyaman jempol */}
      <div className="flex-[2]" />

      <div className="flex flex-col items-center gap-8 max-w-sm text-center px-6">
        {/* Typographic Logo */}
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-3xl tracking-[0.25em] uppercase text-text-primary">
            Pare
          </h1>
          <p className="text-[10px] tracking-[0.4em] uppercase text-text-secondary opacity-70">
            Two Months. One Story.
          </p>
        </div>

        {/* Counter or Button */}
        <div className="h-16 flex items-center justify-center">
          {!isLoaded ? (
            <div className="font-serif text-xl tracking-widest text-text-secondary opacity-80 select-none">
              {String(progress).padStart(3, "0")}
            </div>
          ) : (
            <button
              onClick={handleEnterClick}
              className="px-10 py-3 border-b border-text-primary text-[11px] tracking-[0.2em] uppercase text-text-primary transition-all duration-300 hover:opacity-60 active:scale-95 cursor-pointer"
            >
              Begin Journey
            </button>
          )}
        </div>
      </div>

      {/* Spacer bawah lebih kecil agar konten sedikit ke atas dari tengah */}
      <div
        className="flex-[3]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      />
    </div>
  );
}
