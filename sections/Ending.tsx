"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useAudio } from "../lib/AudioContext";

export default function Ending() {
  const { setVolume } = useAudio();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { margin: "-200px" });

  const [fadeVolumeActive, setFadeVolumeActive] = useState(false);

  // Slow fade out music master volume when Ending enters view
  useEffect(() => {
    if (isInView && !fadeVolumeActive) {
      setFadeVolumeActive(true);
      let curVol = 0.4;
      const interval = setInterval(() => {
        curVol -= 0.02;
        if (curVol <= 0.01) {
          setVolume(0);
          clearInterval(interval);
        } else {
          setVolume(curVol);
        }
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isInView, fadeVolumeActive]);

  return (
    <section
      id="ending"
      ref={containerRef}
      className="relative w-full flex flex-col justify-center items-center bg-[#050505] text-[#FAFAF8] select-none"
      style={{ paddingTop: "clamp(6rem, 14vw, 12rem)", paddingBottom: "clamp(6rem, 14vw, 12rem)" }}
    >
      <div className="w-full flex flex-col items-center" style={{ gap: "clamp(3rem, 6vw, 5rem)" }}>

        {/* ── Full-bleed cinematic image (magazine cover) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          whileInView={{ opacity: 0.88, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "16/7" }}
        >
          <img
            src="/image/3.jpeg"
            alt="The last train goodbye"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.82) contrast(1.06)" }}
          />
          {/* Gradient fade at bottom so title overlays cleanly */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/70 via-[#050505]/10 to-transparent" />

          {/* Title overlay at bottom-left of image */}
          <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 px-8 md:px-16 pb-10 md:pb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.55 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.4 }}
              className="section-label text-neutral-300"
            >
              Epilogue — Until We Meet Again
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif font-light text-neutral-50"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
            >
              Thank You.
            </motion.h2>
          </div>
        </motion.div>

        {/* ── Editorial card below the image ── */}
        <div className="editorial-container">
          <div className="max-w-2xl flex flex-col items-start" style={{ gap: "clamp(1.5rem, 3vw, 2.5rem)" }}>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 0.8, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-neutral-400 font-light tracking-wide"
              style={{ fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)", lineHeight: "2", letterSpacing: "0.22em", textTransform: "uppercase" }}
            >
              For every conversation. For every laugh. For every goodbye.
            </motion.p>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="origin-left h-[1px] bg-neutral-700 w-20"
            />

            <motion.h3
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif italic tracking-wide"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--accent-gold)" }}
            >
              Pare, 2026.
            </motion.h3>
          </div>
        </div>
      </div>

      {/* Final absolute fade to solid black */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10px" }}
        transition={{ duration: 2.5, delay: 2.0 }}
        className="absolute inset-0 z-20 bg-black pointer-events-none"
      />
    </section>
  );
}
