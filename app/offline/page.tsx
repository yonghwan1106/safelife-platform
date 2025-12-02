"use client";

import { WifiOff, RefreshCw, Home, Shield } from "lucide-react";

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-6">
      {/* 로고 */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <span className="text-3xl font-bold text-gray-800 dark:text-white">
          SafeLife
        </span>
      </div>

      {/* 오프라인 아이콘 */}
      <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-8">
        <WifiOff className="w-16 h-16 text-gray-400 dark:text-gray-500" />
      </div>

      {/* 메시지 */}
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
        인터넷에 연결되어 있지 않습니다
      </h1>

      <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-8 max-w-md">
        Wi-Fi 또는 모바일 데이터 연결을 확인해 주세요.
        연결이 복구되면 자동으로 다시 시도합니다.
      </p>

      {/* 버튼들 */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <button
          onClick={handleRefresh}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors text-lg"
        >
          <RefreshCw className="w-6 h-6" />
          다시 시도
        </button>

        <button
          onClick={handleGoHome}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-4 px-6 rounded-xl transition-colors text-lg"
        >
          <Home className="w-6 h-6" />
          홈으로
        </button>
      </div>

      {/* 도움말 */}
      <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="font-bold text-gray-800 dark:text-white mb-4 text-lg">
          연결 문제 해결 방법
        </h2>
        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">1.</span>
            <span>Wi-Fi가 켜져 있는지 확인하세요</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">2.</span>
            <span>모바일 데이터가 활성화되어 있는지 확인하세요</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">3.</span>
            <span>비행기 모드가 꺼져 있는지 확인하세요</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">4.</span>
            <span>라우터를 재시작해 보세요</span>
          </li>
        </ul>
      </div>

      {/* 푸터 */}
      <p className="mt-8 text-sm text-gray-400 dark:text-gray-500">
        SafeLife는 오프라인에서도 일부 기능을 사용할 수 있습니다
      </p>
    </div>
  );
}
