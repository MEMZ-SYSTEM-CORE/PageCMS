import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/config/site";
import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { BackToTop } from "@/components/back-to-top";
import { CookieConsent } from "@/components/cookie-consent";

export const metadata: Metadata = {
  title: siteConfig.siteName,
  description: siteConfig.description,
  icons: { icon: siteConfig.icon },
  openGraph: {
    title: siteConfig.siteName,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.siteName,
    locale: siteConfig.lang,
    type: "website",
    images: [{ url: siteConfig.url + siteConfig.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.siteName,
    description: siteConfig.description,
    images: [siteConfig.url + siteConfig.ogImage],
  },
  alternates: {
    canonical: siteConfig.url,
    types: {
      "application/rss+xml": [
        { title: `${siteConfig.siteName} RSS Feed`, url: "/rss.xml" },
      ],
    },
  },
  other: {
    "preconnect": "https://i1.hdslb.com",
    "dns-prefetch": "https://i1.hdslb.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={siteConfig.lang} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <NavBar />
          <main>{children}</main>
          <Footer />
          <CookieConsent />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
