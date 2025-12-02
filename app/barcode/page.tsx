'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Webcam from 'react-webcam'
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library'
import { ScanBarcode, Camera, Volume2, AlertTriangle, Info, Play, Pause, SkipForward, RotateCcw, Sparkles, CheckCircle } from 'lucide-react'
import { speak, stopSpeaking } from '@/lib/utils'
import { productsApi, scanHistoryApi, type Product } from '@/lib/pocketbase'
import { getProductByBarcode, convertToProductInfo } from '@/lib/food-safety-api'
import PageHeader from '@/components/PageHeader'
import { getDemoProducts, type MockProduct } from '@/lib/mock-data'

interface ProductInfo {
  code: string
  name: string
  manufacturer: string
  ingredients: string[]
  allergens: string[]
  warnings: string[]
  category?: string
  description?: string
  volume?: string
  image?: string
}

// 제품 카테고리별 기본 이미지
const productImages: { [key: string]: string } = {
  '우유': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=200&fit=crop&q=80',
  '음료': 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=300&h=200&fit=crop&q=80',
  '과자': 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&h=200&fit=crop&q=80',
  '면류': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=300&h=200&fit=crop&q=80',
  '라면': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=300&h=200&fit=crop&q=80',
  '빵': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop&q=80',
  '과일': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&h=200&fit=crop&q=80',
  '채소': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop&q=80',
  '식품': 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=300&h=200&fit=crop&q=80',
  'default': 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=300&h=200&fit=crop&q=80'
}

