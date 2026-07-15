import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-8xl font-black text-muted-foreground/20">404</div>
      <Card className="max-w-md">
        <CardContent className="p-6">
          <CardTitle className="mb-2">页面不存在</CardTitle>
          <CardDescription>你访问的页面不存在，可能已被移除或链接错误。</CardDescription>
          <div className="mt-4">
            <Link href="/">
              <Button variant="default">返回首页</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
