'use client'

import Link from 'next/link'
import { ArrowLeft, LucideIcon, Home, Sparkles } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description?: string
  icon: LucideIcon
  gradientFrom: string
  gradientTo: string
  backLink?: string
}

export default function PageHeader({
  title,
  description,
  icon: Icon,
  gradientFrom,
  gradientTo,
  backLink = '/'
}: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden mb-8">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-5`}></div>
        <div className="absolute inset-0 pattern-grid opacity-30"></div>
        {/* Floating orbs */}
        <div className={`absolute top-0 right-[20%] w-48 h-48 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full filter blur-[80px] opacity-20 animate-float`}></div>
        <div className={`absolute bottom-0 left-[10%] w-32 h-32 bg-gradient-to-br ${gradientTo} ${gradientFrom} rounded-full filter blur-[60px] opacity-15 animate-float`} style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header Content */}
      <div className="relative glass-premium border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Navigation */}
          <div className="flex items-center space-x-3 mb-6">
            <Link
              href={backLink}
              className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full text-gray-600 hover:text-gray-900 transition-all group hover:shadow-md"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">뒤로가기</span>
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="/"
              className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full text-gray-600 hover:text-gray-900 transition-all group hover:shadow-md"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">홈</span>
            </Link>
          </div>

          {/* Title Section */}
          <div className="flex items-center space-x-6">
            {/* Icon with glow */}
            <div className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl filter blur-xl opacity-50 group-hover:opacity-70 transition-opacity`}></div>
              <div className={`relative w-20 h-20 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                <Icon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse-soft">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            {/* Text */}
            <div className="flex-1">
              <h1 className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent mb-2`}>
                {title}
              </h1>
              {description && (
                <p className="text-gray-600 text-lg">{description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Accent Line with glow */}
      <div className="relative">
        <div className={`h-1.5 bg-gradient-to-r ${gradientFrom} ${gradientTo}`}></div>
        <div className={`absolute inset-0 h-1.5 bg-gradient-to-r ${gradientFrom} ${gradientTo} filter blur-sm opacity-50`}></div>
      </div>
    </div>
  )
}
