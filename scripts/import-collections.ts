import PocketBase from 'pocketbase'
import fs from 'fs'
import path from 'path'

const POCKETBASE_URL = 'https://ai-life-solution-challenge.duckdns.org'
const ADMIN_EMAIL = 'sanoramyun8@gmail.com'
const ADMIN_PASSWORD = 'T22qjsrlf67!'

async function importCollections() {
  const pb = new PocketBase(POCKETBASE_URL)

  try {
    // Authenticate as admin
    console.log('🔐 Authenticating as admin...')
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
    console.log('✅ Admin authenticated')

    // Read the collections JSON
    const collectionsPath = path.join(process.cwd(), 'scripts', 'collections-import-with-ids.json')
    const collections = JSON.parse(fs.readFileSync(collectionsPath, 'utf-8'))

    console.log(`📦 Found ${collections.length} collections to import`)

    // Create each collection
    for (const collection of collections) {
      try {
        console.log(`\n📝 Creating collection: ${collection.name}`)

        // Use the collections API endpoint
        const response = await fetch(`${POCKETBASE_URL}/api/collections`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': pb.authStore.token,
          },
          body: JSON.stringify(collection)
        })

        if (!response.ok) {
          const error = await response.text()
          console.error(`❌ Failed to create ${collection.name}:`, error)
        } else {
          console.log(`✅ Created collection: ${collection.name}`)
        }
      } catch (error) {
        console.error(`❌ Error creating ${collection.name}:`, error)
      }
    }

    console.log('\n🎉 Collections import completed!')
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

importCollections()
