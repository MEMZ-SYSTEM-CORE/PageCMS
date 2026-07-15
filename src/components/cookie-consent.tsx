"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Cookie, Check, Settings, X } from "lucide-react";

interface ConsentPreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
}

const STORAGE_KEY = "cookie-consent-preferences";
const CONSENT_VERSION = "2.0";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [readAgreement, setReadAgreement] = useState(false);
  const [readPrivacy, setReadPrivacy] = useState(false);
  const [overlayContent, setOverlayContent] = useState<"agreement" | "privacy" | null>(null);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    functional: false,
    analytics: false,
  });

  const canAgree = readAgreement && readPrivacy;

  useEffect(() => {
    loadPreferences();

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.id === "open_preferences_center" || target.closest("#open_preferences_center")) {
        e.preventDefault();
        setShowSettings(true);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  function loadPreferences() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.version === CONSENT_VERSION && data.agreed) {
          setPreferences(data.preferences);
          setAgreed(true);
          setReadAgreement(true);
          setReadPrivacy(true);
          applyConsent(data.preferences);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to load cookie preferences:", e);
    }
    setShowBanner(true);
  }

  function savePreferences(close = true) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: CONSENT_VERSION,
          preferences,
          agreed: true,
          timestamp: Date.now(),
        })
      );
      setAgreed(true);
    } catch (e) {
      console.error("Failed to save cookie preferences:", e);
    }
    if (close) {
      applyConsent(preferences);
      setShowBanner(false);
      setShowSettings(false);
    }
  }

  function acceptAll() {
    const newPrefs = { necessary: true, functional: true, analytics: true };
    setPreferences(newPrefs);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: CONSENT_VERSION,
          preferences: newPrefs,
          agreed: true,
          timestamp: Date.now(),
        })
      );
      setAgreed(true);
      applyConsent(newPrefs);
      setShowBanner(false);
      setShowSettings(false);
    } catch (e) {
      console.error("Failed to save cookie preferences:", e);
    }
  }

  function acceptNecessary() {
    const newPrefs = { necessary: true, functional: false, analytics: false };
    setPreferences(newPrefs);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: CONSENT_VERSION,
          preferences: newPrefs,
          agreed: true,
          timestamp: Date.now(),
        })
      );
      setAgreed(true);
      applyConsent(newPrefs);
      setShowBanner(false);
      setShowSettings(false);
    } catch (e) {
      console.error("Failed to save cookie preferences:", e);
    }
  }

  function withdrawConsent() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setAgreed(false);
    setReadAgreement(false);
    setReadPrivacy(false);
    setShowBanner(true);
    setShowSettings(false);
  }

  function applyConsent(prefs: ConsentPreferences) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("cookie-consent-updated", { detail: prefs })
      );
    }
  }

  if (!showBanner && !showSettings) return null;

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && (
        <div className="fixed inset-0 z-50 bg-background/80">
          <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6">
            <Card className="mx-auto max-w-3xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5" />
                  隐私与协议
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-3">
                  继续使用本网站即表示你同意以下协议及隐私政策中所述的 Cookie 使用方式。
                </p>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    点击&quot;接受全部&quot;即表示您同意我们使用所有 Cookie，您也可以点击&quot;自定义设置&quot;来选择您希望启用的 Cookie 类型。
                  </p>

                  <label className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                    <Checkbox
                      checked={agreed}
                      disabled={!canAgree}
                      className="mt-0.5"
                      onCheckedChange={(checked) => setAgreed(checked === true)}
                    />
                    <div className="text-xs space-y-1">
                      <span>我已阅读并同意</span>
                      <button
                        type="button"
                        className="text-primary underline hover:text-primary/80"
                        onClick={() => setOverlayContent("agreement")}
                      >
                        《用户协议》
                      </button>
                      <span>和</span>
                      <button
                        type="button"
                        className="text-primary underline hover:text-primary/80"
                        onClick={() => setOverlayContent("privacy")}
                      >
                        《隐私政策》
                      </button>
                    </div>
                    <div className={`text-[10px] ${canAgree ? "text-green-600" : "text-red-500"}`}>
                      {canAgree ? (
                        "已完整阅读以上协议 ✓"
                      ) : (
                        <span>
                          您还需要完整阅读{!readAgreement ? "《用户协议》" : ""}
                          {!readAgreement && !readPrivacy ? "和" : ""}
                          {!readPrivacy ? "《隐私政策》" : ""}后方可勾选该复选框
                        </span>
                      )}
                    </div>
                  </label>

                  <div className="flex flex-wrap gap-3">
                    <Button onClick={acceptAll} disabled={!agreed}>
                      <Check className="mr-2 h-4 w-4" />
                      接受全部
                    </Button>
                    <Button variant="outline" onClick={acceptNecessary} disabled={!agreed}>
                      仅必要 Cookie
                    </Button>
                    <Button variant="outline" onClick={() => setShowSettings(true)} disabled={!agreed}>
                      <Settings className="mr-2 h-4 w-4" />
                      自定义设置
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Cookie Settings Dialog */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>隐私与协议设置</span>
                <button onClick={() => setShowSettings(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 py-4">
                <label className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                  <Checkbox
                    checked={agreed}
                    disabled={!canAgree}
                    className="mt-0.5"
                    onCheckedChange={(checked) => setAgreed(checked === true)}
                  />
                  <div className="text-xs space-y-1">
                    <span>我已阅读并同意</span>
                    <button
                      type="button"
                      className="text-primary underline hover:text-primary/80"
                      onClick={() => setOverlayContent("agreement")}
                    >
                      《用户协议》
                    </button>
                    <span>和</span>
                    <button
                      type="button"
                      className="text-primary underline hover:text-primary/80"
                      onClick={() => setOverlayContent("privacy")}
                    >
                      《隐私政策》
                    </button>
                  </div>
                  <div className={`text-[10px] ${canAgree ? "text-green-600" : "text-red-500"}`}>
                    {canAgree ? (
                      "已完整阅读以上协议 ✓"
                    ) : (
                      <span>
                        您还需要完整阅读{!readAgreement ? "《用户协议》" : ""}
                        {!readAgreement && !readPrivacy ? "和" : ""}
                        {!readPrivacy ? "《隐私政策》" : ""}后方可勾选该复选框
                      </span>
                    )}
                  </div>
                </label>

                {/* Necessary Cookies */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox checked={true} disabled={true} className="mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold">必要 Cookie</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-2">
                        这些对于网站的基本功能是必需的，无法禁用。
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>主题偏好 - 亮色/暗色/跟随系统</li>
                        <li>Cookie 同意设置</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={preferences.functional}
                      className="mt-1"
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, functional: checked === true })
                      }
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">功能性 Cookie</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-2">
                        这些用于增强网站功能和个性化体验。
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Giscus - 评论系统</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={preferences.analytics}
                      className="mt-1"
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, analytics: checked === true })
                      }
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">分析 Cookie</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-2">
                        这些帮助我们了解访问者如何使用网站。
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Cloudflare Web Analytics - 匿名访问统计</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-col sm:justify-center items-center mt-6">
                <Button variant="destructive" className="w-full max-w-xs" onClick={withdrawConsent}>
                  撤回同意
                </Button>
                <Button className="w-full max-w-xs" onClick={() => savePreferences()} disabled={!agreed}>
                  保存设置
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Agreement/Privacy Overlay */}
      {overlayContent && (
        <div className="fixed inset-0 z-50 bg-background overflow-y-auto" onClick={() => setOverlayContent(null)}>
          <div className="max-w-2xl mx-auto px-6 py-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{overlayContent === "agreement" ? "用户协议" : "隐私政策"}</h2>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setOverlayContent(null)}
              >
                <X className="size-6" />
              </button>
            </div>
            <div className="text-sm space-y-3 leading-relaxed">
              {overlayContent === "agreement" ? (
                <div className="space-y-4">
                  <section>
                    <h3 className="font-bold text-base mb-2">使用条款</h3>
                    <p>欢迎使用 MEMZ-SYSTEM-CORE 的小破站。使用本网站即表示你同意以下条款。</p>
                  </section>
                  <section>
                    <h3 className="font-bold text-base mb-2">内容版权</h3>
                    <p>本博客上的所有原创文章均归作者所有。未经许可，禁止转载、复制或用于商业用途。</p>
                  </section>
                  <section>
                    <h3 className="font-bold text-base mb-2">免责声明</h3>
                    <p>本博客内容仅供参考和学习交流，不构成任何专业建议。作者不对内容的准确性、完整性或时效性作任何保证。</p>
                    <p>你使用本站内容所产生的任何后果由你自行承担。</p>
                  </section>
                  <section>
                    <p className="text-xs text-muted-foreground">最后更新：2026-07-13</p>
                  </section>
                </div>
              ) : (
                <div className="space-y-4">
                  <section>
                    <h3 className="font-bold text-base mb-2">信息收集</h3>
                    <p>本站使用浏览器的 localStorage 存储以下信息：</p>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                      <li><code>theme</code> — 主题偏好（亮色/暗色/跟随系统）</li>
                      <li><code>cookie-consent-preferences</code> — Cookie 同意设置</li>
                    </ul>
                    <p className="mt-2">这些数据仅存储在你自己浏览器中，不会被发送到任何服务器。</p>
                  </section>
                  <section>
                    <h3 className="font-bold text-base mb-2">第三方服务</h3>
                    <p>本站使用 Cloudflare 作为 CDN 和部署平台。访问本站时，Cloudflare 可能会记录你的 IP 地址，受 <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Cloudflare 隐私政策</a>约束。</p>
                  </section>
                  <section>
                    <h3 className="font-bold text-base mb-2">你的选择</h3>
                    <p>你可以随时通过页面底部的「隐私与协议设置」撤回同意，或清除浏览器 localStorage 来删除已存储的数据。</p>
                  </section>
                  <section>
                    <p className="text-xs text-muted-foreground">最后更新：2026-07-13</p>
                  </section>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
                onClick={() => {
                  if (overlayContent === "agreement") setReadAgreement(true);
                  if (overlayContent === "privacy") setReadPrivacy(true);
                  setOverlayContent(null);
                }}
              >
                我已阅读
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