export default function BarcodePage() {
  const [scanning, setScanning] = useState(false)
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [scanAttempts, setScanAttempts] = useState(0)
  const webcamRef = useRef<Webcam>(null)
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null)
  const scanningIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Demo mode states
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoProducts, setDemoProducts] = useState<MockProduct[]>([])
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0)
  const [isDemoPaused, setIsDemoPaused] = useState(false)
  const [isScanning, setIsScanning] = useState(false) // For scan animation
  const [showSuccess, setShowSuccess] = useState(false)
  const demoIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopScanning()
      stopSpeaking()
      stopDemoMode()
    }
  }, [])

  // Demo auto-advance effect
  useEffect(() => {
    if (isDemoMode && !isDemoPaused && productInfo) {
      demoIntervalRef.current = setTimeout(() => {
        if (currentDemoIndex < demoProducts.length - 1) {
          advanceDemo()
        } else {
          // Demo complete
          speak('데모가 완료되었습니다. 처음부터 다시 보시려면 다시 시작 버튼을 눌러주세요.')
        }
      }, 5000) // 5 seconds per product
    }
    return () => {
      if (demoIntervalRef.current) {
        clearTimeout(demoIntervalRef.current)
      }
    }
  }, [isDemoMode, isDemoPaused, productInfo, currentDemoIndex])

  // Start demo mode
  const startDemoMode = () => {
    stopScanning()
    setError(null)
    setProductInfo(null)
    setIsDemoMode(true)
    setIsDemoPaused(false)
    setCurrentDemoIndex(0)

    const products = getDemoProducts()
    setDemoProducts(products)

    speak('데모 모드를 시작합니다. 5가지 제품을 자동으로 스캔해서 보여드립니다.')

    // Start scanning animation then show first product
    setTimeout(() => {
      showDemoProduct(products[0], 0)
    }, 2000)
  }

  // Show demo product with scan animation
  const showDemoProduct = (product: MockProduct, index: number) => {
    setIsScanning(true)
    setShowSuccess(false)
    setProductInfo(null)

    // Simulate scanning animation
    setTimeout(() => {
      setIsScanning(false)
      setShowSuccess(true)

      const info: ProductInfo = {
        code: product.barcode,
        name: product.name,
        manufacturer: product.manufacturer,
        ingredients: product.ingredients,
        allergens: product.allergens,
        warnings: product.warnings,
        category: product.category,
        volume: product.volume,
        image: product.image
      }

      setProductInfo(info)
      setCurrentDemoIndex(index)
      speakProductInfo(info)

      setTimeout(() => setShowSuccess(false), 1000)
    }, 1500) // 1.5 second scan animation
  }

  // Advance to next demo product
  const advanceDemo = () => {
    const nextIndex = currentDemoIndex + 1
    if (nextIndex < demoProducts.length) {
      showDemoProduct(demoProducts[nextIndex], nextIndex)
    }
  }

  // Skip to next product manually
  const skipToNext = () => {
    if (demoIntervalRef.current) {
      clearTimeout(demoIntervalRef.current)
    }
    advanceDemo()
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
    setCurrentDemoIndex(0)
    setIsDemoPaused(false)
    speak('데모를 처음부터 다시 시작합니다.')
    showDemoProduct(demoProducts[0], 0)
  }

  // Stop demo mode
  const stopDemoMode = () => {
    if (demoIntervalRef.current) {
      clearTimeout(demoIntervalRef.current)
    }
    setIsDemoMode(false)
    setDemoProducts([])
    setCurrentDemoIndex(0)
    setIsDemoPaused(false)
    setIsScanning(false)
    setProductInfo(null)
  }

  const startScanning = () => {
    setError(null)
    setScanAttempts(0)
    setScanning(true)
    speak('바코드 스캔을 시작합니다. 제품의 바코드를 카메라에 비춰주세요.')

    // Initialize code reader with hints
    if (!codeReaderRef.current) {
      const hints = new Map()
      const formats = [
        // Common barcode formats
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.CODE_128,
        BarcodeFormat.CODE_39,
        BarcodeFormat.QR_CODE
      ]
      hints.set(DecodeHintType.POSSIBLE_FORMATS, formats)
      hints.set(DecodeHintType.TRY_HARDER, true)

      codeReaderRef.current = new BrowserMultiFormatReader(hints)
    }

    // Start continuous scanning more frequently
    scanningIntervalRef.current = setInterval(() => {
      captureAndDecode()
    }, 300) // Try to decode every 300ms for better responsiveness
  }

  const stopScanning = () => {
    if (scanningIntervalRef.current) {
      clearInterval(scanningIntervalRef.current)
      scanningIntervalRef.current = null
    }

    if (codeReaderRef.current) {
      codeReaderRef.current.reset()
    }

    setScanning(false)
  }

  const captureAndDecode = async () => {
    if (!webcamRef.current || !codeReaderRef.current) return

    try {
      // Get higher quality screenshot
      const imageSrc = webcamRef.current.getScreenshot({
        width: 1920,
        height: 1080
      })
      if (!imageSrc) return

      setScanAttempts(prev => prev + 1)

      // Convert base64 to image element
      const img = document.createElement('img')
      img.src = imageSrc

      await new Promise((resolve) => {
        img.onload = resolve
      })

      // Decode barcode from image
      const result = await codeReaderRef.current.decodeFromImageElement(img)

      if (result) {
        console.log('Barcode detected:', result.getText())
        await onScanSuccess(result.getText())
      }
    } catch (err) {
      // No barcode found in this frame, continue scanning
      // This is expected and normal
    }
  }

  const onScanSuccess = async (decodedText: string) => {
    stopScanning()

    // Fetch product info (mock data for demo)
    const info = await fetchProductInfo(decodedText)
    setProductInfo(info)

    // Speak product information
    speakProductInfo(info)
  }

  const handleUserMedia = (stream: MediaStream) => {
    console.log('Camera stream started successfully')
  }

  const handleUserMediaError = (error: any) => {
    console.error('Camera error:', error)
    let errorMessage = '카메라를 시작할 수 없습니다. '

    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      errorMessage = '카메라 권한이 필요합니다. 브라우저 설정에서 카메라 권한을 허용해주세요.'
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      errorMessage = '카메라를 찾을 수 없습니다. 기기에 카메라가 있는지 확인해주세요.'
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      errorMessage = '카메라가 다른 앱에서 사용 중입니다. 다른 앱을 종료하고 다시 시도해주세요.'
    } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
      errorMessage = '카메라 설정을 조정할 수 없습니다.'
    }

    setError(errorMessage)
    speak(errorMessage)
    setScanning(false)
  }

  const fetchProductInfo = async (barcode: string): Promise<ProductInfo> => {
    try {
      console.log('Fetching product info for barcode:', barcode)

      // 1단계: 식약처 공공데이터 API 조회 (최우선)
      console.log('Trying Food Safety API...')
      const foodSafetyProduct = await getProductByBarcode(barcode)

      if (foodSafetyProduct) {
        console.log('Found in Food Safety API:', foodSafetyProduct.PRDLST_NM)

        // 스캔 기록 저장 (인증된 사용자만)
        try {
          await scanHistoryApi.create({
            product: '', // Food Safety API는 product ID 없음
            barcode: barcode,
            scan_type: 'barcode',
            tts_played: true
          })
        } catch (err) {
          console.log('Scan history not saved (user not authenticated)')
        }

        return convertToProductInfo(foodSafetyProduct)
      }

      // 2단계: PocketBase 내부 데이터베이스 조회 (fallback)
      console.log('Trying PocketBase...')
      const product = await productsApi.getByBarcode(barcode)

      if (product) {
        console.log('Found in PocketBase:', product.name)

        // 스캔 기록 저장 (인증된 사용자만)
        try {
          await scanHistoryApi.create({
            product: product.id,
            barcode: barcode,
            scan_type: 'barcode',
            tts_played: true
          })
        } catch (err) {
          console.log('Scan history not saved (user not authenticated)')
        }

        // Product를 ProductInfo로 변환
        return {
          code: product.barcode,
          name: product.name,
          manufacturer: product.brand || '정보 없음',
          ingredients: Array.isArray(product.ingredients)
            ? product.ingredients
            : (typeof product.ingredients === 'string'
              ? product.ingredients.split(',').map(i => i.trim())
              : []),
          allergens: product.allergens || [],
          warnings: product.warnings
            ? (typeof product.warnings === 'string'
              ? product.warnings.split(',').map(w => w.trim())
              : Array.isArray(product.warnings)
              ? product.warnings
              : [])
            : [],
          category: product.category,
          description: product.description
        }
      }

      // 3단계: 제품을 찾지 못한 경우
      console.log('Product not found in any database')
      return {
        code: barcode,
        name: '알 수 없는 제품',
        manufacturer: '정보 없음',
        ingredients: ['이 바코드에 대한 제품 정보를 찾을 수 없습니다'],
        allergens: [],
        warnings: ['제품 정보가 식약처 및 내부 데이터베이스에 없습니다']
      }
    } catch (error) {
      console.error('fetchProductInfo error:', error)

      // 에러 발생 시 fallback
      return {
        code: barcode,
        name: '오류 발생',
        manufacturer: '정보 없음',
        ingredients: ['제품 정보를 불러오는 중 오류가 발생했습니다'],
        allergens: [],
        warnings: ['네트워크 연결을 확인해주세요']
      }
    }
  }

  const speakProductInfo = (info: ProductInfo) => {
    setIsSpeaking(true)

    let message = `제품명: ${info.name}. 제조사: ${info.manufacturer}. `

    if (info.allergens.length > 0) {
      message += `알레르기 유발 성분: ${info.allergens.join(', ')}. `
    }

    if (info.warnings.length > 0) {
      message += `주의사항: ${info.warnings.join(', ')}. `
    }

    message += '자세한 정보는 화면을 확인해주세요.'

    speak(message)

    setTimeout(() => setIsSpeaking(false), message.length * 100)
  }

  const repeatInfo = () => {
    if (productInfo) {
      speakProductInfo(productInfo)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50"></div>
        <div className="absolute inset-0 pattern-dots opacity-30"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-20 left-40 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <PageHeader
        title="음성 바코드 리더"
        description="바코드를 스캔하면 제품 정보를 음성으로 안내해드립니다"
        icon={ScanBarcode}
        gradientFrom="from-green-400"
        gradientTo="to-emerald-500"
      />

      <main className="max-w-4xl mx-auto px-4 pb-8">
        {/* Instructions */}
        <div className="bg-white/80 backdrop-blur rounded-3xl card-shadow p-6 mb-6 overflow-hidden border border-blue-100">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-500"></div>
          <div className="flex items-start">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 mr-4">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">사용 방법</h3>
              <ol className="list-decimal list-inside text-blue-800 space-y-1">
                <li className="text-base">아래 스캔 시작 버튼을 눌러주세요</li>
                <li className="text-base">카메라 권한 요청이 나타나면 <strong className="text-blue-900">"허용"</strong>을 선택해주세요</li>
                <li className="text-base">제품 바코드를 카메라에 비춰주세요</li>
                <li className="text-base">제품 정보를 음성으로 안내해드립니다</li>
              </ol>
              <div className="mt-3 p-3 bg-blue-100 rounded text-sm text-blue-900">
                <p className="font-semibold mb-1">💡 카메라 권한이 차단된 경우:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>주소창 옆의 자물쇠 아이콘을 클릭하세요</li>
                  <li>카메라 권한을 "허용"으로 변경하세요</li>
                  <li>페이지를 새로고침 하세요</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Scanner Area */}
        <div className="relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-8 mb-6 overflow-hidden border border-green-100">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
          {scanning ? (
            <div className="relative">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: 'environment',
                  width: { ideal: 1280 },
                  height: { ideal: 720 }
                }}
                onUserMedia={handleUserMedia}
                onUserMediaError={handleUserMediaError}
                className="w-full max-w-2xl mx-auto rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-4 border-green-500 rounded-lg"
                     style={{ width: '250px', height: '250px' }}></div>
              </div>
              <div className="text-center mt-4">
                <div className="mb-4">
                  <p className="text-gray-600 mb-2 font-semibold">바코드를 녹색 사각형 안에 맞춰주세요</p>
                  <p className="text-sm text-gray-500">스캔 시도 중: {scanAttempts}회</p>
                  {scanAttempts > 10 && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                      <p className="font-semibold mb-1">💡 바코드 인식이 어려운가요?</p>
                      <ul className="list-disc list-inside text-left space-y-1 ml-2">
                        <li>바코드에 충분한 조명을 비춰주세요</li>
                        <li>바코드를 카메라에 더 가까이 대주세요</li>
                        <li>바코드가 선명하게 보이도록 초점을 맞춰주세요</li>
                        <li>바코드를 수평으로 맞춰주세요</li>
                      </ul>
                    </div>
                  )}
                </div>
                <button
                  onClick={stopScanning}
                  className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors"
                >
                  스캔 중지
                </button>
              </div>
            </div>
          ) : !productInfo && !isDemoMode ? (
            <div className="text-center py-12">
              <Camera className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-6 text-lg">바코드 스캔을 시작하려면 버튼을 눌러주세요</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={startScanning}
                  className="bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition-all text-lg shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Camera className="w-6 h-6 inline mr-2" />
                  스캔 시작하기
                </button>
                <button
                  onClick={startDemoMode}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all text-lg shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-6 h-6" />
                  데모 보기
                </button>
              </div>
            </div>
          ) : isDemoMode && isScanning ? (
            // Demo scanning animation
            <div className="text-center py-12">
              <div className="relative w-64 h-64 mx-auto mb-6">
                {/* Scanning frame */}
                <div className="absolute inset-0 border-4 border-green-500 rounded-2xl">
                  {/* Scanning line animation */}
                  <div className="absolute left-2 right-2 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-scan-line"></div>
                </div>
                {/* Barcode icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <ScanBarcode className="w-24 h-24 text-green-500 animate-pulse" />
                </div>
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-xl"></div>
              </div>
              <p className="text-xl font-semibold text-green-700 animate-pulse">바코드 스캔 중...</p>
              <p className="text-gray-500 mt-2">제품 {currentDemoIndex + 1} / {demoProducts.length}</p>
            </div>
          ) : isDemoMode && !productInfo ? (
            // Demo mode initializing
            <div className="text-center py-12">
              <Sparkles className="w-24 h-24 text-purple-400 mx-auto mb-4 animate-pulse" />
              <p className="text-xl font-semibold text-purple-700">데모 모드 준비 중...</p>
            </div>
          ) : null}
        </div>

        {/* Demo Mode Progress & Controls */}
        {isDemoMode && productInfo && (
          <div className="relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-6 mb-6 overflow-hidden border border-purple-200">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-indigo-500"></div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>데모 진행률</span>
                <span>{currentDemoIndex + 1} / {demoProducts.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${((currentDemoIndex + 1) / demoProducts.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-4">
              {demoProducts.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    idx < currentDemoIndex
                      ? 'bg-green-500'
                      : idx === currentDemoIndex
                      ? 'bg-purple-500 scale-125'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Control buttons */}
            <div className="flex justify-center gap-3">
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
                disabled={currentDemoIndex >= demoProducts.length - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-full font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SkipForward className="w-5 h-5" />
                다음
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
            {!isDemoPaused && currentDemoIndex < demoProducts.length - 1 && (
              <p className="text-center text-sm text-gray-500 mt-3">
                5초 후 다음 제품으로 자동 이동합니다
              </p>
            )}
          </div>
        )}

        {/* Product Information */}
        {productInfo && (
          <div className={`relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-8 overflow-hidden border ${showSuccess ? 'border-green-400 ring-4 ring-green-200' : 'border-green-100'} transition-all duration-300`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>

            {/* Success indicator */}
            {showSuccess && (
              <div className="absolute top-4 right-4">
                <CheckCircle className="w-8 h-8 text-green-500 animate-bounce" />
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">제품 정보</h2>
              <button
                onClick={repeatInfo}
                disabled={isSpeaking}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Volume2 className="w-5 h-5" />
                <span>다시 듣기</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Product Image & Name */}
              <div className="flex gap-6 border-b pb-6">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-lg border-2 border-green-100">
                    <Image
                      src={productInfo.image || productImages[productInfo.category || ''] || productImages['default']}
                      alt={productInfo.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
                {/* Product Name & Category */}
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">제품명</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{productInfo.name}</p>
                  {productInfo.category && (
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      {productInfo.category}
                    </span>
                  )}
                  {productInfo.volume && (
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium ml-2">
                      {productInfo.volume}
                    </span>
                  )}
                </div>
              </div>

              {/* Manufacturer */}
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500 mb-1">제조사</p>
                <p className="text-lg text-gray-900">{productInfo.manufacturer}</p>
              </div>

              {/* Barcode */}
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500 mb-1">바코드 번호</p>
                <p className="text-lg font-mono text-gray-700">{productInfo.code}</p>
              </div>

              {/* Allergens */}
              {productInfo.allergens.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex items-start">
                    <AlertTriangle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-900 mb-2">알레르기 유발 성분</p>
                      <div className="flex flex-wrap gap-2">
                        {productInfo.allergens.map((allergen, idx) => (
                          <span
                            key={idx}
                            className="bg-red-200 text-red-900 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {allergen}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Warnings */}
              {productInfo.warnings.length > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <p className="font-semibold text-yellow-900 mb-2">주의사항</p>
                  <ul className="list-disc list-inside text-yellow-800 space-y-1">
                    {productInfo.warnings.map((warning, idx) => (
                      <li key={idx}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ingredients */}
              <div>
                <p className="font-semibold text-gray-900 mb-2">원재료</p>
                <p className="text-gray-700">{productInfo.ingredients.join(', ')}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-center space-x-4">
              {isDemoMode ? (
                // Demo mode - only show stop demo button in action area (controls above)
                null
              ) : (
                <>
                  <button
                    onClick={() => {
                      setProductInfo(null)
                      startScanning()
                    }}
                    className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-all hover:scale-105"
                  >
                    다른 제품 스캔
                  </button>
                  <button
                    onClick={() => {
                      setProductInfo(null)
                      startDemoMode()
                    }}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5 inline mr-2" />
                    데모 보기
                  </button>
                  <Link
                    href="/"
                    className="bg-gray-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-700 transition-all hover:scale-105"
                  >
                    홈으로 돌아가기
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-800">{error}</p>
          </div>
        )}
      </main>
    </div>
  )
}
