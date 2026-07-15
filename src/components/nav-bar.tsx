"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config/site";
import { ThemeToggle } from "@/components/theme-toggle";

export function NavBar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const crumbs = (() => {
    const path = pathname.replace(/\/$/, '') || '/';
    if (path === '/') return [];
    const parts = path.split('/').filter(Boolean);
    const displayNames: Record<string, string> = {
      posts: 'posts',
      about: 'about',
    };
    const result: { label: string; href: string }[] = [];
    let accumulated = '';
    for (const part of parts) {
      accumulated += '/' + part;
      result.push({ label: displayNames[part] || part, href: accumulated });
    }
    return result;
  })();

  return (
    <nav className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="flex h-12 items-center justify-between px-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-1 min-w-0 overflow-hidden">
          <Link href="/" className="shrink-0 hover:opacity-80 transition-opacity mr-1.5">
            <img src={siteConfig.avatar} alt="Home" className="h-5 w-5 rounded-full ring-1 ring-border" referrerPolicy="no-referrer" />
          </Link>

          {siteConfig.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                isActive(link.href)
                  ? 'text-foreground bg-muted/80'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {crumbs.length > 0 && (
            <>
              <span className="text-border mx-0.5 shrink-0 hidden sm:inline">/</span>
              <div className="hidden sm:flex items-center gap-0.5 min-w-0 overflow-hidden">
                {crumbs.map((crumb, i) => (
                  <div key={crumb.href} className="inline-flex items-center gap-0.5 min-w-0">
                    <span className="text-muted-foreground/40 shrink-0">/</span>
                    {i < crumbs.length - 1 ? (
                      <Link href={crumb.href} className="text-xs text-muted-foreground hover:text-foreground truncate transition-colors shrink min-w-0 max-w-[80px]">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-xs text-foreground font-medium truncate shrink min-w-0 max-w-[100px]">{crumb.label}</span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
