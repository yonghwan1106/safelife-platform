import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft, Target, Lightbulb, Award, CheckCircle, Code, Cpu, Shield,
  TrendingUp, Sparkles, Zap, Heart, Users, Star, Rocket, Globe
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 gradient-mesh"></div>
        <div className="absolute inset-0 pattern-grid opacity-20"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="relative glass-effect border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group">
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">홈으로</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                프로젝트 소개
              </h1>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16 animate-slide-up">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-700">AI 라이프 솔루션 챌린지 2025</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                SafeLife Platform
              </span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
              고령자의 디지털 접근성 향상과 안전한 생활을 위한 AI 통합 플랫폼
            </p>
          </div>
          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/intro.jpg"
                alt="가족이 함께하는 따뜻한 시간"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-10 mb-12 overflow-hidden border border-red-100">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-pink-500"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-100 to-pink-100 rounded-full filter blur-3xl opacity-30 -mr-32 -mt-32"></div>

          <div className="flex items-center mb-8 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              해결하고자 하는 문제
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative z-10">
            <div className="group cursor-pointer">
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border-l-4 border-red-500 hover:shadow-lg transition-all">
                <div className="text-5xl font-bold bg-gradient-to-br from-red-600 to-pink-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">
                  73%
                </div>
                <p className="text-gray-700 font-medium leading-relaxed">
                  고령자가 디지털 기기 사용에 어려움을 겪고 있습니다
                </p>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-l-4 border-orange-500 hover:shadow-lg transition-all">
                <div className="text-5xl font-bold bg-gradient-to-br from-orange-600 to-red-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">
                  1.8조원
                </div>
                <p className="text-gray-700 font-medium leading-relaxed">
                  2024년 보이스피싱 피해액, 고령자 집중 피해
                </p>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-l-4 border-yellow-500 hover:shadow-lg transition-all">
                <div className="text-5xl font-bold bg-gradient-to-br from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">
                  85%
                </div>
                <p className="text-gray-700 font-medium leading-relaxed">
                  60세 이상이 키오스크 이용에 불편을 느낍니다
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Solution Overview */}
        <div className="relative overflow-hidden rounded-3xl mb-12">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 pattern-dots opacity-20"></div>

          <div className="relative p-10 text-white">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mr-4">
                <Lightbulb className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl font-bold">우리의 솔루션</h3>
            </div>
            <p className="text-xl mb-8 leading-relaxed opacity-95">
              SafeLife는 고령자의 디지털 소외를 해소하고 일상 생활의 안전을 강화하기 위해
              <strong className="text-yellow-300"> 4가지 핵심 AI 기능</strong>을 하나의 통합 플랫폼에 구현했습니다.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: '🔊', title: '음성 바코드 리더', desc: '바코드를 스캔하면 제품 정보를 음성으로 안내' },
                { icon: '🖥️', title: 'AI 키오스크 도우미', desc: '화면을 인식하여 주문 과정을 단계별 안내' },
                { icon: '🛡️', title: '보이스피싱 실시간 감지', desc: '통화 내용을 분석하여 위험을 즉시 차단' },
                { icon: '👪', title: '보호자 대시보드', desc: '가족의 안전 상태를 실시간 모니터링' }
              ].map((item, idx) => (
                <div key={idx} className="glass-effect rounded-2xl p-5 hover:bg-white/30 transition-all group">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl">{item.icon}</span>
                    <h4 className="font-bold text-lg">{item.title}</h4>
                  </div>
                  <p className="text-sm opacity-90 pl-12">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-10 mb-12 overflow-hidden border border-indigo-100">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-500"></div>

          <div className="flex items-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <Award className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              핵심 차별화 요소
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: '3개 수상 아이디어 통합', desc: 'AI 라이프 아이디어 챌린지 선정작 3개를 통합하여 5점 가점 획득', gradient: 'from-green-500 to-emerald-500' },
              { title: '실제 사용 가능한 프로토타입', desc: '추상적 개념이 아닌 즉시 체험 가능한 웹 애플리케이션', gradient: 'from-blue-500 to-cyan-500' },
              { title: 'On-Device AI 강조', desc: '개인정보 보호를 위한 로컬 AI 처리 및 Web Speech API 활용', gradient: 'from-purple-500 to-pink-500' },
              { title: '보호자-고령자 이중 시스템', desc: '독립적 사용과 동시에 안전망 제공으로 지속가능성 확보', gradient: 'from-orange-500 to-red-500' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start space-x-4 group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-10 mb-12 overflow-hidden border border-purple-100">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-pink-500"></div>

          <div className="flex items-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <Code className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              기술 스택
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border-2 border-indigo-200 hover:border-indigo-400 transition-all group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200 rounded-full filter blur-2xl opacity-30 -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-3">Frontend</h4>
                <div className="space-y-2">
                  {['Next.js 15 (App Router)', 'TypeScript 5', 'Tailwind CSS 3', 'Lucide React Icons'].map((tech, i) => (
                    <div key={i} className="flex items-center text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></div>
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full filter blur-2xl opacity-30 -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-3">AI/ML</h4>
                <div className="space-y-2">
                  {['html5-qrcode (바코드)', 'react-webcam (화면 캡처)', 'Web Speech API (TTS/STT)', '패턴 매칭 알고리즘'].map((tech, i) => (
                    <div key={i} className="flex items-center text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></div>
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 hover:border-green-400 transition-all group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full filter blur-2xl opacity-30 -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-3">향후 계획</h4>
                <div className="space-y-2">
                  {['Google Cloud Vision API', 'OpenAI GPT-4', 'TensorFlow Lite', 'PocketBase/Supabase'].map((tech, i) => (
                    <div key={i} className="flex items-center text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expected Impact */}
        <div className="relative overflow-hidden rounded-3xl mb-12">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600"></div>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 pattern-grid opacity-20"></div>

          <div className="relative p-10 text-white">
            <div className="flex items-center mb-8">
              <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mr-4">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl font-bold">기대 효과</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold mb-6 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-300" />
                  사회적 영향
                </h4>
                <div className="space-y-4">
                  {[
                    { label: '디지털 접근성', value: '+30%', width: '30%' },
                    { label: '보이스피싱 피해 감소', value: '-50%', width: '50%' },
                    { label: '키오스크 불편 해소', value: '-70%', width: '70%' }
                  ].map((item, idx) => (
                    <div key={idx} className="glass-effect rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{item.label}</span>
                        <span className="text-2xl font-bold text-yellow-300">{item.value}</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-yellow-300 h-2 rounded-full transition-all duration-1000" style={{ width: item.width }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-6 flex items-center">
                  <Rocket className="w-5 h-5 mr-2 text-yellow-300" />
                  경제적 가치
                </h4>
                <div className="space-y-4">
                  {[
                    { amount: '9,000억원', desc: '보이스피싱 피해 예방으로 연간 절감 가능' },
                    { amount: 'GDP 0.3%', desc: '디지털 소외 해소를 통한 경제 기여' },
                    { amount: '300만원/년', desc: '가구당 돌봄 비용 절감' }
                  ].map((item, idx) => (
                    <div key={idx} className="glass-effect rounded-xl p-4 hover:bg-white/30 transition-all">
                      <div className="text-3xl font-bold text-yellow-300 mb-2">{item.amount}</div>
                      <p className="text-sm opacity-90">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team/Contact */}
        <div className="relative bg-white/80 backdrop-blur rounded-3xl card-shadow p-10 mb-12 overflow-hidden border border-gray-200">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-400 to-gray-600"></div>

          <div className="flex items-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
              프로젝트 정보
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
              <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-indigo-600" />
                대회 정보
              </h4>
              <div className="space-y-3 text-gray-700">
                {[
                  { label: '대회명', value: 'AI 라이프 솔루션 챌린지 2025' },
                  { label: '주최', value: '한국산업기술평가관리원 (KEIT)' },
                  { label: '제출 마감', value: '2025년 12월 2일 17:00' },
                  { label: '총 상금', value: '1,000만원' }
                ].map((item, idx) => (
                  <div key={idx} className="flex">
                    <span className="font-semibold min-w-[100px]">{item.label}:</span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
              <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                프로젝트 링크
              </h4>
              <div className="space-y-3">
                <a
                  href="https://github.com/yonghwan1106/ai_life_solution_challenge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all text-center font-semibold group"
                >
                  <span className="group-hover:scale-105 inline-block transition-transform">
                    GitHub 저장소 방문 →
                  </span>
                </a>
                <a href="https://www.youtube.com/watch?v=1a2WlKcqWbQ" target="_blank" rel="noopener noreferrer" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all text-center font-semibold group block">
                  <span className="group-hover:scale-105 inline-block transition-transform">
                    라이브 데모 보기 →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}></div>

          <div className="relative p-12 text-center text-white">
            <div className="flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-red-300 mr-3 animate-pulse-soft" />
              <h3 className="text-4xl font-bold">지금 바로 체험해보세요</h3>
            </div>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              SafeLife의 4가지 핵심 기능을 직접 사용해보고 AI 기술의 가능성을 경험하세요
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/barcode"
                className="bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-xl hover:scale-105 btn-large"
              >
                바코드 스캔 시작
              </Link>
              <Link
                href="/"
                className="bg-white/10 backdrop-blur text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white shadow-2xl hover:shadow-xl hover:scale-105 btn-large"
              >
                메인으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative mt-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-6 h-6 text-indigo-400" />
            <h4 className="text-2xl font-bold">SafeLife Platform</h4>
          </div>
          <p className="text-gray-400 mb-2">모두를 위한 안전하고 편리한 디지털 세상</p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500 mb-4">
            <span>AI 라이프 솔루션 챌린지 2025</span>
            <span>•</span>
            <span>Made with ❤️ by SafeLife Team</span>
          </div>
          <p className="text-xs text-gray-500">
            고령자의 디지털 접근성 향상과 안전한 생활을 위한 AI 통합 플랫폼
          </p>
        </div>
      </footer>
    </div>
  )
}
