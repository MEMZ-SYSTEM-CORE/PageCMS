"use client";

import { useState, useCallback } from "react";
import { X, ZoomIn } from "lucide-react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  children?: React.ReactNode;
}

export function ImageLightbox({ src, alt }: ImageLightboxProps) {
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      {/* Clickable thumbnail */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative group inline-block w-full cursor-zoom-in"
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full rounded-lg object-cover border border-border/50 transition-transform duration-200 group-hover:scale-[1.005]"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg bg-black/10">
          <ZoomIn className="size-6 text-white drop-shadow-lg" />
        </div>
      </button>

      {/* Fullscreen overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 size-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
          >
            <X className="size-5" />
          </button>
          <img
            src={src}
            alt={alt}
            className="max-h-[92vh] max-w-[92vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
