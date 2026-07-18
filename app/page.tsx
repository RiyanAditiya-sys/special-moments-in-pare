"use client";

import React, { useState, useEffect } from "react";
import LoadingScreen from "@/sections/LoadingScreen";
import Hero from "@/sections/Hero";
import Introduction from "@/sections/Introduction";
import Chapters from "@/sections/Chapters";
import Gallery from "@/sections/Gallery";
import Letter from "@/sections/Letter";
import Ending from "@/sections/Ending";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Manage body scroll lock based on preloader state
  useEffect(() => {
    if (!isLoaded) {
      document.documentElement.classList.add("lenis-stopped");
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.classList.remove("lenis-stopped");
      document.body.style.overflow = "auto";
    }
  }, [isLoaded]);

  return (
    <>
      {/* 1. Preloader Typographic Overlay */}
      {!isLoaded && <LoadingScreen onEnter={() => setIsLoaded(true)} />}

      {/* 2. Photo-Book Scrapbook Flow */}
      <div
        className={`w-full transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <Hero />
        <Introduction />
        <Chapters />
        <Gallery />
        <Letter />
        <Ending />
      </div>
    </>
  );
}
