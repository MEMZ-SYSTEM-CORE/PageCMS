"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!showButton) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={scrollToTop}
        aria-label="回到顶部"
        className="size-12 shadow-lg hover:shadow-xl bg-white text-black dark:bg-black dark:text-white border-2 border-border rounded-full inline-flex items-center justify-center transition-all hover:scale-105"
      >
        <ArrowUp className="size-5" />
      </button>
    </div>
  );
}
