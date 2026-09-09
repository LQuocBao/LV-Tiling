"use client";

import React, { useRef, useState, useCallback } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  pullStrength?: number; // lower = subtle, higher = stronger
}

export default function MagneticButton({
  children,
  className = "",
  pullStrength = 0.25,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * pullStrength;
      const deltaY = (e.clientY - centerY) * pullStrength;

      setPosition({ x: deltaX, y: deltaY });
    },
    [pullStrength]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${position.x.toFixed(1)}px, ${position.y.toFixed(1)}px, 0)`,
        transition: position.x === 0 && position.y === 0 ? "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" : "transform 0.05s ease-out",
        willChange: "transform",
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </div>
  );
}
