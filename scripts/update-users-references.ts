import fs from 'fs'
import path from 'path'

const NEW_USERS_ID = 'fzlbrvvnlvgtcor' // 새로 생성된 users 컬렉션 ID

const individualDir = path.join(process.cwd(), 'scripts', 'individual-collections')
const files = fs.readdirSync(individualDir).filter(f => f.endsWith('.json'))

files.forEach(filename => {
  const filepath = path.join(individualDir, filename)
  let content = fs.readFileSync(filepath, 'utf-8')

  // "_pb_users_auth_"를 새 ID로 교체
  const updated = content.replace(/_pb_users_auth_/g, NEW_USERS_ID)

  if (content !== updated) {
    fs.writeFileSync(filepath, updated)
    console.log(`✅ Updated ${filename}`)
  }
})

console.log('\n✨ All references updated!')
