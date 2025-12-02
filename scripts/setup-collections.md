# PocketBase Collections Setup Guide

이 가이드는 SafeLife 플랫폼을 위한 PocketBase 컬렉션을 수동으로 생성하는 방법을 안내합니다.

## 접속 방법

1. PocketBase Admin 패널 접속: https://ai-life-solution-challenge.duckdns.org/_/
2. Admin 계정으로 로그인

---

## Collection 1: users (Auth Collection)

**Type**: Auth Collection

### Settings
- Collection name: `users`
- Auth Options:
  - ✅ Enable email/password authentication
  - ✅ Require email verification: OFF (for demo)
  - ✅ Allow username: OFF

### Additional Fields

| Field Name | Type | Options |
|------------|------|---------|
| `role` | Select | Options: `elderly`, `guardian` (required) |
| `phone` | Text | - |
| `birthdate` | Date | - |
| `address` | Text | - |
| `guardians` | Relation | Collection: `users`, Multiple: ✅ |

### API Rules
- **List/View**: `@request.auth.id != ""` (Authenticated)
- **Create**: Anyone (회원가입)
- **Update**: `@request.auth.id = id` (Owner only)
- **Delete**: `@request.auth.id = id` (Owner only)

---

## Collection 2: products

**Type**: Base Collection

### Fields

