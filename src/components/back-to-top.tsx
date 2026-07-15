"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [showButton, setShowButton] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      setShowButton(scrollTop > 200);
      if (docHeight > 0) {
        setProgress(Math.min((scrollTop / docHeight) * 100, 100));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!showButton) return null;

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={scrollToTop}
        aria-label="回到顶部"
        className="relative size-12 flex items-center justify-center"
      >
        {/* Background circle */}
        <svg className="absolute inset-0 size-12 -rotate-90" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="oklch(0.85 0 0)"
            strokeWidth="2.5"
            className="dark:stroke-white/10"
          />
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="oklch(0.5 0.15 250)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-[stroke-dashoffset] duration-200 ease-out"
          />
        </svg>
        {/* Button background */}
        <span className="size-10 rounded-full bg-background border border-border flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <ArrowUp className="size-5 text-foreground" />
        </span>
      </button>
    </div>
  );
}
