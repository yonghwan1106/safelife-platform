import PocketBase from 'pocketbase'

// PocketBase 클라이언트 초기화
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090')

// 자동 취소 비활성화 (SSR 환경에서 문제 방지)
pb.autoCancellation(false)

// 타입 정의
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'elderly' | 'guardian'
  phone?: string
  birthdate?: string
  address?: string
  guardians?: string[]
  created: string
  updated: string
}

export interface Product {
  id: string
  barcode: string
  name: string
  brand?: string
  category: 'food' | 'medicine' | 'cosmetic' | 'other'
  description?: string
  ingredients?: any
  allergens?: string[]
  expiry_date?: string
  warnings?: string
  image?: string
  created: string
  updated: string
}

export interface ScanHistory {
  id: string
  user: string
  product: string
  barcode: string
  scan_type: 'barcode' | 'ocr' | 'manual'
  location?: string
  tts_played: boolean
  created: string
  updated: string
}

export interface VoicePhishingLog {
  id: string
  user: string
  transcript: string
  risk_level: 'low' | 'medium' | 'high'
  detected_patterns: string[]
  caller_info?: any
  duration?: number
  guardian_notified: boolean
  is_blocked: boolean
  user_action: 'none' | 'reported' | 'blocked' | 'ignored'
  created: string
  updated: string
}

export interface KioskSession {
  id: string
  user: string
  kiosk_type: 'fastfood' | 'cafe' | 'ticket' | 'payment' | 'other'
  location?: string
  screenshot?: string[]
  steps_completed?: any
  duration?: number
  success: boolean
  help_requested: boolean
  created: string
  updated: string
}

export interface GuardianNotification {
  id: string
  guardian: string
  elderly_user: string
  notification_type: 'voice_phishing' | 'unusual_activity' | 'emergency' | 'daily_summary'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  related_log?: string
  is_read: boolean
  read_at?: string
  created: string
  updated: string
}

export interface EmergencyContact {
  id: string
  user: string
  name: string
  relationship?: string
  phone: string
  email?: string
  priority?: number
  is_primary: boolean
  created: string
  updated: string
}

export interface DailyActivity {
  id: string
  user: string
  date: string
  barcode_scans: number
  kiosk_uses: number
  voice_phishing_detections: number
  active_time: number
  health_score: number
  summary?: string
  created: string
  updated: string
}

