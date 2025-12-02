/**
 * PocketBase 컬렉션 자동 생성 스크립트
 *
 * 실행 방법:
 * POCKETBASE_ADMIN_EMAIL=sanoramyun8@gmail.com POCKETBASE_ADMIN_PASSWORD=T22qjsrlf67! npx tsx scripts/create-collections.ts
 */

import PocketBase from 'pocketbase'

const pb = new PocketBase('https://ai-life-solution-challenge.duckdns.org')

const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'sanoramyun8@gmail.com'
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'T22qjsrlf67!'

async function authenticateAdmin() {
  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
    console.log('✅ Admin authenticated successfully')
    return true
  } catch (error) {
    console.error('❌ Admin authentication failed:', error)
    return false
  }
}

async function createCollection(collectionData: any) {
  try {
    const response = await fetch(`${pb.baseUrl}/api/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': pb.authStore.token
      },
      body: JSON.stringify(collectionData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(JSON.stringify(error))
    }

    const result = await response.json()
    console.log(`✅ Created collection: ${collectionData.name}`)
    return result
  } catch (error: any) {
    console.error(`❌ Failed to create collection ${collectionData.name}:`, error.message)
    return null
  }
}

async function main() {
  console.log('🚀 Starting PocketBase collections creation...\n')

  const authenticated = await authenticateAdmin()
  if (!authenticated) {
    process.exit(1)
  }

  // Collection 1: products (Base Collection)
  const productsCollection = {
    name: 'products',
    type: 'base',
    schema: [
      {
        name: 'barcode',
        type: 'text',
        required: true,
        options: {
          min: 8,
          max: 20,
          pattern: ''
        }
      },
      {
        name: 'name',
        type: 'text',
        required: true,
        options: {
          min: null,
          max: 200,
          pattern: ''
        }
      },
      {
        name: 'brand',
        type: 'text',
        required: false,
        options: {
          min: null,
          max: 100,
          pattern: ''
        }
      },
      {
        name: 'category',
        type: 'select',
        required: false,
        options: {
          maxSelect: 1,
          values: ['food', 'medicine', 'cosmetic', 'other']
        }
      },
      {
        name: 'description',
        type: 'editor',
        required: false,
        options: {
          convertUrls: false
        }
      },
      {
        name: 'ingredients',
        type: 'json',
        required: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: 'allergens',
        type: 'json',
        required: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: 'expiry_date',
        type: 'date',
        required: false,
        options: {
          min: '',
          max: ''
        }
      },
      {
        name: 'warnings',
        type: 'editor',
        required: false,
        options: {
          convertUrls: false
        }
      },
      {
        name: 'image',
        type: 'file',
        required: false,
        options: {
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          thumbs: ['100x100']
        }
      }
    ],
    indexes: ['CREATE UNIQUE INDEX idx_barcode ON products (barcode)'],
    listRule: '',
    viewRule: '',
    createRule: null,
    updateRule: null,
    deleteRule: null
  }

  await createCollection(productsCollection)

  // Collection 2: scan_history (Base Collection)
  const scanHistoryCollection = {
    name: 'scan_history',
    type: 'base',
    schema: [
      {
        name: 'user',
        type: 'relation',
        required: true,
        options: {
          collectionId: 'users',
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: ['name']
        }
      },
      {
        name: 'product',
        type: 'relation',
        required: true,
        options: {
          collectionId: 'products',
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: ['name']
        }
      },
      {
        name: 'barcode',
        type: 'text',
        required: true,
        options: {
          min: null,
          max: 20,
          pattern: ''
        }
      },
      {
        name: 'scan_type',
        type: 'select',
        required: true,
        options: {
          maxSelect: 1,
          values: ['barcode', 'ocr', 'manual']
        }
      },
      {
        name: 'location',
        type: 'text',
        required: false,
        options: {
          min: null,
          max: null,
          pattern: ''
        }
      },
      {
        name: 'tts_played',
        type: 'bool',
        required: false
      }
    ],
    listRule: '@request.auth.id = user.id || @request.auth.id ?= user.guardians.id',
    viewRule: '@request.auth.id = user.id || @request.auth.id ?= user.guardians.id',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id = user.id',
    deleteRule: '@request.auth.id = user.id'
  }

  await createCollection(scanHistoryCollection)

  // Collection 3: voice_phishing_logs (Base Collection)
  const voicePhishingLogsCollection = {
    name: 'voice_phishing_logs',
    type: 'base',
    schema: [
      {
        name: 'user',
        type: 'relation',
        required: true,
        options: {
          collectionId: 'users',
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: ['name']
        }
      },
      {
        name: 'transcript',
        type: 'editor',
        required: true,
        options: {
          convertUrls: false
        }
      },
      {
        name: 'risk_level',
        type: 'select',
        required: true,
        options: {
          maxSelect: 1,
          values: ['low', 'medium', 'high']
        }
      },
      {
        name: 'detected_patterns',
        type: 'json',
        required: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: 'caller_info',
        type: 'json',
        required: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: 'duration',
        type: 'number',
        required: false,
        options: {
          min: 0,
          max: null,
          noDecimal: false
        }
      },
      {
        name: 'guardian_notified',
        type: 'bool',
        required: false
      },
      {
        name: 'is_blocked',
        type: 'bool',
        required: false
      },
      {
        name: 'user_action',
        type: 'select',
        required: false,
        options: {
          maxSelect: 1,
          values: ['none', 'reported', 'blocked', 'ignored']
        }
      }
    ],
    listRule: '@request.auth.id = user.id || @request.auth.id ?= user.guardians.id',
    viewRule: '@request.auth.id = user.id || @request.auth.id ?= user.guardians.id',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id = user.id || @request.auth.id ?= user.guardians.id',
    deleteRule: '@request.auth.id = user.id'
  }

  await createCollection(voicePhishingLogsCollection)

  // Collection 4: kiosk_sessions (Base Collection)
  const kioskSessionsCollection = {
    name: 'kiosk_sessions',
    type: 'base',
    schema: [
      {
        name: 'user',
        type: 'relation',
        required: true,
        options: {
          collectionId: 'users',
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: ['name']
        }
      },
      {
        name: 'kiosk_type',
        type: 'select',
        required: true,
        options: {
          maxSelect: 1,
          values: ['fastfood', 'cafe', 'ticket', 'payment', 'other']
        }
      },
      {
        name: 'location',
        type: 'text',
        required: false,
        options: {
          min: null,
          max: null,
          pattern: ''
        }
      },
      {
        name: 'screenshot',
        type: 'file',
        required: false,
        options: {
          maxSelect: 99,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          thumbs: ['100x100']
        }
      },
      {
        name: 'steps_completed',
        type: 'json',
        required: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: 'duration',
        type: 'number',
        required: false,
        options: {
          min: 0,
          max: null,
          noDecimal: false
        }
      },
      {
        name: 'success',
        type: 'bool',
        required: false
      },
      {
        name: 'help_requested',
        type: 'bool',
        required: false
      }
    ],
    listRule: '@request.auth.id = user.id || @request.auth.id ?= user.guardians.id',
    viewRule: '@request.auth.id = user.id || @request.auth.id ?= user.guardians.id',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id = user.id',
    deleteRule: '@request.auth.id = user.id'
  }

  await createCollection(kioskSessionsCollection)

  // Collection 5: guardian_notifications (Base Collection)
  const guardianNotificationsCollection = {
    name: 'guardian_notifications',
    type: 'base',
    schema: [
      {
        name: 'guardian',
        type: 'relation',
        required: true,
        options: {
          collectionId: 'users',
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: ['name']
        }
      },
      {
        name: 'elderly_user',
        type: 'relation',
        required: true,
        options: {
          collectionId: 'users',
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: ['name']
        }
      },
      {
        name: 'notification_type',
        type: 'select',
        required: true,
        options: {
          maxSelect: 1,
          values: ['voice_phishing', 'unusual_activity', 'emergency', 'daily_summary']
        }
      },
      {
        name: 'title',
        type: 'text',
        required: true,
        options: {
          min: null,
          max: 200,
          pattern: ''
        }
      },
      {
        name: 'message',
        type: 'editor',
        required: true,
        options: {
          convertUrls: false
        }
      },
      {
        name: 'priority',
        type: 'select',
        required: false,
        options: {
          maxSelect: 1,
          values: ['low', 'medium', 'high', 'urgent']
        }
      },
      {
        name: 'related_log',
        type: 'relation',
        required: false,
        options: {
          collectionId: 'voice_phishing_logs',
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: []
        }
      },
      {
        name: 'is_read',
        type: 'bool',
        required: false
      },
      {
        name: 'read_at',
        type: 'date',
        required: false,
        options: {
          min: '',
          max: ''
        }
      }
    ],
    listRule: '@request.auth.id = guardian.id',
    viewRule: '@request.auth.id = guardian.id',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id = guardian.id',
    deleteRule: '@request.auth.id = guardian.id'
  }

  await createCollection(guardianNotificationsCollection)

  // Collection 6: emergency_contacts (Base Collection)
  const emergencyContactsCollection = {
    name: 'emergency_contacts',
    type: 'base',
    schema: [
      {
        name: 'user',
        type: 'relation',
        required: true,
        options: {
          collectionId: 'users',
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: ['name']
        }
      },
      {
        name: 'name',
        type: 'text',
        required: true,
        options: {
          min: null,
          max: 100,
          pattern: ''
        }
      },
      {
        name: 'relationship',
        type: 'text',
        required: false,
        options: {
          min: null,
          max: 50,
          pattern: ''
        }
      },
      {
        name: 'phone',
        type: 'text',
        required: true,
        options: {
          min: null,
          max: 20,
          pattern: ''
        }
      },
      {
        name: 'email',
        type: 'email',
        required: false,
        options: {
          exceptDomains: [],
          onlyDomains: []
        }
      },
      {
        name: 'priority',
        type: 'number',
        required: false,
        options: {
          min: 1,
          max: 10,
          noDecimal: true
        }
      },
      {
        name: 'is_primary',
        type: 'bool',
        required: false
      }
    ],
    listRule: '@request.auth.id = user.id || @request.auth.id ?= user.guardians.id',
    viewRule: '@request.auth.id = user.id || @request.auth.id ?= user.guardians.id',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id = user.id',
    deleteRule: '@request.auth.id = user.id'
  }

  await createCollection(emergencyContactsCollection)

  // Collection 7: daily_activities (Base Collection)
  const dailyActivitiesCollection = {
    name: 'daily_activities',
    type: 'base',
    schema: [
      {
        name: 'user',
        type: 'relation',
        required: true,
        options: {
          collectionId: 'users',
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: ['name']
        }
      },
      {
        name: 'date',
        type: 'date',
        required: true,
        options: {
          min: '',
          max: ''
        }
      },
      {
        name: 'barcode_scans',
        type: 'number',
        required: false,
        options: {
          min: 0,
          max: null,
          noDecimal: true
        }
      },
      {
        name: 'kiosk_uses',
        type: 'number',
        required: false,
        options: {
          min: 0,
          max: null,
          noDecimal: true
        }
      },
      {
        name: 'voice_phishing_detections',
        type: 'number',
        required: false,
        options: {
          min: 0,
          max: null,
          noDecimal: true
        }
      },
      {
        name: 'active_time',
        type: 'number',
        required: false,
        options: {
          min: 0,
          max: null,
          noDecimal: true
        }
      },
      {
        name: 'health_score',
        type: 'number',
        required: false,
        options: {
          min: 0,
          max: 100,
          noDecimal: true
        }
      },
      {
        name: 'summary',
        type: 'editor',
        required: false,
        options: {
          convertUrls: false
        }
      }
    ],
    listRule: '@request.auth.id = user.id || @request.auth.id ?= user.guardians.id',
    viewRule: '@request.auth.id = user.id || @request.auth.id ?= user.guardians.id',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id = user.id'
  }

  await createCollection(dailyActivitiesCollection)

  console.log('\n✨ Collection creation process completed!')
  console.log('\n📋 Note: The "users" auth collection should already exist by default.')
  console.log('    You may need to manually add the following fields to the users collection:')
  console.log('    - role (select: elderly, guardian)')
  console.log('    - phone (text)')
  console.log('    - birthdate (date)')
  console.log('    - address (text)')
  console.log('    - guardians (relation to users, multiple)')
}

main().catch(console.error)
