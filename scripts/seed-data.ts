/**
 * PocketBase 샘플 데이터 생성 스크립트
 *
 * 실행 방법:
 * npx tsx scripts/seed-data.ts
 */

import PocketBase from 'pocketbase'

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://ai-life-solution-challenge.duckdns.org')

// Admin 인증 정보 (환경변수로 설정 권장)
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'sanoramyun8@gmail.com'
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'T22qjsrlf67!'

async function authenticateAdmin() {
  try {
    // Admin 인증은 PocketBase SDK가 지원하지 않으므로
    // 일반 사용자로 생성하거나, Admin UI를 통해 수동으로 데이터 생성 필요
    console.log('⚠️  Admin API authentication not supported')
    console.log('📝 Creating data without admin auth - using public API')
    return null
  } catch (error) {
    console.error('❌ Admin authentication failed:', error)
    throw error
  }
}

async function createUsers() {
  console.log('\n📝 Creating users...')

  const users = []

  try {
    // 어르신 사용자 1
    const elderly1 = await pb.collection('users').create({
      email: 'elderly1@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
      name: '김영희',
      role: 'elderly',
      phone: '010-1234-5678',
      birthdate: '1950-05-15',
      address: '서울시 강남구'
    })
    users.push(elderly1)
    console.log('✅ Created elderly user: 김영희')

    // 어르신 사용자 2
    const elderly2 = await pb.collection('users').create({
      email: 'elderly2@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
      name: '박철수',
      role: 'elderly',
      phone: '010-2345-6789',
      birthdate: '1948-08-20',
      address: '서울시 송파구'
    })
    users.push(elderly2)
    console.log('✅ Created elderly user: 박철수')

    // 보호자 사용자 1
    const guardian1 = await pb.collection('users').create({
      email: 'guardian1@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
      name: '김민준',
      role: 'guardian',
      phone: '010-3456-7890',
      address: '서울시 강남구'
    })
    users.push(guardian1)
    console.log('✅ Created guardian user: 김민준')

    // 보호자 사용자 2
    const guardian2 = await pb.collection('users').create({
      email: 'guardian2@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
      name: '이서연',
      role: 'guardian',
      phone: '010-4567-8901',
      address: '서울시 송파구'
    })
    users.push(guardian2)
    console.log('✅ Created guardian user: 이서연')

    // 어르신과 보호자 연결
    await pb.collection('users').update(elderly1.id, {
      guardians: [guardian1.id]
    })
    console.log('✅ Linked 김영희 with guardian 김민준')

    await pb.collection('users').update(elderly2.id, {
      guardians: [guardian2.id]
    })
    console.log('✅ Linked 박철수 with guardian 이서연')

    return users
  } catch (error) {
    console.error('❌ Error creating users:', error)
    throw error
  }
}

async function createProducts() {
  console.log('\n📦 Creating products...')

  const products = [
    {
      barcode: '8801234567890',
      name: '서울우유',
      brand: '서울우유',
      category: 'food',
      description: '신선한 목장에서 생산한 우유',
      allergens: ['우유'],
      expiry_date: '2025-12-31',
      warnings: '냉장보관 필요'
    },
    {
      barcode: '8802345678901',
      name: '타이레놀',
      brand: '존슨앤존슨',
      category: 'medicine',
      description: '해열진통제',
      warnings: '1일 3회, 1회 2정 복용. 식후 30분'
    },
    {
      barcode: '8803456789012',
      name: '신라면',
      brand: '농심',
      category: 'food',
      description: '매콤한 한국의 대표 라면',
      allergens: ['밀', '대두', '우유'],
      warnings: '끓는 물 주의'
    },
    {
      barcode: '8804567890123',
      name: '오메가3',
      brand: 'GNC',
      category: 'medicine',
      description: '혈행 개선 건강기능식품',
      warnings: '1일 1회, 1회 1캡슐'
    },
    {
      barcode: '8805678901234',
      name: '생수 2L',
      brand: '제주삼다수',
      category: 'food',
      description: '제주 화산암반수',
      expiry_date: '2026-12-31'
    },
    {
      barcode: '8806789012345',
      name: '로션',
      brand: '아모레퍼시픽',
      category: 'cosmetic',
      description: '보습 로션',
      warnings: '눈에 들어가지 않도록 주의'
    },
    {
      barcode: '8807890123456',
      name: '김치',
      brand: '종가집',
      category: 'food',
      description: '전통 발효 김치',
      allergens: ['새우젓'],
      expiry_date: '2025-06-30',
      warnings: '냉장보관'
    },
    {
      barcode: '8808901234567',
      name: '고혈압약',
      brand: '한미약품',
      category: 'medicine',
      description: '혈압 조절제',
      warnings: '의사 처방 필요. 1일 1회 복용'
    },
    {
      barcode: '8809012345678',
      name: '참치캔',
      brand: '동원',
      category: 'food',
      description: '참치 살코기 통조림',
      expiry_date: '2026-12-31'
    },
    {
      barcode: '8800123456789',
      name: '비타민C',
      brand: '한미양행',
      category: 'medicine',
      description: '면역력 강화 비타민',
      warnings: '1일 1회, 1회 1정'
    }
  ]

  const createdProducts = []

  for (const product of products) {
    try {
      const created = await pb.collection('products').create(product)
      createdProducts.push(created)
      console.log(`✅ Created product: ${product.name}`)
    } catch (error) {
      console.error(`❌ Error creating product ${product.name}:`, error)
    }
  }

  return createdProducts
}

