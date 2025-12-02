'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Webcam from 'react-webcam'
import { Smartphone, Camera, Volume2, Info, Zap, StopCircle, Play, Pause, SkipForward, RotateCcw, Sparkles, CheckCircle, Coffee, Utensils, Train, CreditCard, Building2, Hand } from 'lucide-react'
import { speak, stopSpeaking } from '@/lib/utils'
import PageHeader from '@/components/PageHeader'
import { MOCK_KIOSK_SCENARIOS, getKioskScenario, getKioskTypes, type KioskScenario, type KioskStep } from '@/lib/mock-data'

// Icon mapping for kiosk types
const kioskIcons: Record<string, any> = {
  fastfood: Utensils,
  cafe: Coffee,
  ticket: Train,
  atm: CreditCard,
  hospital: Building2
}

// Kiosk type images
const kioskImages: Record<string, string> = {
  fastfood: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop&q=80',
  cafe: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop&q=80',
  ticket: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=200&fit=crop&q=80',
  atm: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop&q=80',
  hospital: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&h=200&fit=crop&q=80'
}

export default function KioskPage() {
  const [isCapturing, setIsCapturing] = useState(false)
  const [currentStep, setCurrentStep] = useState<KioskStep | null>(null)
  const [analysisHistory, setAnalysisHistory] = useState<KioskStep[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const webcamRef = useRef<Webcam>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Demo mode states
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [selectedKioskType, setSelectedKioskType] = useState<string | null>(null)
  const [currentScenario, setCurrentScenario] = useState<KioskScenario | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isDemoPaused, setIsDemoPaused] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const demoIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const kioskTypes = getKioskTypes()

  useEffect(() => {
    return () => {
      stopCapture()
      stopSpeaking()
      stopDemoMode()
    }
  }, [])

  // Demo auto-advance effect
  useEffect(() => {
    if (isDemoMode && !isDemoPaused && currentStep && currentScenario) {
      demoIntervalRef.current = setTimeout(() => {
        if (currentStepIndex < currentScenario.steps.length - 1) {
          advanceDemoStep()
        } else {
          // Demo complete
          speak('키오스크 주문이 완료되었습니다. 축하합니다! 처음부터 다시 보시려면 다시 시작 버튼을 눌러주세요.')
          setShowSuccess(true)
        }
      }, 6000) // 6 seconds per step
    }
    return () => {
      if (demoIntervalRef.current) {
        clearTimeout(demoIntervalRef.current)
      }
    }
  }, [isDemoMode, isDemoPaused, currentStep, currentStepIndex, currentScenario])

  // Select kiosk type
  const selectKioskType = (type: string) => {
    setSelectedKioskType(type)
    const scenario = getKioskScenario(type)
    setCurrentScenario(scenario)
  }

  // Start demo mode
  const startDemoMode = () => {
    if (!currentScenario) return

    stopCapture()
    setIsDemoMode(true)
    setIsDemoPaused(false)
    setCurrentStepIndex(0)
    setAnalysisHistory([])
    setShowSuccess(false)

    speak(`${currentScenario.name} 데모를 시작합니다. ${currentScenario.steps.length}단계로 안내해 드리겠습니다.`)

    // Start with first step after intro
    setTimeout(() => {
      showDemoStep(0)
    }, 3000)
  }

  // Show demo step with animation
  const showDemoStep = (index: number) => {
    if (!currentScenario) return

    setIsAnalyzing(true)
    setShowSuccess(false)

    // Simulate analyzing animation
    setTimeout(() => {
      setIsAnalyzing(false)
      const step = currentScenario.steps[index]
      setCurrentStep(step)
      setCurrentStepIndex(index)
      setAnalysisHistory(prev => [step, ...prev].slice(0, 5))
      speakInstruction(step)
    }, 1500)
  }

  // Advance to next step
  const advanceDemoStep = () => {
    const nextIndex = currentStepIndex + 1
    if (currentScenario && nextIndex < currentScenario.steps.length) {
      showDemoStep(nextIndex)
    }
  }

  // Skip to next step manually
  const skipToNext = () => {
    if (demoIntervalRef.current) {
      clearTimeout(demoIntervalRef.current)
    }
    advanceDemoStep()
  }

  // Toggle demo pause
  const toggleDemoPause = () => {
    setIsDemoPaused(!isDemoPaused)
    if (isDemoPaused) {
      speak('데모를 재개합니다.')
    } else {
      speak('데모를 일시정지했습니다.')
    }
  }

  // Restart demo
  const restartDemo = () => {
    if (demoIntervalRef.current) {
      clearTimeout(demoIntervalRef.current)
    }
    setCurrentStepIndex(0)
    setIsDemoPaused(false)
    setShowSuccess(false)
    setAnalysisHistory([])
    speak('데모를 처음부터 다시 시작합니다.')
    showDemoStep(0)
  }

  // Stop demo mode
  const stopDemoMode = () => {
    if (demoIntervalRef.current) {
      clearTimeout(demoIntervalRef.current)
    }
    setIsDemoMode(false)
    setCurrentStep(null)
    setCurrentStepIndex(0)
    setIsDemoPaused(false)
    setIsAnalyzing(false)
    setShowSuccess(false)
    setAnalysisHistory([])
  }

  // Back to type selection
  const backToSelection = () => {
    stopDemoMode()
    setSelectedKioskType(null)
    setCurrentScenario(null)
  }

  // Original capture functions (for real camera mode)
  const startCapture = () => {
    setIsCapturing(true)
    setAnalysisHistory([])
    speak('키오스크 화면 분석을 시작합니다. 키오스크 화면을 카메라에 비춰주세요.')

    intervalRef.current = setInterval(() => {
      analyzeScreen()
    }, 3000)
  }

  const stopCapture = () => {
    setIsCapturing(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const analyzeScreen = async () => {
    if (!webcamRef.current || !currentScenario) return

    const imageSrc = webcamRef.current.getScreenshot()
    if (!imageSrc) return

    // Use sequential step for demo (instead of random)
    const nextIndex = (currentStepIndex + 1) % currentScenario.steps.length
    const step = currentScenario.steps[nextIndex]

    setCurrentStep(step)
    setCurrentStepIndex(nextIndex)
    setAnalysisHistory(prev => [step, ...prev].slice(0, 5))
    speakInstruction(step)
  }

  const speakInstruction = (step: KioskStep) => {
    setIsSpeaking(true)
    const message = `단계 ${step.step}, ${step.screenName}. ${step.voiceGuide}`
    speak(message)
    setTimeout(() => setIsSpeaking(false), message.length * 80)
  }

  const repeatInstruction = () => {
    if (currentStep) {
      speakInstruction(currentStep)
    }
  }

  // Render kiosk type selection
  if (!selectedKioskType) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50"></div>
          <div className="absolute inset-0 pattern-dots opacity-30"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-20 left-40 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <PageHeader
          title="AI 키오스크 도우미"
          description="화면을 인식하여 주문 과정을 단계별로 안내합니다"
          icon={Smartphone}
          gradientFrom="from-blue-400"
          gradientTo="to-cyan-500"
        />

        <main className="max-w-4xl mx-auto px-4 pb-8">
          {/* Type Selection */}
          <div className="relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-8 overflow-hidden border border-blue-100">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-500"></div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">키오스크 종류 선택</h2>
              <p className="text-gray-600">도움이 필요한 키오스크 종류를 선택해주세요</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {kioskTypes.map((kiosk) => {
                const IconComponent = kioskIcons[kiosk.type] || Smartphone
                return (
                  <button
                    key={kiosk.type}
                    onClick={() => selectKioskType(kiosk.type)}
                    className="group relative bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    {/* Background Image */}
                    <div className="relative h-24 overflow-hidden">
                      <Image
                        src={kioskImages[kiosk.type] || kioskImages.cafe}
                        alt={kiosk.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="p-4 flex flex-col items-center gap-2">
                      <span className="text-3xl">{kiosk.icon}</span>
                      <span className="font-semibold text-gray-900">{kiosk.name}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            <p className="text-center text-gray-500 mt-8 text-sm">
              선택하시면 해당 키오스크의 주문 과정을 단계별로 안내해 드립니다
            </p>
          </div>
        </main>
      </div>
    )
  }

  // Main kiosk helper UI (after type selection)
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50"></div>
        <div className="absolute inset-0 pattern-dots opacity-30"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-20 left-40 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <PageHeader
        title="AI 키오스크 도우미"
        description={currentScenario ? `${currentScenario.icon} ${currentScenario.name} - ${currentScenario.location}` : "화면을 인식하여 주문 과정을 단계별로 안내합니다"}
        icon={Smartphone}
        gradientFrom="from-blue-400"
        gradientTo="to-cyan-500"
      />

      <main className="max-w-6xl mx-auto px-4 pb-8">
        {/* Back button and info */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={backToSelection}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            ← 다른 키오스크 선택
          </button>
          {currentScenario && (
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-2xl">{currentScenario.icon}</span>
              <span className="font-medium">{currentScenario.name}</span>
              <span className="text-sm text-gray-400">({currentScenario.steps.length}단계)</span>
            </div>
          )}
        </div>

        {/* Demo Mode Progress & Controls */}
        {isDemoMode && currentScenario && (
          <div className="relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-6 mb-6 overflow-hidden border border-purple-200">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-indigo-500"></div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>진행률</span>
                <span>{currentStepIndex + 1} / {currentScenario.steps.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStepIndex + 1) / currentScenario.steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-4 flex-wrap">
              {currentScenario.steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    idx < currentStepIndex
                      ? 'bg-green-500'
                      : idx === currentStepIndex
                      ? 'bg-blue-500 scale-125'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Control buttons */}
            <div className="flex justify-center gap-3 flex-wrap">
              <button
                onClick={toggleDemoPause}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                  isDemoPaused
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                {isDemoPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                {isDemoPaused ? '재개' : '일시정지'}
              </button>
              <button
                onClick={skipToNext}
                disabled={currentStepIndex >= currentScenario.steps.length - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-full font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SkipForward className="w-5 h-5" />
                다음 단계
              </button>
              <button
                onClick={restartDemo}
                className="flex items-center gap-2 px-4 py-2 rounded-full font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                처음부터
              </button>
              <button
                onClick={stopDemoMode}
                className="flex items-center gap-2 px-4 py-2 rounded-full font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-all"
              >
                데모 종료
              </button>
            </div>

            {/* Auto-advance indicator */}
            {!isDemoPaused && currentStepIndex < currentScenario.steps.length - 1 && !showSuccess && (
              <p className="text-center text-sm text-gray-500 mt-3">
                6초 후 다음 단계로 자동 이동합니다
              </p>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Kiosk Screen Mockup / Camera Feed */}
          <div className="relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-8 overflow-hidden border border-blue-100">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-500"></div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {isDemoMode ? '키오스크 화면' : '카메라'}
            </h2>

            <div className="relative bg-gray-900 rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
              {isDemoMode ? (
                // Demo mode - show kiosk mockup
                <div className="w-full h-full kiosk-screen flex flex-col">
                  {isAnalyzing ? (
                    // Analyzing animation
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-white text-lg">화면 분석 중...</p>
                    </div>
                  ) : showSuccess ? (
                    // Success state
                    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600">
                      <CheckCircle className="w-24 h-24 text-white mb-4 animate-bounce" />
                      <p className="text-white text-2xl font-bold">주문 완료!</p>
                      <p className="text-white/80 mt-2">영수증을 받아가세요</p>
                    </div>
                  ) : currentStep ? (
                    // Current step mockup
                    <div className="flex-1 flex flex-col p-4">
                      {/* Kiosk header */}
                      <div className="bg-white/10 rounded-lg p-3 mb-4">
                        <p className="text-white/70 text-sm">{currentScenario?.name}</p>
                        <p className="text-white font-bold">{currentStep.screenName}</p>
                      </div>

                      {/* Kiosk content area */}
                      <div className="flex-1 bg-white/5 rounded-lg p-4 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center animate-ring-pulse">
                            <Hand className="w-16 h-16 text-white" />
                          </div>
                          <p className="text-white text-lg font-medium mb-2">{currentStep.touchTarget}</p>
                          <p className="text-white/70 text-sm">여기를 터치하세요</p>
                        </div>
                      </div>

                      {/* Kiosk footer */}
                      <div className="mt-4 flex justify-center gap-2">
                        {currentScenario?.steps.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-2 h-2 rounded-full ${
                              idx <= currentStepIndex ? 'bg-cyan-400' : 'bg-white/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Initial state
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-white/50">데모를 시작해주세요</p>
                    </div>
                  )}
                </div>
              ) : isCapturing ? (
                // Real camera mode
                <>
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                    videoConstraints={{
                      facingMode: 'environment'
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center space-x-2 animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-sm font-medium">분석 중</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <Camera className="w-24 h-24 mb-4" />
                  <p className="text-lg">카메라 대기 중</p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex justify-center gap-4 flex-wrap">
              {!isDemoMode && !isCapturing && (
                <>
                  <button
                    onClick={startDemoMode}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all text-lg shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    데모 보기
                  </button>
                  <button
                    onClick={startCapture}
                    className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all text-lg shadow-lg flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    실제 카메라 사용
                  </button>
                </>
              )}
              {isCapturing && (
                <button
                  onClick={stopCapture}
                  className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors text-lg shadow-lg flex items-center space-x-2"
                >
                  <StopCircle className="w-5 h-5" />
                  <span>분석 중지</span>
                </button>
              )}
            </div>
          </div>

          {/* Current Instruction */}
          <div className={`relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-8 overflow-hidden border transition-all duration-300 ${showSuccess ? 'border-green-400 ring-4 ring-green-200' : 'border-blue-100'}`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-500"></div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">현재 안내</h2>
              {currentStep && (
                <button
                  onClick={repeatInstruction}
                  disabled={isSpeaking}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>다시 듣기</span>
                </button>
              )}
            </div>

            {isAnalyzing ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">화면 분석 중...</p>
              </div>
            ) : showSuccess ? (
              <div className="text-center py-12">
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-green-700 mb-2">주문 완료!</h3>
                <p className="text-gray-600">모든 단계를 성공적으로 완료했습니다.</p>
                <p className="text-gray-500 mt-2">실제 키오스크에서도 이렇게 주문하시면 됩니다!</p>
              </div>
            ) : currentStep ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                      단계 {currentStep.step} / {currentScenario?.steps.length}
                    </span>
                    <span className="text-sm font-medium opacity-90">
                      정확도: {currentStep.confidence}%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{currentStep.screenName}</h3>
                  <p className="text-lg leading-relaxed">{currentStep.voiceGuide}</p>
                </div>

                {/* Visual Guide */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">터치할 위치</h4>
                  <div className="flex items-center gap-4 bg-white rounded-lg p-4 border-2 border-blue-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Hand className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{currentStep.touchTarget}</p>
                      <p className="text-sm text-gray-500">{currentStep.instruction}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Info className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg">데모를 시작하거나 화면 분석을 시작하면</p>
                <p className="text-lg">안내가 표시됩니다</p>
              </div>
            )}
          </div>
        </div>

        {/* Analysis History */}
        {analysisHistory.length > 0 && (
          <div className="mt-6 relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-6 overflow-hidden border border-blue-100">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-500"></div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">진행 기록</h2>
            <div className="space-y-3">
              {analysisHistory.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border-l-4 transition-all ${
                    idx === 0
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-sm font-medium">
                          단계 {step.step}
                        </span>
                        <span className="font-bold text-gray-900">{step.screenName}</span>
                        {idx === 0 && (
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                            현재
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">{step.instruction}</p>
                    </div>
                    <span className="text-xs text-gray-500 ml-4">
                      {step.confidence}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-xl">
          <h3 className="font-semibold text-yellow-900 mb-2">💡 사용 팁</h3>
          <ul className="list-disc list-inside text-yellow-800 space-y-1 text-sm">
            <li>각 단계의 안내를 천천히 따라해 주세요</li>
            <li>음성 안내가 끝날 때까지 기다린 후 터치해주세요</li>
            <li>잘 모르겠으면 &apos;다시 듣기&apos; 버튼을 눌러주세요</li>
            <li>실제 키오스크에서도 같은 순서로 진행됩니다</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
