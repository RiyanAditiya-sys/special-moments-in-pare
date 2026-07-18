"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function Introduction() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const paragraphs = [
    "Kampung Inggris, Pare. A small, quiet town in East Java where thousands of paths cross, if only for a brief season. We came from different islands, different backgrounds, carrying nothing but suitcases and the nervous dream of learning.",
    "For a few months, this town became our home. Class hours merged into coffee breaks, and the voices of strangers transformed into shared laughter. This is the chronicle of that happy chapter — of lessons learned, roads cycled, and bonds that time cannot fade."
  ];

  return (
    <section
      id="introduction"
      ref={containerRef}
      className="w-full flex flex-col justify-center items-center bg-bg-primary"
      style={{ paddingTop: "clamp(5rem, 12vw, 10rem)", paddingBottom: "clamp(5rem, 12vw, 10rem)" }}
    >
      <div className="editorial-container">
        <div className="w-full max-w-3xl flex flex-col" style={{ gap: "clamp(2.5rem, 5vw, 4rem)" }}>
          {/* Section label */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.45 } : {}}
            transition={{ duration: 1.0 }}
            className="section-label"
          >
            Prologue — Kampung Inggris
          </motion.span>

          {/* Story Prose */}
          <div className="flex flex-col" style={{ gap: "clamp(1.75rem, 3vw, 2.5rem)" }}>
            {paragraphs.map((p, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 18 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.3, delay: idx * 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={`font-serif opacity-90 font-light ${
                  idx === 0
                    ? "border-l-2 border-accent-gold pl-5 md:pl-7"
                    : ""
                }`}
                style={{ fontSize: "clamp(1.125rem, 2vw, 1.375rem)", lineHeight: "1.9" }}
              >
                {p}
              </motion.p>
            ))}
          </div>

          {/* Divider line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="origin-left h-[1px] bg-accent-gray w-24"
          />
        </div>
      </div>
    </section>
  );
}
