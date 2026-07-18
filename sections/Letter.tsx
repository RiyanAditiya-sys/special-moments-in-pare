"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function Letter() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const fullLines = [
    "Dear All,",
    "If you're reading this years from now,",
    "I hope you still remember every laugh,",
    "every late-night conversation,",
    "every class, every walk, every joke,",
    "and every last goodbye.",
    "These moments shaped who you became.",
    "Thank you for never forgetting."
  ];

  const [typedLines, setTypedLines] = useState<string[]>(new Array(fullLines.length).fill(""));
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  // Typewriter effect
  useEffect(() => {
    if (!isInView) return;

    if (currentLineIndex < fullLines.length) {
      const currentFullText = fullLines[currentLineIndex];
      let charIndex = 0;

      const timer = setInterval(() => {
        setTypedLines((prev) => {
          const next = [...prev];
          next[currentLineIndex] = currentFullText.substring(0, charIndex + 1);
          return next;
        });

        charIndex++;

        if (charIndex >= currentFullText.length) {
          clearInterval(timer);
          setTimeout(() => {
            setCurrentLineIndex((prev) => prev + 1);
          }, 350);
        }
      }, 42);

      return () => clearInterval(timer);
    }
  }, [isInView, currentLineIndex]);

  return (
    <section
      id="letter"
      ref={containerRef}
      className="w-full flex flex-col justify-center items-center bg-bg-primary border-b border-accent-gray"
      style={{ paddingTop: "clamp(5rem, 12vw, 10rem)", paddingBottom: "clamp(5rem, 12vw, 10rem)" }}
    >
      <div className="editorial-container">
        <div className="w-full max-w-2xl mx-auto flex flex-col" style={{ gap: "clamp(2.5rem, 5vw, 4rem)" }}>

          {/* Section label */}
          <div className="text-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.4 } : {}}
              transition={{ duration: 1.0 }}
              className="section-label"
            >
              A Note to the Future
            </motion.span>
          </div>

          {/* Decorative em-dash divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.25 } : {}}
            transition={{ duration: 1.0, delay: 0.2 }}
            className="text-center font-serif text-text-secondary text-2xl tracking-widest select-none"
          >
            — — —
          </motion.div>

          {/* Letter typewriter block */}
          <div
            className="w-full flex flex-col items-center justify-center"
            style={{ paddingTop: "clamp(1.5rem, 4vw, 3rem)", paddingBottom: "clamp(1.5rem, 4vw, 3rem)" }}
          >
            <div
              className="font-serif text-text-primary font-light italic text-center flex flex-col w-full"
              style={{ fontSize: "clamp(1.125rem, 2.2vw, 1.375rem)", lineHeight: "2.6", gap: "0.25rem" }}
            >
              {typedLines.map((line, idx) => (
                <div
                  key={idx}
                  className="min-h-8 flex justify-center items-center relative"
                >
                  <span className="opacity-90">{line}</span>
                  {idx === currentLineIndex && currentLineIndex < fullLines.length && (
                    <span className="w-[1.5px] h-5 bg-accent-gold ml-1 animate-[blink_0.8s_steps(2,_start)_infinite]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
