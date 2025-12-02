'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Shield, Smartphone, ScanBarcode, Eye, Info, Sparkles, Heart, Zap, LogIn, UserCircle, ChevronRight, Star, Users, TrendingUp, Award, Play } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { auth } from '@/lib/pocketbase'

// Animated Counter Component
function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * target))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, target, duration])

  return (
    <div ref={ref} className="text-5xl md:text-6xl font-black text-gradient animate-count-up">
      {count.toLocaleString()}{suffix}
    </div>
  )
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(auth.isAuthenticated())
      const user = auth.getCurrentUser()
      if (user) {
        setUserName(user.name || user.email || '')
      }
    }

    checkAuth()
  }, [])

  // Mouse tracking for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: (e.clientX - rect.left - rect.width / 2) / 20,
      y: (e.clientY - rect.top - rect.height / 2) / 20,
    })
  }

  const features = [
    {
      href: '/barcode',
      icon: ScanBarcode,
      title: '음성 바코드',
      description: '바코드를 스캔하면 제품 정보를 음성으로 안내',
      tags: ['OCR', 'TTS', 'AI'],
      gradient: 'from-emerald-400 via-green-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-green-50',
      borderColor: 'border-emerald-200',
      tagBg: 'bg-emerald-100 text-emerald-700',
      number: 1,
      badge: 'POPULAR',
      image: '/images/feature_barcode.png'
    },
    {
      href: '/kiosk',
      icon: Smartphone,
      title: '키오스크 도우미',
      description: '화면을 인식하여 주문 과정을 단계별 안내',
      tags: ['Vision AI', '음성안내'],
      gradient: 'from-blue-400 via-indigo-500 to-purple-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      tagBg: 'bg-blue-100 text-blue-700',
      number: 2,
      badge: 'NEW',
      image: '/images/feature_kiosk.png'
    },
    {
      href: '/voicephishing',
      icon: Shield,
      title: '보이스피싱 감지',
      description: '통화 내용을 실시간 분석하여 피싱 차단',
      tags: ['STT', 'NLP', '실시간'],
      gradient: 'from-rose-400 via-red-500 to-pink-600',
      bgGradient: 'from-rose-50 to-pink-50',
      borderColor: 'border-rose-200',
      tagBg: 'bg-rose-100 text-rose-700',
      number: 3,
      badge: 'AI 보안',
      image: '/images/feature_security.png'
    },
    {
      href: '/dashboard',
      icon: Eye,
      title: '보호자 대시보드',
      description: '가족의 안전 상태를 실시간 모니터링',
      tags: ['실시간', '알림', '분석'],
      gradient: 'from-violet-400 via-purple-500 to-fuchsia-600',
      bgGradient: 'from-violet-50 to-purple-50',
      borderColor: 'border-violet-200',
      tagBg: 'bg-violet-100 text-violet-700',
      number: 4,
      badge: '통합 관리',
      image: '/images/feature_dashboard.png'
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/50"></div>

        {/* Animated mesh gradient */}
        <div className="absolute inset-0 gradient-hero opacity-60"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 pattern-grid opacity-40"></div>

        {/* Floating orbs */}
        <div className="absolute top-20 left-[10%] w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-float"></div>
        <div className="absolute top-40 right-[10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-[30%] w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-[60%] right-[20%] w-64 h-64 bg-cyan-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-15 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Premium Header */}
      <header className="relative z-50">
        <div className="glass-premium border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-105">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse-soft">
                    <Sparkles className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-black text-gradient">SafeLife</h1>
                  <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">AI Life Solution</p>
                </div>
              </Link>

              {/* Navigation */}
              <div className="flex items-center space-x-3">
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 bg-white/50 backdrop-blur px-4 py-2 rounded-full border border-gray-100">
                  <Heart className="w-4 h-4 text-rose-500 animate-pulse-soft" />
                  <span>고령자를 위한 AI 생활 안전 플랫폼</span>
                </div>

                {isLoggedIn ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft"></div>
                      <UserCircle className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{userName}</span>
                    </div>
                    <button
                      onClick={() => {
                        auth.logout()
                        setIsLoggedIn(false)
                        setUserName('')
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="btn-premium text-sm py-2.5 px-5"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>로그인</span>
                  </Link>
                )}

                <Link
                  href="/about"
                  className="flex items-center space-x-2 bg-white/80 backdrop-blur text-gray-700 px-5 py-2.5 rounded-full hover:bg-white transition-all duration-300 font-medium text-sm border border-gray-200 shadow-sm hover:shadow-md group"
                >
                  <Info className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span>소개</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur border border-indigo-200/50 px-5 py-2.5 rounded-full mb-8 animate-slide-up shadow-lg shadow-indigo-500/10">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse-soft"></div>
              <Award className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-bold text-indigo-700">AI 라이프 솔루션 챌린지 2025</span>
              <ChevronRight className="w-4 h-4 text-indigo-400" />
            </div>

            {/* Main Heading */}
            <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="text-gradient-aurora">누구나 안전하고</span>
                <br />
                <span className="text-gradient">편리한 디지털 생활</span>
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto lg:mx-0 leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <span className="font-semibold text-gray-800">AI 기술</span>로 고령자의 일상을 보호하고,
              <br className="hidden sm:block" />
              디지털 세상과의 <span className="font-semibold text-gray-800">격차를 줄입니다</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <Link
                href="/barcode"
                className="btn-premium text-lg py-4 px-8 group"
              >
                <Play className="w-5 h-5" />
                <span>데모 체험하기</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard?demo=true"
                className="flex items-center space-x-2 glass-card px-8 py-4 rounded-full font-bold text-lg text-gray-700 hover:text-indigo-600 transition-all group"
              >
                <Eye className="w-5 h-5" />
                <span>대시보드 미리보기</span>
              </Link>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="relative animate-slide-up hidden lg:block" style={{ animationDelay: '400ms' }}>
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/hero_main.png"
                  alt="가족이 함께하는 따뜻한 시간"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent"></div>
                {/* Badge on image */}
                <div className="absolute bottom-4 left-4 right-4 glass-card rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">AI 실시간 보호</p>
                      <p className="text-sm text-gray-600">언제 어디서나 안전하게</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 glass-card rounded-xl p-3 shadow-lg animate-float">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-gray-900">보이스피싱 차단</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 glass-card rounded-xl p-3 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-gray-900">키오스크 도우미</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards - Premium 3D Design */}
        <div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
          onMouseMove={handleMouseMove}
        >
          {features.map((feature, index) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="group animate-slide-up"
              style={{ animationDelay: `${400 + index * 100}ms` }}
            >
              <div
                className={`relative h-full bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm rounded-3xl p-8 transition-all duration-500 overflow-hidden border-2 ${feature.borderColor} hover:border-transparent card-3d`}
                style={{
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`,
                }}
              >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>

                {/* Top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${feature.gradient} rounded-t-3xl`}></div>

                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className="badge badge-new text-[10px]">{feature.badge}</span>
                </div>

                {/* Feature Image */}
                <div className="relative mb-4 -mx-8 -mt-8 rounded-t-3xl overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={400}
                    height={200}
                    className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${feature.gradient} opacity-40`}></div>
                  {/* Icon overlay */}
                  <div className="absolute bottom-2 left-2">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg border-2 border-white`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-sm font-black text-gradient">{feature.number}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gradient transition-all">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed mb-5">
                  {feature.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {feature.tags.map((tag) => (
                    <span key={tag} className={`text-xs ${feature.tagBg} px-3 py-1.5 rounded-full font-semibold`}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Bottom accent line on hover */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl`}></div>

                {/* Arrow indicator */}
                <div className="absolute bottom-6 right-6 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg transform translate-x-4 group-hover:translate-x-0">
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Section - Premium Design */}
        <div className="relative mb-24">
          <div className="glass-premium rounded-[2rem] p-12 overflow-hidden border border-white/30">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full filter blur-[80px] -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full filter blur-[60px] -ml-32 -mb-32"></div>

            {/* Section Title */}
            <div className="text-center mb-16 relative z-10">
              <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur px-4 py-2 rounded-full mb-4 border border-gray-100">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-semibold text-gray-600">문제 인식</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-gradient mb-4">
                왜 SafeLife인가?
              </h3>
              <p className="text-gray-600 text-lg">우리가 해결하고자 하는 문제들</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              <div className="text-center group">
                <div className="glass-card rounded-2xl p-8 hover:shadow-glow transition-all duration-300">
                  <div className="mb-4">
                    <AnimatedCounter target={73} suffix="%" />
                  </div>
                  <div className="h-1.5 w-24 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4 group-hover:w-32 transition-all duration-300"></div>
                  <p className="text-gray-700 font-medium text-lg">
                    고령자 디지털 기기<br />
                    <span className="text-gray-500 text-base">사용 어려움</span>
                  </p>
                </div>
              </div>

              <div className="text-center group">
                <div className="glass-card rounded-2xl p-8 hover:shadow-glow transition-all duration-300">
                  <div className="mb-4">
                    <div className="text-5xl md:text-6xl font-black text-gradient">
                      1.8<span className="text-3xl">조원</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-24 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 group-hover:w-32 transition-all duration-300"></div>
                  <p className="text-gray-700 font-medium text-lg">
                    2024년<br />
                    <span className="text-gray-500 text-base">보이스피싱 피해액</span>
                  </p>
                </div>
              </div>

              <div className="text-center group">
                <div className="glass-card rounded-2xl p-8 hover:shadow-glow transition-all duration-300">
                  <div className="mb-4">
                    <AnimatedCounter target={85} suffix="%" />
                  </div>
                  <div className="h-1.5 w-24 mx-auto bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mb-4 group-hover:w-32 transition-all duration-300"></div>
                  <p className="text-gray-700 font-medium text-lg">
                    60세 이상<br />
                    <span className="text-gray-500 text-base">키오스크 이용 불편</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack / Features Highlight */}
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          <div className="glass-card rounded-2xl p-8 text-center hover:shadow-glow transition-all duration-300 group animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/30">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">실시간 AI 분석</h4>
            <p className="text-gray-600">Claude AI 기반 실시간 분석으로 즉각적인 피드백 제공</p>
          </div>

          <div className="glass-card rounded-2xl p-8 text-center hover:shadow-glow transition-all duration-300 group animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/30">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">가족 연결</h4>
            <p className="text-gray-600">보호자와 실시간 연동으로 안전한 생활 지원</p>
          </div>

          <div className="glass-card rounded-2xl p-8 text-center hover:shadow-glow transition-all duration-300 group animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-rose-500/30">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">쉬운 사용성</h4>
            <p className="text-gray-600">고령자 친화적 UI/UX로 누구나 쉽게 사용</p>
          </div>
        </div>

        {/* CTA Section - Premium Design */}
        <div className="relative overflow-hidden rounded-[2rem] animate-slide-up">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-gradient-shift"></div>
          <div className="absolute inset-0 bg-black/10"></div>

          {/* Pattern overlay */}
          <div className="absolute inset-0 pattern-dots opacity-10"></div>

          {/* Floating elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full filter blur-2xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

          {/* Content */}
          <div className="relative p-12 md:p-16 text-center text-white">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">지금 바로 시작하세요</span>
            </div>

            <h3 className="text-4xl md:text-5xl font-black mb-6">
              더 안전하고 편리한<br />디지털 생활
            </h3>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              SafeLife와 함께 고령자도 쉽고 안전하게<br />
              디지털 서비스를 이용할 수 있습니다
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/barcode"
                className="bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-xl hover:scale-105 flex items-center space-x-2 group"
              >
                <ScanBarcode className="w-5 h-5" />
                <span>바코드 스캔</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard?demo=true"
                className="bg-white/20 backdrop-blur text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all duration-300 border-2 border-white/50 shadow-2xl hover:shadow-xl hover:scale-105 flex items-center space-x-2"
              >
                <Eye className="w-5 h-5" />
                <span>보호자 모드</span>
              </Link>
              <Link
                href="/about"
                className="bg-purple-700/50 backdrop-blur text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-purple-700/70 transition-all duration-300 shadow-2xl hover:shadow-xl hover:scale-105 flex items-center space-x-2"
              >
                <Info className="w-5 h-5" />
                <span>프로젝트 소개</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Premium Footer */}
      <footer className="relative mt-24">
        <div className="glass-dark border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white">SafeLife Platform</h4>
              </div>
              <p className="text-gray-400 mb-6">
                AI 라이프 솔루션 챌린지 2025
              </p>
              <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-500 mb-8">
                <span className="flex items-center space-x-1">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>고령자 디지털 접근성</span>
                </span>
                <span className="hidden md:inline">•</span>
                <span className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-indigo-400" />
                  <span>안전한 생활 지원</span>
                </span>
                <span className="hidden md:inline">•</span>
                <span className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>AI 통합 플랫폼</span>
                </span>
              </div>
              <div className="text-xs text-gray-600">
                © 2025 SafeLife. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
