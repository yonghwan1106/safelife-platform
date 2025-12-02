import fs from 'fs'
import path from 'path'

// 컬렉션 하나씩 생성하기 위한 개별 파일 생성
const collectionsPath = path.join(process.cwd(), 'scripts', 'collections-import-with-ids.json')
const collections = JSON.parse(fs.readFileSync(collectionsPath, 'utf-8'))

const outputDir = path.join(process.cwd(), 'scripts', 'individual-collections')

// 출력 디렉토리 생성
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// 각 컬렉션을 개별 파일로 저장
collections.forEach((collection: any, index: number) => {
  const filename = `${index + 1}-${collection.name}.json`
  const filepath = path.join(outputDir, filename)
  fs.writeFileSync(filepath, JSON.stringify([collection], null, 2))
  console.log(`✅ Created: ${filename}`)
})

console.log(`\n📁 Total: ${collections.length} collections created in ${outputDir}`)
console.log('\n📝 Import order:')
collections.forEach((collection: any, index: number) => {
  console.log(`${index + 1}. ${collection.name}`)
})
