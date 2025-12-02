'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/pocketbase'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    role: 'elderly' as 'elderly' | 'guardian'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    if (formData.password.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다.')
      return
    }

    setLoading(true)

    try {
      await auth.signUp(formData.email, formData.password, formData.name, formData.role)
      router.push('/login?signup=success')
    } catch (err: any) {
      console.error('Signup error:', err)
      setError(err.message || '회원가입에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h1>
          <p className="text-gray-600">SafeLife와 함께 안전한 디지털 생활을 시작하세요</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              역할
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="elderly">고령자</option>
              <option value="guardian">보호자</option>
            </select>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="비밀번호 (최소 8자)"
              required
            />
          </div>

          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호 확인
            </label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              value={formData.passwordConfirm}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
              로그인
            </Link>
          </p>
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
