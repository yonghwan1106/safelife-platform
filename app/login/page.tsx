'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/pocketbase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await auth.signIn(email, password)
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleTestLogin = async (testEmail: string, testPassword: string) => {
    setError('')
    setLoading(true)

    try {
      await auth.signIn(testEmail, testPassword)
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SafeLife</h1>
          <p className="text-gray-600">로그인하여 서비스를 이용하세요</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            계정이 없으신가요?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              회원가입
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 font-medium mb-3">테스트 계정으로 빠른 로그인</p>
            <div className="space-y-2">
              <button
                onClick={() => handleTestLogin('elderly1@test.com', 'password123')}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
              >
                👴 고령자 계정으로 로그인
              </button>
              <button
                onClick={() => handleTestLogin('guardian1@test.com', 'password123')}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
              >
                👨‍👩‍👧 보호자 계정으로 로그인
              </button>
            </div>
            <div className="mt-3 space-y-1 text-xs text-gray-500">
              <p>고령자: elderly1@test.com</p>
              <p>보호자: guardian1@test.com</p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-gray-500 text-sm hover:text-gray-700">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
