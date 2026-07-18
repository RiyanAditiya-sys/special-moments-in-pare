"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const scrollToNextSection = () => {
    const nextSec = document.getElementById("introduction");
    if (nextSec && (window as any).lenis) {
      (window as any).lenis.scrollTo(nextSec, { offset: 0, duration: 1.5 });
    } else {
      nextSec?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen w-full flex flex-col items-center overflow-hidden bg-bg-primary px-6">
      {/* Background Photograph (with slow Ken Burns zoom) */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-out-quad scale-[1.03] animate-[kenBurns_30s_infinite_alternate]"
          style={{
            backgroundImage: "url('/image/3.jpeg')",
            opacity: 0.2
          }}
        />
        {/* Soft overlay gradient to ensure readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-bg-primary opacity-80" />
      </div>

      {/* Spacer atas (lebih besar) agar konten tidak terlalu di atas */}
      <div className="flex-[2]" />

      {/* Centered Editorial Typography */}
      <div className="z-10 flex flex-col items-center gap-4 text-center max-w-lg">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-5xl md:text-7xl tracking-widest uppercase text-text-primary"
        >
          Pare
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs md:text-sm tracking-[0.3em] uppercase text-text-secondary leading-loose"
        >
          Two Months. One Story.
        </motion.p>
      </div>

      {/* Gap antara teks dan tombol */}
      <div className="flex-[1]" />

      {/* Scroll Trigger Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1.0, delay: 0.6 }}
        className="z-10 flex flex-col items-center gap-3"
      >
        <button
          onClick={scrollToNextSection}
          className="px-10 py-3 border-b border-text-primary text-[10px] tracking-[0.2em] uppercase text-text-primary transition-opacity hover:opacity-50 cursor-pointer"
        >
          Begin Journey
        </button>
      </motion.div>

      {/* Spacer bawah (lebih kecil) agar tombol mudah dijangkau jempol */}
      <div
        className="flex-[3]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      />
    </section>
  );
}
