"use client";

import React, { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHovered = useRef(false);
  const isClicked = useRef(false);
  const isVisible = useRef(false);

  useEffect(() => {
    // Only enable on devices that have a precise pointer (desktop / laptop mice)
    if (
      typeof window === "undefined" ||
      window.matchMedia("(pointer: coarse)").matches ||
      !window.matchMedia("(hover: hover)").matches
    ) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisible.current) {
        isVisible.current = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };

    const handleMouseDown = () => {
      isClicked.current = true;
    };

    const handleMouseUp = () => {
      isClicked.current = false;
    };

    const handleMouseLeave = () => {
      isVisible.current = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      isVisible.current = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    // Detect hover over interactive / clickable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) {
        isHovered.current = false;
        return;
      }

      const isClickable =
        target.closest(
          "a, button, [role='button'], .cursor-pointer, select, summary, label[for], input[type='submit'], input[type='button'], input[type='checkbox'], input[type='radio'], [tabindex]:not([tabindex='-1'])"
        ) !== null ||
        window.getComputedStyle(target).cursor === "pointer";

      isHovered.current = isClickable;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    let animId: number;

    const render = () => {
      // Silky smooth & organic trailing follow (0.16)
      const lerpFactor = 0.16;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerpFactor;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerpFactor;

      // Inner dot follows exact mouse position instantly; fades on clickable elements so pointer hand is crisp
      dot.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      dot.style.opacity = isHovered.current ? "0" : "1";

      // Outer ring follows snappily with hover/click scale
      const scale = isClicked.current ? 0.75 : isHovered.current ? 1.5 : 1;
      ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${scale})`;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* 1. Inner Dot — direct position tracking */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          willChange: "transform",
          mixBlendMode: "difference",
          background: "white",
        }}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[99999] opacity-0 transition-opacity duration-150"
      />

      {/* 2. Outer Ring — snappy follow, no CSS transform transition conflict */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          willChange: "transform",
          mixBlendMode: "difference",
          border: "1.5px solid white",
        }}
        className="fixed top-0 left-0 w-9 h-9 rounded-full pointer-events-none z-[99998] opacity-0 transition-opacity duration-150"
      />
    </>
  );
}
