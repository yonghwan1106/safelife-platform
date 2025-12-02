/**
 * Admin 이메일/비밀번호로 직접 인증 후 컬렉션 생성
 */

import fs from 'fs'
import path from 'path'

const POCKETBASE_URL = 'https://ai-life-solution-challenge.duckdns.org'
const ADMIN_EMAIL = 'sanoramyun8@gmail.com'
const ADMIN_PASSWORD = 'T22qjsrlf67!'

// Admin 로그인 (웹 인터페이스 인증)
async function loginAsAdmin() {
  // Admin UI 로그인은 다른 엔드포인트 사용
  const response = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identity: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Login failed: ${error}`)
  }

  const data = await response.json()
  return data.token
}

async function createCollection(collection: any, token: string) {
  const response = await fetch(`${POCKETBASE_URL}/api/collections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(collection)
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed: ${error}`)
  }

  return await response.json()
}

async function main() {
  console.log('🚀 PocketBase Collection Creator\n')

  try {
    // 1. Admin 로그인
    console.log('🔐 Logging in as admin...')
    const token = await loginAsAdmin()
    console.log('✅ Logged in successfully\n')

    // 2. 개별 컬렉션 파일 읽기
    const individualDir = path.join(process.cwd(), 'scripts', 'individual-collections')
    const files = fs.readdirSync(individualDir)
      .filter(f => f.endsWith('.json'))
      .filter(f => !f.includes('1-products') && !f.includes('2-scan_history'))
      .sort()

    console.log(`📦 Found ${files.length} collections to create\n`)

    // 3. 각 컬렉션 생성
    for (const filename of files) {
      const filepath = path.join(individualDir, filename)
      const content = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
      const collection = content[0]

      try {
        console.log(`📝 Creating ${collection.name}...`)
        await createCollection(collection, token)
        console.log(`✅ Created ${collection.name}`)
      } catch (error) {
        console.error(`❌ Failed to create ${collection.name}:`)
        console.error(error instanceof Error ? error.message : error)
      }
    }

    console.log('\n🎉 All collections created successfully!')

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

main()
