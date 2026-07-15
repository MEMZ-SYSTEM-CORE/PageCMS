"use client";

import { useEffect } from "react";

export function PostComments() {
  useEffect(() => {
    const giscus = document.querySelector(".giscus");
    if (!giscus || (giscus as HTMLElement).hasChildNodes()) return;

    const isDark = document.documentElement.classList.contains("dark");
    const theme = isDark ? "dark" : "light";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "MEMZ-SYSTEM-CORE/giscuz");
    script.setAttribute("data-repo-id", "R_kgDOTXCGPw");
    script.setAttribute("data-category", "Announcements");
    script.setAttribute("data-category-id", "DIC_kwDOTXCGP84DBGZC");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", theme);
    script.setAttribute("data-lang", "zh-CN");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;
    giscus.appendChild(script);
  }, []);

  return <div className="giscus mt-8" />;
}
