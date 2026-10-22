"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Disable Lenis smooth scrolling inside /admin dashboard to ensure native nested container scrolling
    if (pathname?.startsWith("/admin")) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const animFrame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animFrame);
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}
