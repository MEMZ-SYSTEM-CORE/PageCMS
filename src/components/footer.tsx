import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import { Cookie } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-8 border-t pt-6 pb-8">
      <div className="container mx-auto flex flex-col items-center gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <button
            id="open_preferences_center"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Cookie className="w-4 h-4" />
            隐私与协议设置
          </button>
        </div>
        <p>&copy; {new Date().getFullYear()} {siteConfig.bio.name}</p>
      </div>
    </footer>
  );
}