| Field Name | Type | Options |
|------------|------|---------|
| `barcode` | Text | Required, Unique, Min: 8, Max: 20 |
| `name` | Text | Required, Max: 200 |
| `brand` | Text | Max: 100 |
| `category` | Select | Options: `food`, `medicine`, `cosmetic`, `other` |
| `description` | Editor | - |
| `ingredients` | JSON | - |
| `allergens` | JSON | - |
| `expiry_date` | Date | - |
| `warnings` | Editor | - |
| `image` | File | Max Size: 5MB, Types: image/* |

### API Rules
- **List/View**: Anyone (공개)
- **Create**: Admin only
- **Update**: Admin only
- **Delete**: Admin only

---

## Collection 3: scan_history

**Type**: Base Collection

### Fields

| Field Name | Type | Options |
|------------|------|---------|
| `user` | Relation | Collection: `users`, Required |
| `product` | Relation | Collection: `products`, Required |
| `barcode` | Text | Required, Max: 20 |
| `scan_type` | Select | Options: `barcode`, `ocr`, `manual`, Required |
| `location` | Text | - |
| `tts_played` | Bool | Default: false |

### API Rules
- **List/View**: `@request.auth.id = user.id || @request.auth.id ?= user.guardians.id`
- **Create**: `@request.auth.id != ""`
- **Update**: `@request.auth.id = user.id`
- **Delete**: `@request.auth.id = user.id`

---

## Collection 4: voice_phishing_logs

**Type**: Base Collection

### Fields

| Field Name | Type | Options |
|------------|------|---------|
| `user` | Relation | Collection: `users`, Required |
| `transcript` | Editor | Required |
| `risk_level` | Select | Options: `low`, `medium`, `high`, Required |
| `detected_patterns` | JSON | - |
| `caller_info` | JSON | - |
| `duration` | Number | Min: 0 |
| `guardian_notified` | Bool | Default: false |
| `is_blocked` | Bool | Default: false |
| `user_action` | Select | Options: `none`, `reported`, `blocked`, `ignored`, Default: `none` |

### API Rules
- **List/View**: `@request.auth.id = user.id || @request.auth.id ?= user.guardians.id`
- **Create**: `@request.auth.id != ""`
- **Update**: `@request.auth.id = user.id || @request.auth.id ?= user.guardians.id`
- **Delete**: `@request.auth.id = user.id`

---

## Collection 5: kiosk_sessions

**Type**: Base Collection

### Fields

| Field Name | Type | Options |
|------------|------|---------|
| `user` | Relation | Collection: `users`, Required |
| `kiosk_type` | Select | Options: `fastfood`, `cafe`, `ticket`, `payment`, `other`, Required |
| `location` | Text | - |
| `screenshot` | File | Max Size: 5MB, Types: image/*, Multiple: ✅ |
| `steps_completed` | JSON | - |
| `duration` | Number | Min: 0 |
| `success` | Bool | Default: false |
| `help_requested` | Bool | Default: false |

### API Rules
- **List/View**: `@request.auth.id = user.id || @request.auth.id ?= user.guardians.id`
- **Create**: `@request.auth.id != ""`
- **Update**: `@request.auth.id = user.id`
- **Delete**: `@request.auth.id = user.id`

---

## Collection 6: guardian_notifications

**Type**: Base Collection

### Fields

| Field Name | Type | Options |
|------------|------|---------|
| `guardian` | Relation | Collection: `users`, Required |
| `elderly_user` | Relation | Collection: `users`, Required |
| `notification_type` | Select | Options: `voice_phishing`, `unusual_activity`, `emergency`, `daily_summary`, Required |
| `title` | Text | Required, Max: 200 |
| `message` | Editor | Required |
| `priority` | Select | Options: `low`, `medium`, `high`, `urgent`, Default: `medium` |
| `related_log` | Relation | Collection: `voice_phishing_logs` |
| `is_read` | Bool | Default: false |
| `read_at` | Date | - |

### API Rules
- **List/View**: `@request.auth.id = guardian.id`
- **Create**: `@request.auth.id != ""`
- **Update**: `@request.auth.id = guardian.id`
- **Delete**: `@request.auth.id = guardian.id`

---

## Collection 7: emergency_contacts

**Type**: Base Collection

### Fields

| Field Name | Type | Options |
|------------|------|---------|
| `user` | Relation | Collection: `users`, Required |
| `name` | Text | Required, Max: 100 |
| `relationship` | Text | Max: 50 |
| `phone` | Text | Required, Max: 20 |
| `email` | Email | - |
| `priority` | Number | Min: 1, Max: 10, Default: 5 |
| `is_primary` | Bool | Default: false |

### API Rules
- **List/View**: `@request.auth.id = user.id || @request.auth.id ?= user.guardians.id`
- **Create**: `@request.auth.id != ""`
- **Update**: `@request.auth.id = user.id`
- **Delete**: `@request.auth.id = user.id`

---

## Collection 8: daily_activities

**Type**: Base Collection

### Fields

| Field Name | Type | Options |
|------------|------|---------|
| `user` | Relation | Collection: `users`, Required |
| `date` | Date | Required |
| `barcode_scans` | Number | Min: 0, Default: 0 |
| `kiosk_uses` | Number | Min: 0, Default: 0 |
| `voice_phishing_detections` | Number | Min: 0, Default: 0 |
| `active_time` | Number | Min: 0, Default: 0 |
| `health_score` | Number | Min: 0, Max: 100, Default: 70 |
| `summary` | Editor | - |

### API Rules
- **List/View**: `@request.auth.id = user.id || @request.auth.id ?= user.guardians.id`
- **Create**: `@request.auth.id != ""`
- **Update**: `@request.auth.id != ""`
- **Delete**: `@request.auth.id = user.id`

---

## 생성 순서

1. ✅ **users** (Auth Collection) - 다른 컬렉션이 참조하므로 가장 먼저 생성
2. ✅ **products** - scan_history가 참조
3. ✅ **scan_history**
4. ✅ **voice_phishing_logs** - guardian_notifications가 참조
5. ✅ **guardian_notifications**
6. ✅ **kiosk_sessions**
7. ✅ **emergency_contacts**
8. ✅ **daily_activities**

---

## 다음 단계

컬렉션 생성 후:
1. `npm run seed` - 샘플 데이터 생성
2. 프론트엔드에서 API 연동 테스트
3. 권한 설정 확인

---

## 주의사항

- Relation 필드 생성 시 참조할 컬렉션이 먼저 존재해야 합니다
- API Rules 설정 시 `@request.auth.id`를 사용하여 인증된 사용자만 접근 가능하도록 설정
- `?=` 연산자는 배열에 값이 포함되어 있는지 확인 (guardians 같은 multiple relation)
