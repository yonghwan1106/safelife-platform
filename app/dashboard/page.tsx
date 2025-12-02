'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Shield,
  Phone,
  ScanBarcode,
  Smartphone,
  Bell,
  Activity,
  LogOut,
  Eye,
  Play,
  RefreshCw,
  Users,
  FileText,
  BarChart3,
  ChevronRight,
  X
} from 'lucide-react'
import { auth, type User } from '@/lib/pocketbase'
import {
  MOCK_ELDERLY_USERS,
  MOCK_ALERTS,
  MOCK_WEEKLY_ACTIVITIES,
  getWeeklyStats,
  formatTimeAgo,
  type ElderlyUser as MockElderlyUser,
  type Alert as MockAlert
} from '@/lib/mock-data'

// Wrapper component for Suspense boundary
export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  )
}

function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">로딩 중...</p>
      </div>
    </div>
  )
}

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedElderly, setSelectedElderly] = useState<MockElderlyUser | null>(null)
  const [animatedStats, setAnimatedStats] = useState({ scans: 0, helps: 0, blocks: 0 })
  const [chartAnimated, setChartAnimated] = useState(false)

  // Mock 데이터 사용
  const [elderlyUsers, setElderlyUsers] = useState<MockElderlyUser[]>(MOCK_ELDERLY_USERS)
  const [alerts, setAlerts] = useState<MockAlert[]>(MOCK_ALERTS)
  const weeklyStats = getWeeklyStats()

  // 데모 모드 및 인증 체크 - 하나의 effect로 통합
  useEffect(() => {
    const demoParam = searchParams.get('demo')

    // 데모 모드 체크
    if (demoParam === 'true') {
      setIsDemoMode(true)
      setLoading(false)
      return
    }

    // 인증 체크 (데모 모드가 아닌 경우에만)
    const currentUser = auth.getCurrentUser()

    if (!currentUser) {
      router.push('/login?redirect=/dashboard')
      return
    }

    if (currentUser.role !== 'guardian') {
      router.push('/')
      return
    }

    setUser(currentUser)
    setLoading(false)
  }, [searchParams, router])

  // 통계 애니메이션
  useEffect(() => {
    if (loading) return

    const targetScans = weeklyStats.totalScans
    const targetHelps = weeklyStats.totalKioskHelps
    const targetBlocks = weeklyStats.totalPhishingBlocks

    const duration = 1500
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setAnimatedStats({
        scans: Math.round(targetScans * easeOut),
        helps: Math.round(targetHelps * easeOut),
        blocks: Math.round(targetBlocks * easeOut)
      })

      if (step >= steps) {
        clearInterval(timer)
        setChartAnimated(true)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [loading])

  // 알림 패널 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showNotifications && !target.closest('.notification-panel')) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showNotifications])

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    )
  }

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length

  const handleLogout = () => {
    auth.logout()
    router.push('/')
  }

  const enterDemoMode = () => {
    setIsDemoMode(true)
    setLoading(false)
    router.push('/dashboard?demo=true')
  }

  // 실시간 업데이트 시뮬레이션
  useEffect(() => {
    if (!isDemoMode) return

    const interval = setInterval(() => {
      setElderlyUsers(prev => prev.map(u => ({
        ...u,
        lastActivity: u.status === 'safe' ? Date.now() - Math.random() * 60 * 60 * 1000 : u.lastActivity
      })))
    }, 30000)

    return () => clearInterval(interval)
  }, [isDemoMode])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>

          {/* 데모 모드 버튼 */}
          <button
            onClick={enterDemoMode}
            className="mt-8 demo-button"
          >
            <Play className="w-5 h-5" />
            데모 모드로 보기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-50"></div>
        <div className="absolute inset-0 pattern-dots opacity-30"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-20 left-40 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 px-4 text-center text-sm animate-fade-in-up">
          <div className="flex items-center justify-center gap-2">
            <Play className="w-4 h-4 animate-pulse" />
            <span className="font-medium">데모 모드</span>
            <span className="opacity-80">- 실제 데이터가 아닌 예시 데이터입니다</span>
            <button
              onClick={() => router.push('/dashboard')}
              className="ml-4 px-3 py-1 bg-white/20 rounded-full text-xs hover:bg-white/30 transition-colors"
            >
              데모 종료
            </button>
          </div>
        </div>
      )}

      {/* Header with custom actions */}
      <div className="relative overflow-hidden mb-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-500 opacity-5"></div>
          <div className="absolute inset-0 pattern-dots opacity-20"></div>
        </div>

        <div className="relative glass-effect border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span className="text-sm font-medium">← 홈으로</span>
              </Link>
              <div className="flex items-center space-x-4">
                {/* Real-time Indicator */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>실시간</span>
                </div>

                {/* Refresh Button */}
                <button
                  onClick={() => window.location.reload()}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="새로고침"
                >
                  <RefreshCw className="w-5 h-5 text-gray-600" />
                </button>

                {/* Notifications */}
                <div className="relative notification-panel">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Bell className="w-6 h-6 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors" />
                    {unacknowledgedCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                        {unacknowledgedCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-fade-in-up">
                      <div className="bg-gradient-to-r from-purple-400 to-indigo-500 px-6 py-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white font-bold text-lg">알림</h3>
                          <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                            {unacknowledgedCount}개의 새 알림
                          </span>
                        </div>
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {alerts.length > 0 ? (
                          alerts.slice(0, 5).map((alert, idx) => (
                            <div
                              key={alert.id}
                              className={`px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors animate-fade-in-up ${!alert.acknowledged ? 'bg-blue-50' : ''
                                }`}
                              style={{ animationDelay: `${idx * 50}ms` }}
                            >
                              <div className="flex items-start space-x-3">
                                <div
                                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${alert.severity === 'high'
                                      ? 'bg-red-100'
                                      : alert.severity === 'medium'
                                        ? 'bg-yellow-100'
                                        : 'bg-blue-100'
                                    }`}
                                >
                                  {alert.type === 'voice_phishing' ? (
                                    <Shield
                                      className={`w-5 h-5 ${alert.severity === 'high'
                                          ? 'text-red-600'
                                          : alert.severity === 'medium'
                                            ? 'text-yellow-600'
                                            : 'text-blue-600'
                                        }`}
                                    />
                                  ) : alert.type === 'emergency' ? (
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                  ) : alert.type === 'daily_report' ? (
                                    <FileText className="w-5 h-5 text-blue-600" />
                                  ) : (
                                    <Activity className="w-5 h-5 text-blue-600" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-semibold text-gray-900">
                                      {alert.elderlyName}
                                    </p>
                                    <span className="text-xs text-gray-500">
                                      {formatTimeAgo(alert.timestamp)}
                                    </span>
                                  </div>
                                  <p className="text-xs font-medium text-gray-700 mb-1">{alert.title}</p>
                                  <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                                  {!alert.acknowledged && (
                                    <button
                                      onClick={() => acknowledgeAlert(alert.id)}
                                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                    >
                                      확인 완료
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-6 py-8 text-center text-gray-500">
                            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>새로운 알림이 없습니다</p>
                          </div>
                        )}
                      </div>

                      {alerts.length > 5 && (
                        <div className="px-6 py-3 bg-gray-50 text-center">
                          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                            모든 알림 보기 ({alerts.length}개)
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!isDemoMode && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">로그아웃</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-5">
              <div className="relative">
                <img
                  src="/images/profile_guardian.png"
                  alt="보호자 프로필"
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg transform hover:scale-110 hover:rotate-6 transition-all duration-500"
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <Eye className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent mb-2">
                  보호자 대시보드
                </h1>
                <p className="text-gray-600 text-base">
                  {isDemoMode ? '데모 사용자' : user?.name}님, 환영합니다! 가족의 안전 상태를 실시간으로 모니터링합니다
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-1 bg-gradient-to-r from-purple-400 to-indigo-500"></div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-8">
        {/* Quick Stats - Animated */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-6 overflow-hidden border border-purple-100 hover:card-shadow-hover transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-indigo-500"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">보호 중인 가족</p>
                <p className="text-3xl font-bold text-gray-900">{elderlyUsers.length}</p>
                <p className="text-xs text-green-600 mt-1">모두 연결됨</p>
              </div>
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-6 overflow-hidden border border-red-100 hover:card-shadow-hover transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-pink-500"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">미확인 알림</p>
                <p className={`text-3xl font-bold ${unacknowledgedCount > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                  {unacknowledgedCount}
                </p>
                {unacknowledgedCount > 0 && (
                  <p className="text-xs text-red-500 mt-1 animate-pulse">확인이 필요합니다</p>
                )}
              </div>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${unacknowledgedCount > 0 ? 'bg-red-100 animate-alert-pulse' : 'bg-gray-100'}`}>
                <Bell className={`w-8 h-8 ${unacknowledgedCount > 0 ? 'text-red-600' : 'text-gray-400'}`} />
              </div>
            </div>
          </div>

          <div className="relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-6 overflow-hidden border border-green-100 hover:card-shadow-hover transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">이번 주 활동</p>
                <p className="text-3xl font-bold text-green-600">
                  {animatedStats.scans + animatedStats.helps}
                </p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  지난주 대비 증가
                </p>
              </div>
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-6 overflow-hidden border border-blue-100 hover:card-shadow-hover transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-500"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">피싱 차단</p>
                <p className="text-3xl font-bold text-blue-600">{animatedStats.blocks}</p>
                <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  가족 보호 중
                </p>
              </div>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Elderly Users Status - 5명 */}
        <div className="relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-8 mb-8 overflow-hidden border border-purple-100">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-indigo-500"></div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">가족 상태</h2>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                안전 {elderlyUsers.filter(u => u.status === 'safe').length}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                주의 {elderlyUsers.filter(u => u.status === 'warning').length}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                위험 {elderlyUsers.filter(u => u.status === 'danger').length}
              </span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {elderlyUsers.map((elderly, idx) => (
              <div
                key={elderly.id}
                onClick={() => setSelectedElderly(elderly)}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:card-shadow-hover transform hover:-translate-y-1 animate-fade-in-up ${elderly.status === 'danger'
                    ? 'border-red-300 bg-red-50 animate-alert-pulse'
                    : elderly.status === 'warning'
                      ? 'border-yellow-300 bg-yellow-50'
                      : 'border-gray-200 bg-gray-50 hover:border-indigo-300'
                  }`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={elderly.photo}
                      alt={elderly.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${elderly.status === 'safe'
                          ? 'bg-green-500'
                          : elderly.status === 'warning'
                            ? 'bg-yellow-500'
                            : 'bg-red-500 animate-pulse'
                        }`}
                    >
                      {elderly.status === 'safe' ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{elderly.relationship} ({elderly.name})</h3>
                    <p className="text-sm text-gray-500">{elderly.age}세</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{formatTimeAgo(elderly.lastActivity)}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className={`text-sm font-medium ${elderly.status === 'danger' ? 'text-red-600' :
                      elderly.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                    {elderly.statusMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Elderly Detail Modal */}
        {selectedElderly && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in-up">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">상세 정보</h3>
                <button
                  onClick={() => setSelectedElderly(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={selectedElderly.photo}
                  alt={selectedElderly.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100"
                />
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{selectedElderly.name}</h4>
                  <p className="text-gray-500">{selectedElderly.relationship} | {selectedElderly.age}세</p>
                  <p className="text-sm text-gray-400 mt-1">{selectedElderly.address}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <ScanBarcode className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{selectedElderly.weeklyStats.barcodeScans}</p>
                  <p className="text-xs text-gray-500">바코드 스캔</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <Smartphone className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{selectedElderly.weeklyStats.kioskHelps}</p>
                  <p className="text-xs text-gray-500">키오스크 도움</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <Shield className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">{selectedElderly.weeklyStats.phishingBlocks}</p>
                  <p className="text-xs text-gray-500">피싱 차단</p>
                </div>
              </div>

              <a
                href={`tel:${selectedElderly.phone}`}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                <Phone className="w-5 h-5" />
                전화 걸기 ({selectedElderly.phone})
              </a>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Alerts - 10개 */}
          <div className="relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-8 overflow-hidden border border-red-100">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-pink-500"></div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">최근 알림</h2>
              <span className="text-sm text-gray-500">{alerts.length}개의 알림</span>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alerts.slice(0, 6).map((alert, idx) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border-l-4 transition-all duration-300 animate-fade-in-up ${alert.severity === 'high'
                      ? 'border-red-500 bg-red-50'
                      : alert.severity === 'medium'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-blue-500 bg-blue-50'
                    } ${alert.acknowledged ? 'opacity-60' : ''}`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {alert.type === 'voice_phishing' ? (
                        <Shield className={`w-5 h-5 ${alert.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                          }`} />
                      ) : alert.type === 'emergency' ? (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      ) : alert.type === 'daily_report' ? (
                        <FileText className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-600" />
                      )}
                      <span className="text-sm font-semibold text-gray-900">
                        {alert.elderlyName}
                      </span>
                      {!alert.acknowledged && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">NEW</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{formatTimeAgo(alert.timestamp)}</span>
                  </div>
                  <p className="text-xs font-medium text-gray-700 mb-1">{alert.title}</p>
                  <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                  {alert.actionTaken && (
                    <p className="text-xs text-green-600 mb-2">조치: {alert.actionTaken}</p>
                  )}
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      확인 완료
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Activity Statistics with Animated Chart */}
          <div className="relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-8 overflow-hidden border border-purple-100">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-indigo-500"></div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">이번 주 활동 통계</h2>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105">
                <ScanBarcode className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{animatedStats.scans}</p>
                <p className="text-xs text-gray-500">바코드 스캔</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105">
                <Smartphone className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{animatedStats.helps}</p>
                <p className="text-xs text-gray-500">키오스크 도움</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4 text-center transform transition-all duration-300 hover:scale-105">
                <Shield className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">{animatedStats.blocks}</p>
                <p className="text-xs text-gray-500">피싱 차단</p>
              </div>
            </div>

            {/* Animated Weekly Chart */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">주간 활동 추이</h3>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-indigo-500 rounded"></div>
                    바코드
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    키오스크
                  </span>
                </div>
              </div>
              <div className="flex items-end justify-between h-40 space-x-2">
                {MOCK_WEEKLY_ACTIVITIES.map((day, idx) => {
                  const maxScans = Math.max(...MOCK_WEEKLY_ACTIVITIES.map(d => d.barcodeScans))
                  const scanHeight = (day.barcodeScans / maxScans) * 100
                  const kioskHeight = (day.kioskHelps / maxScans) * 100

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex gap-1 items-end h-32">
                        <div
                          className="flex-1 bg-indigo-500 rounded-t transition-all duration-1000"
                          style={{
                            height: chartAnimated ? `${scanHeight}%` : '0%',
                            transitionDelay: `${idx * 100}ms`
                          }}
                        ></div>
                        <div
                          className="flex-1 bg-purple-400 rounded-t transition-all duration-1000"
                          style={{
                            height: chartAnimated ? `${kioskHeight}%` : '0%',
                            transitionDelay: `${idx * 100 + 50}ms`
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-2 font-medium">
                        {day.dayName}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Trend Indicator */}
            <div className="mt-4 flex items-center justify-center gap-2 text-sm">
              {weeklyStats.trend === 'up' ? (
                <>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-green-600 font-medium">활동량 증가 추세</span>
                </>
              ) : weeklyStats.trend === 'down' ? (
                <>
                  <TrendingUp className="w-5 h-5 text-red-500 transform rotate-180" />
                  <span className="text-red-600 font-medium">활동량 감소 추세</span>
                </>
              ) : (
                <span className="text-gray-600">활동량 유지 중</span>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="mt-6 bg-white rounded-3xl shadow-lg p-6 border border-purple-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">긴급 연락처</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="tel:112"
              className="flex items-center justify-between p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 border border-red-200 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">경찰청</p>
                  <p className="text-lg font-bold text-red-600">112</p>
                </div>
              </div>
              <span className="text-red-600 text-2xl">→</span>
            </a>
            <a
              href="tel:119"
              className="flex items-center justify-between p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-all duration-300 border border-orange-200 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">소방서</p>
                  <p className="text-lg font-bold text-orange-600">119</p>
                </div>
              </div>
              <span className="text-orange-600 text-2xl">→</span>
            </a>
            <a
              href="tel:1332"
              className="flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 border border-blue-200 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">금융감독원</p>
                  <p className="text-lg font-bold text-blue-600">1332</p>
                </div>
              </div>
              <span className="text-blue-600 text-2xl">→</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
