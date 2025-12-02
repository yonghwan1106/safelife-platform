import fs from 'fs'
import path from 'path'

// 컬렉션 이름 -> ID 매핑
const collectionIdMap: Record<string, string> = {
  'products': 'j7yqlsbo5u7bsk1',
  'scan_history': 'brmwshj4eenfyhc',
  'voice_phishing_logs': '1uzmmlcwe85yyuv',
  'kiosk_sessions': 'yakd1gi1bmznz5f',
  'guardian_notifications': 'dth23idkeac70gu',
  'emergency_contacts': 'mcok0zfpekyiz48',
  'daily_activities': 'u62z139pn4ib8ma'
}

const individualDir = path.join(process.cwd(), 'scripts', 'individual-collections')
const files = fs.readdirSync(individualDir)

files.forEach(filename => {
  if (!filename.endsWith('.json')) return

  const filepath = path.join(individualDir, filename)
  const content = fs.readFileSync(filepath, 'utf-8')
  const collections = JSON.parse(content)

  let modified = false

  collections.forEach((collection: any) => {
    if (collection.schema) {
      collection.schema.forEach((field: any) => {
        if (field.type === 'relation' && field.options?.collectionId) {
          const oldId = field.options.collectionId
          // "products" -> "j7yqlsbo5u7bsk1" 같은 변환
          if (collectionIdMap[oldId]) {
            field.options.collectionId = collectionIdMap[oldId]
            console.log(`📝 ${collection.name}.${field.name}: ${oldId} -> ${collectionIdMap[oldId]}`)
            modified = true
          }
        }
      })
    }
  })

  if (modified) {
    fs.writeFileSync(filepath, JSON.stringify(collections, null, 2))
    console.log(`✅ Updated: ${filename}`)
  }
})

console.log('\n✨ All collection references updated!')
