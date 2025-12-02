import fs from 'fs'
import path from 'path'

// Generate PocketBase-style collection ID (15 chars)
function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 15; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

// Generate PocketBase-style field ID (8 chars)
function generateFieldId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

const inputFile = path.join(process.cwd(), 'scripts', 'collections-import.json')
const outputFile = path.join(process.cwd(), 'scripts', 'collections-import-with-ids.json')

const collections = JSON.parse(fs.readFileSync(inputFile, 'utf-8'))

// Add IDs to each collection and its fields
const collectionsWithIds = collections.map((collection: any) => {
  const collectionWithId = {
    id: generateId(),
    ...collection,
    schema: collection.schema.map((field: any) => ({
      system: false,
      id: generateFieldId(),
      ...field,
      presentable: false
    }))
  }
  return collectionWithId
})

fs.writeFileSync(outputFile, JSON.stringify(collectionsWithIds, null, 2))

console.log('✅ Generated collections with IDs')
console.log(`📄 Output: ${outputFile}`)
console.log(`📊 Collections: ${collectionsWithIds.length}`)
