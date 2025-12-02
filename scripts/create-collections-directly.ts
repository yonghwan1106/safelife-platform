/**
 * PocketBase API를 직접 호출하여 컬렉션 생성
 * Import 기능 대신 Collections API 사용
 */

import fs from 'fs'
import path from 'path'

const POCKETBASE_URL = 'https://ai-life-solution-challenge.duckdns.org'

async function getAdminToken() {
  // 브라우저에서 로그인한 상태에서 개발자 도구로 토큰 추출
  console.log('📋 Instructions:')
  console.log('1. Open PocketBase Admin: ' + POCKETBASE_URL + '/_/')
  console.log('2. Open DevTools (F12) > Application > Local Storage')
  console.log('3. Find "pocketbase_auth" key')
  console.log('4. Copy the "token" value')
  console.log('\nPaste the token here and press Enter:')

  // Node.js에서 입력 받기
  return new Promise<string>((resolve) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })

    readline.question('Token: ', (token: string) => {
      readline.close()
      resolve(token.trim())
    })
  })
}

async function createCollection(collection: any, token: string) {
  const response = await fetch(`${POCKETBASE_URL}/api/collections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(collection)
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create collection: ${error}`)
  }

  return await response.json()
}

async function main() {
  console.log('🚀 PocketBase Collection Creator\n')

  // 토큰 입력 받기
  const token = await getAdminToken()

  if (!token) {
    console.error('❌ Token is required')
    process.exit(1)
  }

  console.log('\n✅ Token received\n')

  // 개별 컬렉션 파일 읽기
  const individualDir = path.join(process.cwd(), 'scripts', 'individual-collections')
  const files = fs.readdirSync(individualDir)
    .filter(f => f.endsWith('.json'))
    .filter(f => !f.includes('1-products') && !f.includes('2-scan_history')) // 이미 생성된 것 제외
    .sort()

  console.log(`📦 Found ${files.length} collections to create\n`)

  // 각 컬렉션 생성
  for (const filename of files) {
    const filepath = path.join(individualDir, filename)
    const content = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
    const collection = content[0] // 배열의 첫 번째 요소

    try {
      console.log(`📝 Creating ${collection.name}...`)
      await createCollection(collection, token)
      console.log(`✅ Created ${collection.name}`)
    } catch (error) {
      console.error(`❌ Failed to create ${collection.name}:`, error instanceof Error ? error.message : error)
    }
  }

  console.log('\n🎉 Done!')
}

main()