async function createScanHistory(users: any[], products: any[]) {
  console.log('\n🔍 Creating scan history...')

  const elderly1 = users[0]
  const elderly2 = users[1]

  const scanHistory = [
    {
      user: elderly1.id,
      product: products[0].id,
      barcode: products[0].barcode,
      scan_type: 'barcode',
      tts_played: true
    },
    {
      user: elderly1.id,
      product: products[1].id,
      barcode: products[1].barcode,
      scan_type: 'barcode',
      tts_played: true
    },
    {
      user: elderly1.id,
      product: products[2].id,
      barcode: products[2].barcode,
      scan_type: 'barcode',
      tts_played: true
    },
    {
      user: elderly2.id,
      product: products[3].id,
      barcode: products[3].barcode,
      scan_type: 'barcode',
      tts_played: true
    },
    {
      user: elderly2.id,
      product: products[4].id,
      barcode: products[4].barcode,
      scan_type: 'barcode',
      tts_played: false
    }
  ]

  for (const scan of scanHistory) {
    try {
      await pb.collection('scan_history').create(scan)
      console.log(`✅ Created scan record for user ${scan.user}`)
    } catch (error) {
      console.error(`❌ Error creating scan history:`, error)
    }
  }
}

async function createVoicePhishingLogs(users: any[]) {
  console.log('\n⚠️  Creating voice phishing logs...')

  const elderly1 = users[0]
  const elderly2 = users[1]

  const logs = [
    {
      user: elderly1.id,
      transcript: '안녕하세요, 경찰청입니다. 고객님의 계좌가 보이스피싱에 연루되어 있습니다. 즉시 계좌번호를 알려주셔야 합니다.',
      risk_level: 'high',
      detected_patterns: ['경찰청', '계좌', '즉시', '보이스피싱'],
      caller_info: { number: '02-1234-5678', name: '경찰청' },
      duration: 120,
      guardian_notified: true,
      is_blocked: true,
      user_action: 'reported'
    },
    {
      user: elderly1.id,
      transcript: '고객님, 은행 대출 상담원입니다. 낮은 금리로 대출이 가능합니다.',
      risk_level: 'medium',
      detected_patterns: ['대출', '낮은 금리'],
      caller_info: { number: '02-2345-6789' },
      duration: 60,
      guardian_notified: true,
      is_blocked: false,
      user_action: 'ignored'
    },
    {
      user: elderly2.id,
      transcript: '안녕하세요, 건강검진 안내 전화입니다.',
      risk_level: 'low',
      detected_patterns: [],
      caller_info: { number: '02-3456-7890' },
      duration: 30,
      guardian_notified: false,
      is_blocked: false,
      user_action: 'none'
    }
  ]

  for (const log of logs) {
    try {
      await pb.collection('voice_phishing_logs').create(log)
      console.log(`✅ Created voice phishing log with risk level: ${log.risk_level}`)
    } catch (error) {
      console.error(`❌ Error creating voice phishing log:`, error)
    }
  }
}

async function createKioskSessions(users: any[]) {
  console.log('\n🖥️  Creating kiosk sessions...')

  const elderly1 = users[0]
  const elderly2 = users[1]

  const sessions = [
    {
      user: elderly1.id,
      kiosk_type: 'fastfood',
      location: '맥도날드 강남점',
      steps_completed: ['메뉴 선택', '결제 진행', '주문 완료'],
      duration: 180,
      success: true,
      help_requested: true
    },
    {
      user: elderly2.id,
      kiosk_type: 'ticket',
      location: '영화관',
      steps_completed: ['영화 선택', '좌석 선택'],
      duration: 120,
      success: false,
      help_requested: true
    }
  ]

  for (const session of sessions) {
    try {
      await pb.collection('kiosk_sessions').create(session)
      console.log(`✅ Created kiosk session: ${session.kiosk_type}`)
    } catch (error) {
      console.error(`❌ Error creating kiosk session:`, error)
    }
  }
}

