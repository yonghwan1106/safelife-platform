'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDark(true)
      document.documentElement.setAttribute('data-theme', 'dark')
      document.documentElement.classList.add('dark')
    } else if (savedTheme === 'light') {
      setIsDark(false)
      document.documentElement.setAttribute('data-theme', 'light')
      document.documentElement.classList.remove('dark')
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true)
      document.documentElement.setAttribute('data-theme', 'dark')
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'light')
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      document.documentElement.setAttribute('data-theme', 'dark')
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  if (!mounted) {
    return (
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-white/80 backdrop-blur rounded-full shadow-lg flex items-center justify-center z-50">
        <Sun className="w-6 h-6 text-gray-400" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 w-14 h-14 glass-card rounded-full shadow-xl flex items-center justify-center z-50 hover:shadow-glow transition-all duration-300 group border-2 border-indigo-100 hover:border-indigo-300"
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {isDark ? (
        <Sun className="w-6 h-6 text-yellow-500 group-hover:rotate-180 transition-transform duration-500" />
      ) : (
        <Moon className="w-6 h-6 text-indigo-600 group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  )
}
