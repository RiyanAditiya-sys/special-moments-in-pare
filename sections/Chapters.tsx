"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Chapter {
  id: string;
  chapterNumber: string;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  description: string;
  image: string;
  layout: "left" | "right" | "center" | "fullscreen" | "quote";
}

export default function Chapters() {
  const chaptersList: Chapter[] = [
    {
      id: "arrival",
      chapterNumber: "Chapter I",
      title: "All of Us",
      subtitle: "The Whole Crew, One Frame",
      date: "July 1, 2026",
      location: "Kampung Inggris, Pare",
      description: "This is everyone. Different hometowns, different backgrounds, same destination. Before Pare shaped us, before the classes started, before the goodbyes — here we are, standing together for the very first time.",
      image: "/image/1 (20).jpeg",
      layout: "center"
    },
    {
      id: "first-day",
      chapterNumber: "Chapter II",
      title: "First Day",
      subtitle: "Nervous Smiles & Fresh Beginnings",
      date: "July 2, 2026",
      location: "Camp Main Hall, Pare",
      description: "The first morning at camp. We queued for placement tests with sweaty palms and hopeful hearts. Names were still new, faces still unfamiliar — but the excitement in the air was impossible to miss.",
      image: "/image/3.jpeg",
      layout: "fullscreen"
    },
    {
      id: "friends",
      chapterNumber: "Chapter III",
      title: "New Friends",
      subtitle: "Strangers Becoming Family",
      date: "July 5, 2026",
      location: "Pare",
      description: "Meeting new people was one of the best parts of Pare. We came from different cities with different stories, but after a few days, we were already joking, studying, and spending almost every moment together.",
      image: "/image/1 (21).jpeg",
      layout: "center"
    },
    {
      id: "Together",
      chapterNumber: "Chapter IV",
      title: "Foto Kita Blur",
      subtitle: "The No Bahasa Zone",
      date: "July 12, 2026",
      location: "Pare",
      description: "Ini ntah mo kemana bjir, Blur pula foto nya. FOTO KITA BLUR!",
      image: "/image/1 (12).jpeg",
      layout: "left"
    },
    {
      id: "Break Time",
      chapterNumber: "Chapter V",
      title: "One More Picture",
      subtitle: "5,000 Rupiah & 15 Minutes",
      date: "July 16, 2026",
      location: "Pare",
      description: "Someone said, Eh foto dulu. Five seconds later, everyone was already posing. Just another random picture that ended up becoming one of our favorite memories.",
      image: "/image/1 (6).jpeg",
      layout: "fullscreen"
    },
    {
      id: "car Free Day",
      chapterNumber: "Chapter VI",
      title: "CFD",
      subtitle: "Jalan-Jalan Pagi",
      date: "July 20, 2026",
      location: "Pare Local Field",
      description: "Car Free Day became our chance to relax after a busy week. We walked around, played football, took photos, and enjoyed the lively atmosphere with friends around Pare.",
      image: "/image/1 (10).jpeg",
      layout: "right"
    },
    {
      id: "Our Boys",
      chapterNumber: "Chapter VII",
      title: "The Boys",
      subtitle: "Poto Studio Cailah",
      date: "July 24, 2026",
      location: "Daffodil Cafe, Pare",
      description: "This was the squad that made every day more fun. Whether we were studying, hanging out at cafés, or just talking late into the night, there was never a boring moment when we were together.",
      image: "/image/1 (19).jpeg",
      layout: "center"
    },
    {
      id: "Minggu Pagi",
      chapterNumber: "Chapter VIII",
      title: "Weekend Escape",
      subtitle: "Bicycle to Simpang Lima Gumul",
      date: "July 29, 2026",
      location: "deket masjid pokok nya",
      description: "Minggu Pagi mba-mba nya udh marah-marah bae suruh bangun pagi, Ngajak jalan-jalan katanya cape belajar mulu",
      image: "/image/1 (11).jpeg",
      layout: "left"
    },
    {
      id: "The Girl",
      chapterNumber: "Chapter IX",
      title: "The Girls",
      subtitle: "We Actually Made It",
      date: "Juli 27, 2026",
      location: "Pare",
      description: "The girls brought positive energy to every activity. From studying together to taking countless photos, they became an important part of the memories we made during our time in Pare.",
      image: "/image/1 (25).jpeg",
      layout: "center"
    },
    {
      id: "goodbye",
      chapterNumber: "Chapter X",
      title: "Last Goodbye",
      subtitle: "Until We Meet Again",
      date: "August 28, 2026",
      location: "Kediri Train Station",
      description: "Suitcases by the platform, one last group hug, eyes that couldn't stay dry. No one wanted to be the first to let go. We came to Pare as strangers. We left as something harder to define — and impossible to forget.",
      image: "/image/1 (20).jpeg",
      layout: "fullscreen"
    }
  ];

  return (
    <div id="chapters" className="bg-bg-primary text-text-primary flex flex-col w-full">
      {chaptersList.map((chapter) => (
        <ChapterSection key={chapter.id} chapter={chapter} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/* Shared metadata block                                    */
/* ─────────────────────────────────────────────────────── */
function ChapterMeta({
  chapter,
  light = false
}: {
  chapter: Chapter;
  light?: boolean;
}) {
  const color = light ? "text-neutral-200" : "text-text-secondary";
  const opacityLabel = light ? "opacity-60" : "opacity-55";

  return (
    <div className="flex flex-col" style={{ gap: "clamp(0.75rem, 1.5vw, 1.25rem)" }}>
      <span className={`section-label ${opacityLabel} ${light ? "text-neutral-300" : ""}`}>
        {chapter.chapterNumber}
      </span>
      <h2
        className={`font-serif font-light ${light ? "text-white" : "text-text-primary"}`}
        style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1, letterSpacing: "-0.01em" }}
      >
        {chapter.title}
      </h2>
      <div className={`flex gap-3 items-center section-label ${opacityLabel} ${light ? "text-neutral-300" : ""}`}
        style={{ letterSpacing: "0.25em" }}>
        <span>{chapter.date}</span>
        <span>·</span>
        <span>{chapter.location}</span>
      </div>
      <p
        className={`font-light ${color}`}
        style={{ fontSize: "clamp(0.9rem, 1.4vw, 1rem)", lineHeight: "1.9", maxWidth: "58ch" }}
      >
        {chapter.description}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/* Individual Chapter Section                              */
/* ─────────────────────────────────────────────────────── */
function ChapterSection({ chapter }: { chapter: Chapter }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const vPad = "clamp(5rem, 12vw, 10rem)";

  /* ── 1. Left: Image left, text right ── */
  if (chapter.layout === "left") {
    return (
      <motion.section
        ref={sectionRef}
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full border-b border-accent-gray"
        style={{ paddingTop: vPad, paddingBottom: vPad }}
      >
        <div className="chapter-container">
          <div
            className="grid items-center"
            style={{
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(2.5rem, 6vw, 6rem)"
            }}
          >
            {/* Image — tall portrait */}
            <div
              className="overflow-hidden rounded-sm bg-bg-secondary"
              style={{ aspectRatio: "3/4" }}
            >
              <img
                src={chapter.image}
                alt={chapter.title}
                className={`w-full h-full object-cover transition-transform duration-[4000ms] ${isInView ? "scale-100" : "scale-[1.05]"
                  }`}
              />
            </div>

            {/* Text */}
            <ChapterMeta chapter={chapter} />
          </div>
        </div>
      </motion.section>
    );
  }

  /* ── 2. Right: Text left, image right ── */
  if (chapter.layout === "right") {
    return (
      <motion.section
        ref={sectionRef}
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full border-b border-accent-gray"
        style={{ paddingTop: vPad, paddingBottom: vPad }}
      >
        <div className="chapter-container">
          <div
            className="grid items-center"
            style={{
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(2.5rem, 6vw, 6rem)"
            }}
          >
            {/* Text */}
            <ChapterMeta chapter={chapter} />

            {/* Image — tall portrait, slightly offset */}
            <div
              className="overflow-hidden rounded-sm bg-bg-secondary"
              style={{ aspectRatio: "3/4", marginTop: "clamp(-2rem, -4vw, -4rem)" }}
            >
              <img
                src={chapter.image}
                alt={chapter.title}
                className={`w-full h-full object-cover transition-transform duration-[4000ms] ${isInView ? "scale-100" : "scale-[1.05]"
                  }`}
              />
            </div>
          </div>
        </div>
      </motion.section>
    );
  }

  /* ── 3. Center: Full-width cinematic image, text below ── */
  if (chapter.layout === "center") {
    return (
      <motion.section
        ref={sectionRef}
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex flex-col border-b border-accent-gray"
        style={{ paddingTop: vPad, paddingBottom: vPad, gap: "clamp(2.5rem, 5vw, 4rem)" }}
      >
        {/* Full-width cinematic image */}
        <div className="w-full overflow-hidden" style={{ aspectRatio: "21/9" }}>
          <img
            src={chapter.image}
            alt={chapter.title}
            className={`w-full h-full object-cover transition-transform duration-[4000ms] ${isInView ? "scale-100" : "scale-[1.04]"
              }`}
          />
        </div>

        {/* Text — editorial container */}
        <div className="chapter-container">
          <ChapterMeta chapter={chapter} />
        </div>
      </motion.section>
    );
  }

  /* ── 4. Quote: Left border accent quote layout ── */
  if (chapter.layout === "quote") {
    return (
      <motion.section
        ref={sectionRef}
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full border-b border-accent-gray"
        style={{ paddingTop: vPad, paddingBottom: vPad }}
      >
        <div className="chapter-container">
          <div
            className="grid items-center"
            style={{
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(2.5rem, 6vw, 6rem)"
            }}
          >
            {/* Quote text block */}
            <div className="flex flex-col" style={{ gap: "clamp(1.25rem, 2.5vw, 2rem)" }}>
              <span className="section-label opacity-55">{chapter.chapterNumber}</span>

              {/* Large pull-quote */}
              <blockquote
                className="font-serif italic text-accent-gold border-l-2 border-accent-gold"
                style={{
                  fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
                  lineHeight: "1.4",
                  paddingLeft: "clamp(1.25rem, 2.5vw, 2rem)"
                }}
              >
                "{chapter.subtitle}"
              </blockquote>

              <h2
                className="font-serif font-light text-text-primary"
                style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", lineHeight: 1.1 }}
              >
                {chapter.title}
              </h2>

              <div className="flex gap-3 items-center section-label opacity-55" style={{ letterSpacing: "0.25em" }}>
                <span>{chapter.date}</span>
                <span>·</span>
                <span>{chapter.location}</span>
              </div>

              <p
                className="font-light text-text-secondary"
                style={{ fontSize: "clamp(0.9rem, 1.4vw, 1rem)", lineHeight: "1.9", maxWidth: "58ch" }}
              >
                {chapter.description}
              </p>
            </div>

            {/* Image — landscape */}
            <div
              className="overflow-hidden rounded-sm bg-bg-secondary"
              style={{ aspectRatio: "4/3" }}
            >
              <img
                src={chapter.image}
                alt={chapter.title}
                className={`w-full h-full object-cover transition-transform duration-[4000ms] ${isInView ? "scale-100" : "scale-[1.05]"
                  }`}
              />
            </div>
          </div>
        </div>
      </motion.section>
    );
  }

  /* ── 5. Fullscreen: image fills the section, text overlay at bottom ── */
  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full overflow-hidden border-b border-accent-gray"
      style={{ minHeight: "90vh" }}
    >
      {/* Full-bleed image */}
      <div className="absolute inset-0 z-0">
        <img
          src={chapter.image}
          alt={chapter.title}
          className={`w-full h-full object-cover transition-transform duration-[5000ms] ${isInView ? "scale-100" : "scale-[1.04]"
            }`}
        />
        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      {/* Text at bottom-left */}
      <div
        className="relative z-10 flex flex-col justify-end h-full"
        style={{ minHeight: "90vh", padding: "clamp(2.5rem, 6vw, 6rem)" }}
      >
        <ChapterMeta chapter={chapter} light />
      </div>
    </motion.section>
  );
}