async function createEmergencyContacts(users: any[]) {
  console.log('\n📞 Creating emergency contacts...')

  const elderly1 = users[0]
  const elderly2 = users[1]
  const guardian1 = users[2]
  const guardian2 = users[3]

  const contacts = [
    {
      user: elderly1.id,
      name: guardian1.name,
      relationship: '아들',
      phone: guardian1.phone,
      email: 'guardian1@example.com',
      priority: 1,
      is_primary: true
    },
    {
      user: elderly1.id,
      name: '119',
      relationship: '응급',
      phone: '119',
      priority: 2,
      is_primary: false
    },
    {
      user: elderly2.id,
      name: guardian2.name,
      relationship: '딸',
      phone: guardian2.phone,
      email: 'guardian2@example.com',
      priority: 1,
      is_primary: true
    },
    {
      user: elderly2.id,
      name: '112',
      relationship: '경찰',
      phone: '112',
      priority: 2,
      is_primary: false
    }
  ]

  for (const contact of contacts) {
    try {
      await pb.collection('emergency_contacts').create(contact)
      console.log(`✅ Created emergency contact: ${contact.name}`)
    } catch (error) {
      console.error(`❌ Error creating emergency contact:`, error)
    }
  }
}

async function createDailyActivities(users: any[]) {
  console.log('\n📊 Creating daily activities...')

  const elderly1 = users[0]
  const elderly2 = users[1]

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  const activities = [
    {
      user: elderly1.id,
      date: today,
      barcode_scans: 3,
      kiosk_uses: 1,
      voice_phishing_detections: 2,
      active_time: 120,
      health_score: 85,
      summary: '오늘 활발한 활동을 하셨습니다. 보이스피싱 전화 2건 감지.'
    },
    {
      user: elderly1.id,
      date: yesterday,
      barcode_scans: 2,
      kiosk_uses: 0,
      voice_phishing_detections: 1,
      active_time: 60,
      health_score: 80,
      summary: '어제 정상적인 활동 패턴.'
    },
    {
      user: elderly2.id,
      date: today,
      barcode_scans: 2,
      kiosk_uses: 1,
      voice_phishing_detections: 1,
      active_time: 90,
      health_score: 75,
      summary: '키오스크 사용 중 도움 요청.'
    }
  ]

  for (const activity of activities) {
    try {
      await pb.collection('daily_activities').create(activity)
      console.log(`✅ Created daily activity for date: ${activity.date}`)
    } catch (error) {
      console.error(`❌ Error creating daily activity:`, error)
    }
  }
}

async function createGuardianNotifications(users: any[]) {
  console.log('\n🔔 Creating guardian notifications...')

  const elderly1 = users[0]
  const elderly2 = users[1]
  const guardian1 = users[2]
  const guardian2 = users[3]

  const notifications = [
    {
      guardian: guardian1.id,
      elderly_user: elderly1.id,
      notification_type: 'voice_phishing',
      title: '⚠️ 보이스피싱 의심 전화 감지',
      message: '김영희님께서 받은 전화에서 고위험 보이스피싱 패턴이 감지되었습니다. 즉시 확인이 필요합니다.',
      priority: 'urgent',
      is_read: false
    },
    {
      guardian: guardian1.id,
      elderly_user: elderly1.id,
      notification_type: 'unusual_activity',
      title: '키오스크 사용 중 도움 요청',
      message: '김영희님께서 패스트푸드점 키오스크 사용 중 도움을 요청하셨습니다.',
      priority: 'medium',
      is_read: true
    },
    {
      guardian: guardian2.id,
      elderly_user: elderly2.id,
      notification_type: 'daily_summary',
      title: '📊 일일 활동 요약',
      message: '박철수님의 오늘 활동: 바코드 스캔 2회, 키오스크 사용 1회',
      priority: 'low',
      is_read: false
    }
  ]

  for (const notification of notifications) {
    try {
      await pb.collection('guardian_notifications').create(notification)
      console.log(`✅ Created notification: ${notification.title}`)
    } catch (error) {
      console.error(`❌ Error creating notification:`, error)
    }
  }
}

async function main() {
  console.log('🚀 Starting PocketBase data seeding...\n')
  console.log(`📍 PocketBase URL: ${pb.baseUrl}`)

  try {
    // Admin 인증
    await authenticateAdmin()

    // 데이터 생성
    const users = await createUsers()
    const products = await createProducts()
    await createScanHistory(users, products)
    await createVoicePhishingLogs(users)
    await createKioskSessions(users)
    await createEmergencyContacts(users)
    await createDailyActivities(users)
    await createGuardianNotifications(users)

    console.log('\n✨ All sample data created successfully!')
    console.log('\n📋 Test Accounts:')
    console.log('   Elderly 1: elderly1@example.com / password123')
    console.log('   Elderly 2: elderly2@example.com / password123')
    console.log('   Guardian 1: guardian1@example.com / password123')
    console.log('   Guardian 2: guardian2@example.com / password123')

  } catch (error) {
    console.error('\n💥 Error during seeding:', error)
    process.exit(1)
  }
}

// 스크립트 실행
main()
