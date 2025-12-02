"use client";

import { useState, useEffect } from "react";
import { Download, X, Smartphone, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 이미 설치된 앱인지 확인
    const checkStandalone = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(standalone);
    };

    // iOS 기기 확인
    const checkIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
      const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
      setIsIOS(isIOSDevice && isSafari);
    };

    checkStandalone();
    checkIOS();

    // beforeinstallprompt 이벤트 리스너
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // 이전에 닫은 적이 있는지 확인 (24시간 내)
      const dismissedTime = localStorage.getItem("pwa-prompt-dismissed");
      if (dismissedTime) {
        const timeDiff = Date.now() - parseInt(dismissedTime);
        if (timeDiff < 24 * 60 * 60 * 1000) {
          return; // 24시간 이내에 닫았으면 표시하지 않음
        }
      }

      // 3초 후에 프롬프트 표시
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // iOS Safari에서는 수동 안내 표시
    if (!isStandalone) {
      const checkIOS = () => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
        const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
        if (isIOSDevice && isSafari) {
          const dismissedTime = localStorage.getItem("pwa-prompt-dismissed");
          if (!dismissedTime || Date.now() - parseInt(dismissedTime) > 24 * 60 * 60 * 1000) {
            setTimeout(() => {
              setShowPrompt(true);
            }, 3000);
          }
        }
      };
      checkIOS();
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, [isStandalone]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
  };

  // 이미 설치되었거나 프롬프트를 표시하지 않을 때
  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Smartphone className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg">SafeLife 앱 설치</h3>
                <p className="text-sm text-blue-100">홈 화면에 추가하세요</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 본문 */}
        <div className="p-4">
          {isIOS ? (
            // iOS Safari 안내
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 text-base">
                SafeLife를 홈 화면에 추가하면 앱처럼 빠르게 사용할 수 있습니다.
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                    1
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 dark:text-gray-200">
                      하단의
                    </span>
                    <Share className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-200">
                      공유 버튼을 누르세요
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                    2
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">
                    &quot;홈 화면에 추가&quot;를 선택하세요
                  </span>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="w-full py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                알겠습니다
              </button>
            </div>
          ) : (
            // Android/Chrome 설치 버튼
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 text-base">
                SafeLife를 설치하면 인터넷 없이도 사용할 수 있고, 앱처럼 빠르게
                실행됩니다.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDismiss}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  나중에
                </button>
                <button
                  onClick={handleInstall}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  설치하기
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 혜택 */}
        <div className="px-4 pb-4">
          <div className="flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <span className="text-green-500">✓</span> 오프라인 사용
            </span>
            <span className="flex items-center gap-1">
              <span className="text-green-500">✓</span> 빠른 실행
            </span>
            <span className="flex items-center gap-1">
              <span className="text-green-500">✓</span> 무료
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
