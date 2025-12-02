import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SafeLife - AI 생활 안전 플랫폼",
  description: "AI 기술로 고령자의 일상을 보호하고, 디지털 세상과의 격차를 줄입니다. 음성 바코드 리더, 키오스크 도우미, 보이스피싱 감지, 보호자 대시보드를 제공합니다.",
  keywords: ["AI", "고령자", "생활안전", "바코드", "키오스크", "보이스피싱", "SafeLife"],
  authors: [{ name: "SafeLife Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SafeLife",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "SafeLife - AI 생활 안전 플랫폼",
    description: "AI 기술로 고령자의 일상을 보호합니다",
    type: "website",
    siteName: "SafeLife",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "SafeLife - AI 생활 안전 플랫폼",
    description: "AI 기술로 고령자의 일상을 보호합니다",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        {/* PWA 관련 메타 태그 */}
        <link rel="apple-touch-icon" href="/images/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/icons/favicon-16x16.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SafeLife" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300`}
      >
        {children}
        <ThemeToggle />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
