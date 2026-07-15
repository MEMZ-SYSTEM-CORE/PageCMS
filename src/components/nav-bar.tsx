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
    <nav className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex h-12 items-center justify-between px-3">
        <div className="flex items-center gap-1 min-w-0 overflow-hidden">
          {/* Logo */}
          <Link href="/" className="shrink-0 hover:opacity-80 transition-opacity mr-1">
            <img
              src={siteConfig.avatar}
              alt="Home"
              className="h-6 w-6 rounded-full"
              referrerPolicy="no-referrer"
            />
          </Link>

          {/* Nav Links */}
          {siteConfig.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs font-medium px-2 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                isActive(link.href)
                  ? 'text-foreground bg-muted'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Breadcrumbs - hidden on mobile when too long */}
          {crumbs.length > 0 && (
            <>
              <span className="text-muted-foreground/30 mx-0.5 shrink-0 hidden sm:inline">|</span>
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
