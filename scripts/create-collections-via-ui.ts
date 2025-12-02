/**
 * PocketBase Admin UI를 통해 컬렉션을 하나씩 생성하는 자동화 스크립트
 *
 * 실행 방법:
 * npx playwright install chromium
 * npx tsx scripts/create-collections-via-ui.ts
 */

import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const POCKETBASE_URL = 'https://ai-life-solution-challenge.duckdns.org'
const ADMIN_EMAIL = 'sanoramyun8@gmail.com'
const ADMIN_PASSWORD = 'T22qjsrlf67!'

async function main() {
  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage()

  try {
    // 1. 로그인
    console.log('🔐 Logging in...')
    await page.goto(`${POCKETBASE_URL}/_/`)
    await page.fill('input[type="email"]', ADMIN_EMAIL)
    await page.fill('input[type="password"]', ADMIN_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL(/collections/, { timeout: 10000 })
    console.log('✅ Logged in successfully')

    // 2. 개별 컬렉션 파일 읽기
    const individualDir = path.join(process.cwd(), 'scripts', 'individual-collections')
    const files = fs.readdirSync(individualDir)
      .filter(f => f.endsWith('.json'))
      .sort()

    // 이미 생성된 products는 건너뛰기
    const filesToImport = files.filter(f => !f.includes('1-products'))

    console.log(`\n📦 Found ${filesToImport.length} collections to import`)

    // 3. 각 컬렉션 import
    for (const filename of filesToImport) {
      const filepath = path.join(individualDir, filename)
      const content = fs.readFileSync(filepath, 'utf-8')

      console.log(`\n📝 Importing ${filename}...`)

      // Settings > Import collections로 이동
      await page.goto(`${POCKETBASE_URL}/_/#/settings/import-collections`)
      await page.waitForTimeout(1000)

      // JSON 붙여넣기
      const textarea = await page.locator('textarea').first()
      await textarea.fill(content)
      await page.waitForTimeout(500)

      // Review 버튼 클릭
      const reviewButton = await page.getByRole('button', { name: 'Review' })
      if (await reviewButton.isEnabled()) {
        await reviewButton.click()
        await page.waitForTimeout(1000)

        // Confirm 버튼 클릭
        const confirmButton = await page.getByRole('button', { name: /Confirm|Import/ })
        if (confirmButton) {
          await confirmButton.click()
          await page.waitForTimeout(2000)
          console.log(`✅ Imported ${filename}`)
        }
      } else {
        console.log(`⚠️ Review button not enabled for ${filename}`)
        // 스크린샷 저장
        await page.screenshot({ path: `error-${filename}.png` })
      }
    }

    console.log('\n🎉 All collections imported successfully!')

  } catch (error) {
    console.error('❌ Error:', error)
    await page.screenshot({ path: 'error.png' })
  } finally {
    await browser.close()
  }
}

main()