// 인증 관련 함수
export const auth = {
  // 회원가입
  async signUp(email: string, password: string, name: string, role: 'elderly' | 'guardian') {
    try {
      const data = {
        email,
        password,
        passwordConfirm: password,
        name,
        role
      }
      return await pb.collection('users').create(data)
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  },

  // 로그인
  async signIn(email: string, password: string) {
    try {
      return await pb.collection('users').authWithPassword(email, password)
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  },

  // 로그아웃
  logout() {
    pb.authStore.clear()
  },

  // 현재 사용자
  getCurrentUser() {
    return pb.authStore.model as User | null
  },

  // 인증 상태 확인
  isAuthenticated() {
    return pb.authStore.isValid
  }
}

// Products API
export const productsApi = {
  // 바코드로 상품 조회
  async getByBarcode(barcode: string): Promise<Product | null> {
    try {
      const records = await pb.collection('products').getList<Product>(1, 1, {
        filter: `barcode="${barcode}"`
      })
      return records.items[0] || null
    } catch (error) {
      console.error('Get product by barcode error:', error)
      return null
    }
  },

  // 상품 목록 조회
  async list(page = 1, perPage = 30, filter?: string): Promise<Product[]> {
    try {
      const records = await pb.collection('products').getList<Product>(page, perPage, {
        filter,
        sort: '-created'
      })
      return records.items
    } catch (error) {
      console.error('List products error:', error)
      return []
    }
  },

  // 상품 생성 (Admin only)
  async create(data: Partial<Product>): Promise<Product | null> {
    try {
      return await pb.collection('products').create<Product>(data)
    } catch (error) {
      console.error('Create product error:', error)
      return null
    }
  }
}

// Scan History API
export const scanHistoryApi = {
  // 스캔 기록 생성
  async create(data: {
    product: string
    barcode: string
    scan_type: 'barcode' | 'ocr' | 'manual'
    location?: string
    tts_played: boolean
  }): Promise<ScanHistory | null> {
    try {
      const user = auth.getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      return await pb.collection('scan_history').create<ScanHistory>({
        ...data,
        user: user.id
      })
    } catch (error) {
      console.error('Create scan history error:', error)
      return null
    }
  },

  // 사용자 스캔 이력 조회
  async listByUser(userId: string, page = 1, perPage = 30): Promise<ScanHistory[]> {
    try {
      const records = await pb.collection('scan_history').getList<ScanHistory>(page, perPage, {
        filter: `user="${userId}"`,
        sort: '-created',
        expand: 'product'
      })
      return records.items
    } catch (error) {
      console.error('List scan history error:', error)
      return []
    }
  }
}

// Voice Phishing Logs API
export const voicePhishingApi = {
  // 보이스피싱 로그 생성
  async create(data: {
    transcript: string
    risk_level: 'low' | 'medium' | 'high'
    detected_patterns: string[]
    caller_info?: any
    duration?: number
  }): Promise<VoicePhishingLog | null> {
    try {
      const user = auth.getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      const log = await pb.collection('voice_phishing_logs').create<VoicePhishingLog>({
        ...data,
        user: user.id,
        guardian_notified: false,
        is_blocked: false,
        user_action: 'none'
      })

      // 위험도가 medium 이상이면 보호자에게 알림
      if (data.risk_level === 'medium' || data.risk_level === 'high') {
        await this.notifyGuardians(log)
      }

      return log
    } catch (error) {
      console.error('Create voice phishing log error:', error)
      return null
    }
  },

  // 보호자에게 알림
  async notifyGuardians(log: VoicePhishingLog): Promise<void> {
    try {
      const user = auth.getCurrentUser()
      if (!user || !user.guardians) return

      const priority = log.risk_level === 'high' ? 'urgent' : 'high'

      for (const guardianId of user.guardians) {
        await pb.collection('guardian_notifications').create({
          guardian: guardianId,
          elderly_user: user.id,
          notification_type: 'voice_phishing',
          title: '보이스피싱 의심 전화 감지',
          message: `위험도: ${log.risk_level}\n감지된 패턴: ${log.detected_patterns.join(', ')}`,
          priority,
          related_log: log.id,
          is_read: false
        })
      }

      // 로그 업데이트
      await pb.collection('voice_phishing_logs').update(log.id, {
        guardian_notified: true
      })
    } catch (error) {
      console.error('Notify guardians error:', error)
    }
  },

  // 사용자 로그 조회
  async listByUser(userId: string, page = 1, perPage = 30): Promise<VoicePhishingLog[]> {
    try {
      const records = await pb.collection('voice_phishing_logs').getList<VoicePhishingLog>(page, perPage, {
        filter: `user="${userId}"`,
        sort: '-created'
      })
      return records.items
    } catch (error) {
      console.error('List voice phishing logs error:', error)
      return []
    }
  },

  // 로그 업데이트 (사용자 조치)
  async updateAction(logId: string, action: 'reported' | 'blocked' | 'ignored'): Promise<boolean> {
    try {
      await pb.collection('voice_phishing_logs').update(logId, {
        user_action: action
      })
      return true
    } catch (error) {
      console.error('Update voice phishing log error:', error)
      return false
    }
  }
}

// Kiosk Sessions API
export const kioskApi = {
  // 키오스크 세션 생성
  async create(data: {
    kiosk_type: 'fastfood' | 'cafe' | 'ticket' | 'payment' | 'other'
    location?: string
  }): Promise<KioskSession | null> {
    try {
      const user = auth.getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      return await pb.collection('kiosk_sessions').create<KioskSession>({
        ...data,
        user: user.id,
        steps_completed: [],
        success: false,
        help_requested: false
      })
    } catch (error) {
      console.error('Create kiosk session error:', error)
      return null
    }
  },

  // 세션 업데이트
  async update(sessionId: string, data: Partial<KioskSession>): Promise<boolean> {
    try {
      await pb.collection('kiosk_sessions').update(sessionId, data)
      return true
    } catch (error) {
      console.error('Update kiosk session error:', error)
      return false
    }
  },

  // 사용자 세션 조회
  async listByUser(userId: string, page = 1, perPage = 30): Promise<KioskSession[]> {
    try {
      const records = await pb.collection('kiosk_sessions').getList<KioskSession>(page, perPage, {
        filter: `user="${userId}"`,
        sort: '-created'
      })
      return records.items
    } catch (error) {
      console.error('List kiosk sessions error:', error)
      return []
    }
  }
}

// Guardian Notifications API
export const notificationsApi = {
  // 보호자 알림 조회
  async listByGuardian(guardianId: string, page = 1, perPage = 30, unreadOnly = false): Promise<GuardianNotification[]> {
    try {
      const filter = unreadOnly
        ? `guardian="${guardianId}" && is_read=false`
        : `guardian="${guardianId}"`

      const records = await pb.collection('guardian_notifications').getList<GuardianNotification>(page, perPage, {
        filter,
        sort: '-created',
        expand: 'elderly_user'
      })
      return records.items
    } catch (error) {
      console.error('List notifications error:', error)
      return []
    }
  },

  // 알림 읽음 처리
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      await pb.collection('guardian_notifications').update(notificationId, {
        is_read: true,
        read_at: new Date().toISOString()
      })
      return true
    } catch (error) {
      console.error('Mark notification as read error:', error)
      return false
    }
  },

  // 읽지 않은 알림 개수
  async getUnreadCount(guardianId: string): Promise<number> {
    try {
      const records = await pb.collection('guardian_notifications').getList(1, 1, {
        filter: `guardian="${guardianId}" && is_read=false`
      })
      return records.totalItems
    } catch (error) {
      console.error('Get unread count error:', error)
      return 0
    }
  }
}

