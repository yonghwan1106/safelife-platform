// Core Types for SafeLife Platform

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'elderly' | 'guardian'
  guardianId?: string
  created: string
  updated: string
}

export interface BarcodeData {
  code: string
  productName: string
  manufacturer: string
  ingredients: string[]
  allergens: string[]
  nutritionFacts?: {
    calories: number
    protein: number
    fat: number
    carbs: number
  }
  warnings: string[]
}

export interface VoicePhishingAlert {
  id: string
  userId: string
  timestamp: string
  riskLevel: 'low' | 'medium' | 'high'
  detectedPatterns: string[]
  transcription: string
  callerNumber?: string
  guardianNotified: boolean
}

export interface KioskSession {
  id: string
  userId: string
  timestamp: string
  location: string
  kioskType: string
  assistanceProvided: string[]
  completedSuccessfully: boolean
}

export interface GuardianAlert {
  id: string
  guardianId: string
  elderlyId: string
  type: 'voice_phishing' | 'unusual_activity' | 'emergency'
  severity: 'low' | 'medium' | 'high'
  message: string
  timestamp: string
  acknowledged: boolean
}

export interface ActivityLog {
  id: string
  userId: string
  activityType: 'barcode_scan' | 'kiosk_help' | 'voice_alert'
  timestamp: string
  details: Record<string, any>
}
