'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mic, MicOff, AlertTriangle, Shield, Phone, Info, Bell, Brain, Sparkles, Play, PhoneCall, User, Clock, ChevronRight } from 'lucide-react'
import { speak } from '@/lib/utils'
import { analyzeVoicePhishingWithGPT4 } from '@/lib/openai-service'
import PageHeader from '@/components/PageHeader'
import { MOCK_PHISHING_SCENARIOS, type PhishingScenario } from '@/lib/mock-data'

// 시나리오별 이미지
const scenarioImages: Record<string, string> = {
  'government': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&h=200&fit=crop&q=80',
  'financial': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop&q=80',
  'loan': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=200&fit=crop&q=80',
  'delivery': 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&h=200&fit=crop&q=80',
  'default': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&h=200&fit=crop&q=80'
}

interface CallAnalysis {
  timestamp: Date
  transcription: string
  riskLevel: 'low' | 'medium' | 'high'
  confidence: number
  detectedPatterns: string[]
  recommendation: string
  reasoning: string
  suspiciousKeywords: string[]
  isAIAnalyzed: boolean
}

export default function VoicePhishingPage() {
  const [isListening, setIsListening] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [currentAnalysis, setCurrentAnalysis] = useState<CallAnalysis | null>(null)
  const [callHistory, setCallHistory] = useState<CallAnalysis[]>([])
  const [guardianNotified, setGuardianNotified] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<string[]>([])
  const recognitionRef = useRef<any>(null)

  // Demo mode states
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState<PhishingScenario | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [showScenarioSelector, setShowScenarioSelector] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check if browser supports Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'ko-KR'

        recognitionRef.current.onresult = (event: any) => {
          let interim = ''
          let final = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              final += transcript + ' '
            } else {
              interim += transcript
            }
          }

          if (final) {
            setCurrentTranscript(prev => prev + final)
            analyzeTranscript(final)
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
        }
      }
    }

    return () => {
      stopListening()
      stopDemoMode()
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
        setIsListening(true)
        setCurrentTranscript('')
        setCurrentAnalysis(null)
        setGuardianNotified(false)
        speak('통화 모니터링을 시작합니다. 안전하게 대화하세요.')
      } catch (error) {
        console.error('Failed to start recognition:', error)
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop()
        setIsListening(false)
      } catch (error) {
        console.error('Failed to stop recognition:', error)
      }
    }
  }

  const analyzeTranscript = async (text: string) => {
    setConversationHistory(prev => [...prev, text])
    setIsAnalyzing(true)

    try {
      const analysis = await analyzeVoicePhishingWithGPT4(text, {
        previousTranscripts: conversationHistory
      })

      if (analysis.isRisky) {
        const callAnalysis: CallAnalysis = {
          timestamp: new Date(),
          transcription: text,
          riskLevel: analysis.riskLevel,
          confidence: analysis.confidence,
          detectedPatterns: analysis.detectedPatterns,
          recommendation: analysis.recommendation,
          reasoning: analysis.reasoning,
          suspiciousKeywords: analysis.suspiciousKeywords,
          isAIAnalyzed: true
        }

        setCurrentAnalysis(callAnalysis)
        setCallHistory(prev => [callAnalysis, ...prev].slice(0, 10))

        if (analysis.riskLevel === 'high' && analysis.confidence > 70) {
          speak('위험! AI가 보이스피싱을 감지했습니다. 절대 개인정보를 제공하지 마세요. 전화를 끊으세요.')
          notifyGuardian(callAnalysis)
        } else if (analysis.riskLevel === 'high') {
          speak('보이스피싱 가능성이 높습니다. 매우 주의하세요.')
          notifyGuardian(callAnalysis)
        } else if (analysis.riskLevel === 'medium') {
          speak('주의하세요. AI가 의심스러운 내용을 감지했습니다.')
        } else if (analysis.riskLevel === 'low') {
          speak('주의가 필요한 단어가 감지되었습니다.')
        }
      }
    } catch (error) {
      console.error('Analysis error:', error)
      speak('분석 중 오류가 발생했습니다. 계속 주의하세요.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const notifyGuardian = (analysis: CallAnalysis) => {
    setGuardianNotified(true)
    console.log('Guardian notified:', analysis)
  }

  // Demo mode functions
  const startDemoMode = (scenario: PhishingScenario) => {
    stopListening()
    setSelectedScenario(scenario)
    setIsDemoMode(true)
    setShowScenarioSelector(false)
    setCurrentTranscript('')
    setDisplayedText('')
    setCurrentAnalysis(null)
    setGuardianNotified(false)
    setCallDuration(0)

    speak(`${scenario.typeName} 시나리오 데모를 시작합니다.`)

    // Start call duration timer
    durationIntervalRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1)
    }, 1000)

    // Start typing animation after a short delay
    setTimeout(() => {
      startTypingAnimation(scenario.transcript, scenario)
    }, 2000)
  }

  const startTypingAnimation = (text: string, scenario: PhishingScenario) => {
    setIsTyping(true)
    let index = 0

    typingIntervalRef.current = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        // Typing complete, analyze
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current)
        }
        setIsTyping(false)
        setCurrentTranscript(text)
        analyzeScenario(scenario)
      }
    }, 50) // 50ms per character
  }

  const analyzeScenario = (scenario: PhishingScenario) => {

    setIsAnalyzing(true)

    // Simulate analysis delay
    setTimeout(() => {
      const callAnalysis: CallAnalysis = {
        timestamp: new Date(),
        transcription: scenario.transcript,
        riskLevel: scenario.riskLevel,
        confidence: scenario.riskLevel === 'high' ? 92 : scenario.riskLevel === 'medium' ? 78 : 55,
        detectedPatterns: scenario.patterns,
        recommendation: scenario.recommendation,
        reasoning: `이 통화는 "${scenario.typeName}" 유형의 보이스피싱으로 판단됩니다. ${scenario.patterns.join(', ')} 등의 특징이 감지되었습니다.`,
        suspiciousKeywords: extractKeywords(scenario.transcript),
        isAIAnalyzed: true
      }

      setCurrentAnalysis(callAnalysis)
      setCallHistory(prev => [callAnalysis, ...prev].slice(0, 10))
      setIsAnalyzing(false)

      // Voice alert
      if (scenario.riskLevel === 'high') {
        speak('위험! 보이스피싱이 감지되었습니다. 즉시 전화를 끊으세요.')
        setGuardianNotified(true)
      } else if (scenario.riskLevel === 'medium') {
        speak('주의! 의심스러운 통화가 감지되었습니다.')
      } else {
        speak('주의가 필요한 통화입니다.')
      }
    }, 2000)
  }

  const extractKeywords = (text: string): string[] => {
    const keywords = ['금융감독원', '검찰', '계좌번호', '송금', '비밀번호', '대출', '저금리', '긴급', '안전계좌', '환급', '압수수색']
    return keywords.filter(k => text.includes(k))
  }

  const stopDemoMode = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current)
    }
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
    }
    setIsDemoMode(false)
    setSelectedScenario(null)
    setIsTyping(false)
    setDisplayedText('')
    setCallDuration(0)
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Get risk meter position (0-100)
  const getRiskMeterPosition = (): number => {
    if (!currentAnalysis) return 0
    if (currentAnalysis.riskLevel === 'low') return 20
    if (currentAnalysis.riskLevel === 'medium') return 55
    return 85
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-pink-50 to-orange-50"></div>
        <div className="absolute inset-0 pattern-dots opacity-30"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-20 left-40 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <PageHeader
        title="보이스피싱 실시간 감지"
        description="AI가 통화 내용을 실시간 분석하여 보이스피싱을 차단합니다"
        icon={Shield}
        gradientFrom="from-red-400"
        gradientTo="to-pink-500"
      />

      <main className="max-w-6xl mx-auto px-4 pb-8">
        {/* Instructions */}
        <div className="relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-6 mb-6 overflow-hidden border border-red-100">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-pink-500"></div>
          <div className="flex items-start">
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 mr-4">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">사용 방법</h3>
              <ol className="list-decimal list-inside text-red-800 space-y-1">
                <li className="text-base">통화 중 모니터링 시작 버튼을 눌러주세요</li>
                <li className="text-base">AI가 실시간으로 통화 내용을 분석합니다</li>
                <li className="text-base">위험 감지 시 즉시 경고 알림을 받습니다</li>
                <li className="text-base">높은 위험도 감지 시 보호자에게 자동 알림</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Scenario Selector Modal */}
        {showScenarioSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">시나리오 선택</h2>
              <p className="text-gray-600 mb-6">체험할 보이스피싱 시나리오를 선택하세요</p>

              <div className="space-y-3">
                {MOCK_PHISHING_SCENARIOS.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => startDemoMode(scenario)}
                    className={`w-full rounded-xl border-2 text-left transition-all hover:shadow-lg overflow-hidden ${
                      scenario.riskLevel === 'high'
                        ? 'border-red-200 hover:border-red-400 bg-red-50'
                        : scenario.riskLevel === 'medium'
                        ? 'border-yellow-200 hover:border-yellow-400 bg-yellow-50'
                        : 'border-blue-200 hover:border-blue-400 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-stretch">
                      {/* Scenario Image */}
                      <div className="relative w-28 h-24 flex-shrink-0">
                        <Image
                          src={scenarioImages[scenario.id] || scenarioImages['default']}
                          alt={scenario.title}
                          fill
                          className="object-cover"
                        />
                        <div className={`absolute inset-0 ${
                          scenario.riskLevel === 'high'
                            ? 'bg-red-500/30'
                            : scenario.riskLevel === 'medium'
                            ? 'bg-yellow-500/30'
                            : 'bg-blue-500/30'
                        }`}></div>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            scenario.riskLevel === 'high'
                              ? 'bg-red-200 text-red-800'
                              : scenario.riskLevel === 'medium'
                              ? 'bg-yellow-200 text-yellow-800'
                              : 'bg-blue-200 text-blue-800'
                          }`}>
                            {scenario.riskLevel === 'high' ? '높은 위험' : scenario.riskLevel === 'medium' ? '중간 위험' : '낮은 위험'}
                          </span>
                          <span className="text-sm text-gray-500">{scenario.typeName}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">{scenario.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{scenario.transcript.slice(0, 80)}...</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 self-center mr-3" />
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowScenarioSelector(false)}
                className="mt-6 w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Monitoring Panel */}
          <div className="relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-8 overflow-hidden border border-red-100">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-pink-500"></div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">통화 모니터링</h2>
              {(isListening || isDemoMode) && (
                <div className="flex items-center space-x-2 bg-red-100 text-red-700 px-3 py-1 rounded-full animate-pulse">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-sm font-medium">
                    {isDemoMode ? '데모 진행 중' : '감지 중'}
                  </span>
                </div>
              )}
            </div>

            {/* Call Simulation UI for Demo Mode */}
            {isDemoMode && selectedScenario && (
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 mb-6">
                {/* Call header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">발신자 미확인</p>
                      <p className="text-gray-400 text-sm">{selectedScenario.typeName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono">{formatDuration(callDuration)}</span>
                  </div>
                </div>

                {/* Transcript with typing animation */}
                <div className="bg-black/30 rounded-xl p-4 min-h-[120px]">
                  <p className="text-sm text-gray-400 mb-2">통화 내용:</p>
                  <p className="text-white leading-relaxed">
                    {displayedText}
                    {isTyping && <span className="animate-blink-cursor">|</span>}
                  </p>
                </div>

                {/* Call status */}
                <div className="mt-4 flex items-center justify-center gap-4">
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Brain className="w-5 h-5 animate-pulse" />
                      <span className="text-sm">AI 분석 중...</span>
                    </div>
                  ) : isTyping ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <PhoneCall className="w-5 h-5 animate-pulse" />
                      <span className="text-sm">통화 진행 중...</span>
                    </div>
                  ) : currentAnalysis ? (
                    <div className={`flex items-center gap-2 ${
                      currentAnalysis.riskLevel === 'high' ? 'text-red-400' :
                      currentAnalysis.riskLevel === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                    }`}>
                      <Shield className="w-5 h-5" />
                      <span className="text-sm">분석 완료</span>
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {/* Microphone Status (non-demo) */}
            {!isDemoMode && (
              <div className="bg-gray-900 rounded-lg p-8 mb-6 flex flex-col items-center justify-center">
                {isListening ? (
                  <>
                    <div className="relative mb-4">
                      <div className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                        <Mic className="w-16 h-16 text-white" />
                      </div>
                      <div className="absolute inset-0 w-32 h-32 bg-red-500 rounded-full animate-ping opacity-20"></div>
                    </div>
                    <p className="text-white text-lg font-medium">통화 내용 실시간 분석 중...</p>
                    {isAnalyzing && (
                      <div className="mt-3 flex items-center space-x-2 text-yellow-300">
                        <Brain className="w-5 h-5 animate-pulse" />
                        <span className="text-sm">GPT-4 AI 분석 중...</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <MicOff className="w-16 h-16 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-lg font-medium">대기 중</p>
                  </>
                )}
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-col space-y-3">
              {!isListening && !isDemoMode ? (
                <>
                  <button
                    onClick={startListening}
                    className="bg-red-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-red-700 transition-all text-lg shadow-lg flex items-center justify-center space-x-2 hover:scale-105"
                  >
                    <Shield className="w-6 h-6" />
                    <span>실제 모니터링 시작</span>
                  </button>
                  <button
                    onClick={() => setShowScenarioSelector(true)}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all text-lg shadow-lg flex items-center justify-center space-x-2 hover:scale-105"
                  >
                    <Sparkles className="w-6 h-6" />
                    <span>시나리오 데모 ({MOCK_PHISHING_SCENARIOS.length}개)</span>
                  </button>
                </>
              ) : isDemoMode ? (
                <button
                  onClick={stopDemoMode}
                  className="bg-gray-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-700 transition-all text-lg shadow-lg flex items-center justify-center space-x-2"
                >
                  <MicOff className="w-6 h-6" />
                  <span>데모 종료</span>
                </button>
              ) : (
                <button
                  onClick={stopListening}
                  className="bg-gray-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-700 transition-all text-lg shadow-lg flex items-center justify-center space-x-2"
                >
                  <MicOff className="w-6 h-6" />
                  <span>모니터링 중지</span>
                </button>
              )}
            </div>

            {/* Current Transcript (non-demo) */}
            {currentTranscript && !isDemoMode && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">인식된 음성</h3>
                <p className="text-gray-900">{currentTranscript}</p>
              </div>
            )}
          </div>

          {/* Analysis Result */}
          <div className={`relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-8 overflow-hidden border transition-all duration-500 ${
            currentAnalysis?.riskLevel === 'high' ? 'border-red-400 ring-4 ring-red-200 animate-alert-pulse' :
            currentAnalysis?.riskLevel === 'medium' ? 'border-yellow-400 ring-2 ring-yellow-200' :
            'border-red-100'
          }`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-pink-500"></div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">분석 결과</h2>

            {currentAnalysis ? (
              <div className="space-y-4">
                {/* Risk Meter */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">위험도 측정</h4>
                  <div className="risk-meter">
                    <div
                      className="risk-meter-indicator"
                      style={{
                        left: `${getRiskMeterPosition()}%`,
                        borderColor: currentAnalysis.riskLevel === 'high' ? '#ef4444' :
                                     currentAnalysis.riskLevel === 'medium' ? '#eab308' : '#22c55e'
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>안전</span>
                    <span>주의</span>
                    <span>위험</span>
                  </div>
                </div>

                {/* Risk Level Alert */}
                <div
                  className={`rounded-xl p-6 ${
                    currentAnalysis.riskLevel === 'high'
                      ? 'bg-red-100 border-2 border-red-500'
                      : currentAnalysis.riskLevel === 'medium'
                      ? 'bg-yellow-100 border-2 border-yellow-500'
                      : 'bg-blue-100 border-2 border-blue-500'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <AlertTriangle
                      className={`w-8 h-8 flex-shrink-0 ${
                        currentAnalysis.riskLevel === 'high'
                          ? 'text-red-600'
                          : currentAnalysis.riskLevel === 'medium'
                          ? 'text-yellow-600'
                          : 'text-blue-600'
                      }`}
                    />
                    <div className="flex-1">
                      <h3
                        className={`text-xl font-bold mb-2 ${
                          currentAnalysis.riskLevel === 'high'
                            ? 'text-red-900'
                            : currentAnalysis.riskLevel === 'medium'
                            ? 'text-yellow-900'
                            : 'text-blue-900'
                        }`}
                      >
                        {currentAnalysis.riskLevel === 'high'
                          ? '🚨 높은 위험 - 즉시 조치 필요'
                          : currentAnalysis.riskLevel === 'medium'
                          ? '⚠️ 중간 위험 - 주의 필요'
                          : 'ℹ️ 낮은 위험 - 주의 권고'}
                      </h3>
                      <p
                        className={`text-base leading-relaxed ${
                          currentAnalysis.riskLevel === 'high'
                            ? 'text-red-800'
                            : currentAnalysis.riskLevel === 'medium'
                            ? 'text-yellow-800'
                            : 'text-blue-800'
                        }`}
                      >
                        {currentAnalysis.recommendation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Analysis Info */}
                {currentAnalysis.isAIAnalyzed && (
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        <h4 className="font-semibold text-purple-900">AI 분석 결과</h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-purple-700">신뢰도:</span>
                        <span className="font-bold text-purple-900">{currentAnalysis.confidence}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-purple-800 leading-relaxed">{currentAnalysis.reasoning}</p>
                  </div>
                )}

                {/* Detected Patterns */}
                {currentAnalysis.detectedPatterns.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">감지된 위험 패턴</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentAnalysis.detectedPatterns.map((pattern, idx) => (
                        <span
                          key={idx}
                          className="bg-red-200 text-red-900 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {pattern}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suspicious Keywords */}
                {currentAnalysis.suspiciousKeywords && currentAnalysis.suspiciousKeywords.length > 0 && (
                  <div className="bg-orange-50 rounded-xl p-4">
                    <h4 className="font-semibold text-orange-900 mb-3">의심 키워드</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentAnalysis.suspiciousKeywords.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="bg-orange-200 text-orange-900 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Guardian Notification */}
                {guardianNotified && (
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-xl animate-fade-in-up">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-6 h-6 text-purple-600" />
                      <div>
                        <h4 className="font-semibold text-purple-900">보호자 알림 발송됨</h4>
                        <p className="text-sm text-purple-800">
                          등록된 보호자에게 긴급 알림이 전송되었습니다
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Emergency Actions */}
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">긴급 조치</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="tel:112"
                      className="block bg-red-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all text-center hover:scale-105"
                    >
                      112 신고
                    </a>
                    <a
                      href="tel:1332"
                      className="block bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all text-center hover:scale-105"
                    >
                      금융감독원
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Shield className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg">모니터링을 시작하거나</p>
                <p className="text-lg">시나리오 데모를 선택하면</p>
                <p className="text-lg">분석 결과가 표시됩니다</p>
              </div>
            )}
          </div>
        </div>

        {/* Call History */}
        {callHistory.length > 0 && (
          <div className="mt-6 relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-6 overflow-hidden border border-red-100">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-pink-500"></div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">감지 기록</h2>
            <div className="space-y-3">
              {callHistory.map((call, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border-l-4 transition-all ${
                    call.riskLevel === 'high'
                      ? 'border-red-500 bg-red-50'
                      : call.riskLevel === 'medium'
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">
                        {call.timestamp.toLocaleTimeString('ko-KR')}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          call.riskLevel === 'high'
                            ? 'bg-red-200 text-red-800'
                            : call.riskLevel === 'medium'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-blue-200 text-blue-800'
                        }`}
                      >
                        {call.riskLevel === 'high'
                          ? '높은 위험'
                          : call.riskLevel === 'medium'
                          ? '중간 위험'
                          : '낮은 위험'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">신뢰도 {call.confidence}%</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">{call.transcription}</p>
                  <div className="flex flex-wrap gap-1">
                    {call.detectedPatterns.map((pattern, pidx) => (
                      <span
                        key={pidx}
                        className="bg-white px-2 py-0.5 rounded text-xs font-medium text-gray-700"
                      >
                        {pattern}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-xl">
          <div className="flex items-start">
            <Info className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">보이스피싱 예방 수칙</h3>
              <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
                <li>공공기관이 전화로 계좌번호나 비밀번호를 요구하지 않습니다</li>
                <li>의심스러운 전화는 즉시 끊고 공식 번호로 재확인하세요</li>
                <li>금융거래는 반드시 공식 앱이나 홈페이지를 이용하세요</li>
                <li>개인정보와 금융정보는 절대 전화로 알려주지 마세요</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