// Emergency Contacts API
export const emergencyContactsApi = {
  // 연락처 생성
  async create(data: {
    name: string
    relationship?: string
    phone: string
    email?: string
    priority?: number
    is_primary: boolean
  }): Promise<EmergencyContact | null> {
    try {
      const user = auth.getCurrentUser()
      if (!user) throw new Error('Not authenticated')

      return await pb.collection('emergency_contacts').create<EmergencyContact>({
        ...data,
        user: user.id
      })
    } catch (error) {
      console.error('Create emergency contact error:', error)
      return null
    }
  },

  // 사용자 연락처 조회
  async listByUser(userId: string): Promise<EmergencyContact[]> {
    try {
      const records = await pb.collection('emergency_contacts').getList<EmergencyContact>(1, 100, {
        filter: `user="${userId}"`,
        sort: 'priority'
      })
      return records.items
    } catch (error) {
      console.error('List emergency contacts error:', error)
      return []
    }
  },

  // 연락처 업데이트
  async update(contactId: string, data: Partial<EmergencyContact>): Promise<boolean> {
    try {
      await pb.collection('emergency_contacts').update(contactId, data)
      return true
    } catch (error) {
      console.error('Update emergency contact error:', error)
      return false
    }
  },

  // 연락처 삭제
  async delete(contactId: string): Promise<boolean> {
    try {
      await pb.collection('emergency_contacts').delete(contactId)
      return true
    } catch (error) {
      console.error('Delete emergency contact error:', error)
      return false
    }
  }
}

// Daily Activities API
export const dailyActivitiesApi = {
  // 일일 활동 조회
  async getByDate(userId: string, date: string): Promise<DailyActivity | null> {
    try {
      const records = await pb.collection('daily_activities').getList<DailyActivity>(1, 1, {
        filter: `user="${userId}" && date="${date}"`
      })
      return records.items[0] || null
    } catch (error) {
      console.error('Get daily activity error:', error)
      return null
    }
  },

  // 일일 활동 생성 또는 업데이트
  async upsert(userId: string, date: string, data: Partial<DailyActivity>): Promise<DailyActivity | null> {
    try {
      const existing = await this.getByDate(userId, date)

      if (existing) {
        return await pb.collection('daily_activities').update<DailyActivity>(existing.id, data)
      } else {
        return await pb.collection('daily_activities').create<DailyActivity>({
          ...data,
          user: userId,
          date
        })
      }
    } catch (error) {
      console.error('Upsert daily activity error:', error)
      return null
    }
  },

  // 기간별 활동 조회
  async listByDateRange(userId: string, startDate: string, endDate: string): Promise<DailyActivity[]> {
    try {
      const records = await pb.collection('daily_activities').getList<DailyActivity>(1, 365, {
        filter: `user="${userId}" && date>="${startDate}" && date<="${endDate}"`,
        sort: '-date'
      })
      return records.items
    } catch (error) {
      console.error('List daily activities error:', error)
      return []
    }
  }
}

// 실시간 구독
export const subscriptions = {
  // 보호자 알림 구독
  subscribeToNotifications(guardianId: string, callback: (data: GuardianNotification) => void) {
    pb.collection('guardian_notifications').subscribe<GuardianNotification>('*', (e) => {
      if (e.record.guardian === guardianId) {
        callback(e.record)
      }
    })
  },

  // 구독 해제
  unsubscribe(collection: string) {
    pb.collection(collection).unsubscribe()
  },

  // 모든 구독 해제
  unsubscribeAll() {
    // PocketBase SDK는 개별 구독 해제만 지원
    // 필요시 개별 컬렉션별로 unsubscribe 호출
  }
}

export { pb }
export default pb
