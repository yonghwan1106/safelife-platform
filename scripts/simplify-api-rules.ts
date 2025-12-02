import fs from 'fs'
import path from 'path'

const individualDir = path.join(process.cwd(), 'scripts', 'individual-collections')
const files = fs.readdirSync(individualDir).filter(f => f.endsWith('.json'))

files.forEach(filename => {
  const filepath = path.join(individualDir, filename)
  const content = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
  const collection = content[0]

  let modified = false

  // guardians 참조 제거
  if (collection.listRule) {
    const newRule = collection.listRule.replace(/ \|\| @request\.auth\.id \?= user\.guardians\.id/g, '')
    if (newRule !== collection.listRule) {
      collection.listRule = newRule
      modified = true
    }
  }

  if (collection.viewRule) {
    const newRule = collection.viewRule.replace(/ \|\| @request\.auth\.id \?= user\.guardians\.id/g, '')
    if (newRule !== collection.viewRule) {
      collection.viewRule = newRule
      modified = true
    }
  }

  if (collection.updateRule) {
    const newRule = collection.updateRule.replace(/ \|\| @request\.auth\.id \?= user\.guardians\.id/g, '')
    if (newRule !== collection.updateRule) {
      collection.updateRule = newRule
      modified = true
    }
  }

  // guardian_notifications의 voice_phishing_logs 참조도 확인
  if (collection.name === 'guardian_notifications') {
    collection.schema.forEach((field: any) => {
      if (field.name === 'related_log' && field.options?.collectionId === 'voice_phishing_logs') {
        // voice_phishing_logs ID로 변경
        field.options.collectionId = '1uzmmlcwe85yyuv'
        modified = true
      }
    })
  }

  if (modified) {
    fs.writeFileSync(filepath, JSON.stringify([collection], null, 2))
    console.log(`✅ Simplified ${filename}`)
  }
})

console.log('\n✨ API rules simplified!')
