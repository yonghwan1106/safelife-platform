import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Text-to-Speech using Web Speech API
 */
export function speak(text: string, lang: string = 'ko-KR'): void {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech first
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // Get Korean voice if available
    const voices = window.speechSynthesis.getVoices()
    const koreanVoice = voices.find(voice => voice.lang.includes('ko'))
    if (koreanVoice) {
      utterance.voice = koreanVoice
    }

    // Fix for Chrome bug where speech doesn't work after idle
    // Resume speechSynthesis if it's paused
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    }

    window.speechSynthesis.speak(utterance)

    // Chrome workaround: keep speech alive
    const keepAlive = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearInterval(keepAlive)
      } else {
        window.speechSynthesis.pause()
        window.speechSynthesis.resume()
      }
    }, 10000)
  }
}

/**
 * Stop current speech
 */
export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

/**
 * Format date for Korean locale
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/**
 * Detect voice phishing patterns in text
 */
export function detectVoicePhishingPatterns(text: string): {
  isRisky: boolean
  riskLevel: 'low' | 'medium' | 'high'
  detectedPatterns: string[]
} {
  const patterns = {
    high: [
      '계좌번호',
      '송금',
      '입금',
      '비밀번호',
      '금융감독원',
      '검찰청',
      '경찰청',
      '체포',
      '구속',
      '압수수색',
    ],
    medium: [
      '대출',
      '저금리',
      '카드발급',
      '현금',
      '환불',
      '보이스피싱',
      '사기',
      '신용등급',
    ],
    low: [
      '긴급',
      '즉시',
      '지금',
      '빨리',
      '서둘러',
    ]
  }

  const detectedPatterns: string[] = []
  let riskLevel: 'low' | 'medium' | 'high' = 'low'

  // Check high-risk patterns
  for (const pattern of patterns.high) {
    if (text.includes(pattern)) {
      detectedPatterns.push(pattern)
      riskLevel = 'high'
    }
  }

  // Check medium-risk patterns
  if (riskLevel !== 'high') {
    for (const pattern of patterns.medium) {
      if (text.includes(pattern)) {
        detectedPatterns.push(pattern)
        riskLevel = 'medium'
      }
    }
  }

  // Check low-risk patterns
  if (riskLevel === 'low') {
    for (const pattern of patterns.low) {
      if (text.includes(pattern)) {
        detectedPatterns.push(pattern)
      }
    }
  }

  return {
    isRisky: detectedPatterns.length > 0,
    riskLevel,
    detectedPatterns,
  }
}
