"use client";

import React, { useState } from "react";
import { useAudio } from "../lib/AudioContext";
import { Play, Pause, SkipForward, SkipBack, X } from "lucide-react";

/* ─── Vinyl Record SVG ────────────────────────────────────────── */
function VinylRecord({ spinning }: { spinning: boolean }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{
        animation: spinning ? "vinylSpin 3s linear infinite" : "none",
        transformOrigin: "center center",
      }}
    >
      {/* Outer disc — dark base */}
      <circle cx="50" cy="50" r="48" fill="#1a1a1a" />

      {/* Groove rings */}
      {[44, 40, 36, 32, 28, 24, 20].map((r, i) => (
        <circle
          key={i}
          cx="50"
          cy="50"
          r={r}
          stroke="#2e2e2e"
          strokeWidth="0.8"
          fill="none"
        />
      ))}

      {/* Subtle sheen — light reflection arc */}
      <path
        d="M 20 30 Q 50 10 80 30"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />

      {/* Center label — warm cream */}
      <circle cx="50" cy="50" r="15" fill="#d4a96a" />

      {/* Label detail rings */}
      <circle cx="50" cy="50" r="13" stroke="#c4914a" strokeWidth="0.5" fill="none" />
      <circle cx="50" cy="50" r="10" stroke="#c4914a" strokeWidth="0.5" fill="none" />

      {/* Spindle hole */}
      <circle cx="50" cy="50" r="2.5" fill="#0f0f0f" />

      {/* Outer edge highlight */}
      <circle
        cx="50"
        cy="50"
        r="47.5"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

/* ─── Main Component ──────────────────────────────────────────── */
export default function FloatingPlayer() {
  const {
    isPlaying,
    currentTrack,
    tracks,
    togglePlay,
    playTrack,
    nextTrack,
    prevTrack,
  } = useAudio();

  const [open, setOpen] = useState(false);

  if (!currentTrack) return null;

  return (
    <>
      {/* ── Popup Panel ─────────────────────────────────────────── */}
      {open && (
        <>
          {/* Backdrop — tap anywhere to close */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div
            className="fixed bottom-28 right-5 z-50 rounded-2xl border border-accent-gray shadow-2xl overflow-hidden"
            style={{
              width: "clamp(240px, 80vw, 290px)",
              background: "color-mix(in srgb, var(--bg-primary) 90%, transparent)",
              backdropFilter: "blur(28px) saturate(1.6)",
              WebkitBackdropFilter: "blur(28px) saturate(1.6)",
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-4 pt-4 pb-3">
              <div className="flex flex-col min-w-0 pr-2">
                <span className="font-serif italic text-sm text-text-primary truncate leading-tight">
                  {currentTrack.title}
                </span>
                <span className="text-[10px] text-text-secondary opacity-70 truncate mt-0.5">
                  {currentTrack.artist}
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="shrink-0 text-text-secondary hover:text-text-primary transition-colors cursor-pointer mt-0.5"
                aria-label="Close"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-8 px-4 pb-4">
              <button
                onClick={prevTrack}
                className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                aria-label="Previous"
              >
                <SkipBack size={18} strokeWidth={1.5} />
              </button>

              <button
                onClick={togglePlay}
                className="w-11 h-11 rounded-full bg-text-primary text-bg-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-md"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause size={16} fill="currentColor" strokeWidth={0} />
                ) : (
                  <Play size={16} fill="currentColor" strokeWidth={0} className="translate-x-[1px]" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                aria-label="Next"
              >
                <SkipForward size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-accent-gray mx-0" />

            {/* Track list */}
            <div className="flex flex-col px-2 py-2 max-h-36 overflow-y-auto">
              <span className="px-2 pb-1.5 text-[9px] uppercase tracking-widest text-text-secondary opacity-50">
                Playlist
              </span>
              {tracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => {
                    playTrack(track);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                    currentTrack.id === track.id
                      ? "bg-accent-gray text-accent-gold"
                      : "hover:bg-accent-gray text-text-primary"
                  }`}
                >
                  <span className="font-serif italic text-xs block leading-tight">
                    {track.title}
                  </span>
                  <span className="text-[9px] text-text-secondary opacity-60 leading-none mt-0.5 block">
                    {track.artist}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Vinyl Button ────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open music player"
        className={`fixed bottom-6 right-5 z-50 w-16 h-16 rounded-full transition-all duration-300 cursor-pointer
          hover:scale-110 active:scale-95
          ${open ? "opacity-100" : "opacity-80 hover:opacity-100"}
        `}
        style={{
          boxShadow: isPlaying
            ? "0 0 0 2px rgba(212,169,106,0.4), 0 0 20px rgba(212,169,106,0.25)"
            : "0 2px 12px rgba(0,0,0,0.4)",
        }}
      >
        <VinylRecord spinning={isPlaying} />
      </button>
    </>
  );
}
