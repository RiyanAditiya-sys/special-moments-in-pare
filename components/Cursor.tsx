"use client";

import React, { useEffect, useState, useRef } from "react";

export default function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [isClicking, setIsClicking] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  // Track mouse movements
  useEffect(() => {
    // Check if device is mobile or touch
    const checkDevice = () => {
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsMobile(hasTouch);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      setPosition({ x, y });
      setIsHidden(false);

      // Instantly position dot
      if (dotRef.current) {
        dotRef.current.style.left = `${x}px`;
        dotRef.current.style.top = `${y}px`;
      }

      // Smooth animate ring (spring effect)
      if (ringRef.current) {
        ringRef.current.animate(
          {
            left: `${x}px`,
            top: `${y}px`
          },
          { duration: 150, fill: "forwards" }
        );
      }
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
    };

    const handleMouseEnter = () => {
      setIsHidden(false);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    // Global event delegation for hover states
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".interactive") ||
        target.getAttribute("data-cursor-hover") === "true";

      if (isInteractive) {
        setIsHovered(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".interactive") ||
        target.getAttribute("data-cursor-hover") === "true";

      if (isInteractive) {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, [isMobile]);

  if (isMobile || isHidden) return null;

  return (
    <>
      {/* Inner Dot */}
      <div
        ref={dotRef}
        className="custom-cursor"
        style={{
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : isHovered ? 1.5 : 1})`,
          backgroundColor: isHovered ? "var(--accent-gold)" : "#fff",
          position: "fixed",
          zIndex: 10000,
          pointerEvents: "none",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          transition: "transform 0.15s, background-color 0.2s"
        }}
      />
      {/* Outer Ring */}
      <div
        ref={ringRef}
        className="custom-cursor-ring"
        style={{
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.85 : isHovered ? 1.4 : 1})`,
          borderColor: isHovered ? "var(--accent-gold)" : "rgba(255, 255, 255, 0.4)",
          backgroundColor: isHovered ? "rgba(229, 193, 88, 0.04)" : "transparent",
          position: "fixed",
          zIndex: 9999,
          pointerEvents: "none",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          borderStyle: "solid",
          borderWidth: "1.5px",
          transition: "transform 0.2s, border-color 0.3s, background-color 0.3s"
        }}
      />
    </>
  );
}
