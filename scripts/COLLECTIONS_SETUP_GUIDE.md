# PocketBase 컬렉션 설정 가이드

## 빠른 시작 (권장)

### 1단계: Admin 대시보드 접속
https://ai-life-solution-challenge.duckdns.org/_/

**로그인 정보:**
- Email: `sanoramyun8@gmail.com`
- Password: `T22qjsrlf67!`

---

### 2단계: users 컬렉션에 필드 추가

기본 users 컬렉션이 이미 존재하므로, 추가 필드를 수동으로 추가해야 합니다.

1. 왼쪽 메뉴에서 **Collections** 클릭
2. **users** 컬렉션 클릭
3. **Edit collection** 버튼 클릭
4. **Fields** 탭에서 다음 필드들을 추가:

#### 추가할 필드:

| Field Name | Type | Options |
|------------|------|---------|
| `role` | Select | Options: `elderly`, `guardian` <br> Required: ✅ |
| `phone` | Text | Max: 20 |
| `birthdate` | Date | - |
| `address` | Text | Max: 200 |
| `guardians` | Relation | Collection: `users` <br> Multiple: ✅ <br> Display fields: `name` |

5. **Save changes** 클릭

---

### 3단계: 나머지 컬렉션 생성 (각각 수동 생성)

PocketBase는 현재 버전에서 JSON Import 기능이 제한적이므로, 각 컬렉션을 수동으로 생성해야 합니다.

#### 📦 Collection 1: products

**Settings:**
- Name: `products`
- Type: `Base`

**Fields:**

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `barcode` | Text | ✅ | Min: 8, Max: 20 |
| `name` | Text | ✅ | Max: 200 |
| `brand` | Text | ❌ | Max: 100 |
| `category` | Select | ❌ | Values: `food`, `medicine`, `cosmetic`, `other` |
| `description` | Editor | ❌ | - |
| `ingredients` | JSON | ❌ | - |
| `allergens` | JSON | ❌ | - |
| `expiry_date` | Date | ❌ | - |
| `warnings` | Editor | ❌ | - |
| `image` | File | ❌ | Max size: 5MB, Types: `image/jpeg`, `image/png`, `image/webp` |

**Indexes:**
```
CREATE UNIQUE INDEX idx_barcode ON products (barcode)
```

**API Rules:**
- List: `""` (공개)
- View: `""` (공개)
- Create: `null` (Admin only)
- Update: `null` (Admin only)
- Delete: `null` (Admin only)

---

#### 📊 Collection 2: scan_history

**Settings:**
- Name: `scan_history`
- Type: `Base`

**Fields:**

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `user` | Relation | ✅ | Collection: `users`, Max: 1, Display: `name` |
| `product` | Relation | ✅ | Collection: `products`, Max: 1, Display: `name` |
| `barcode` | Text | ✅ | Max: 20 |
| `scan_type` | Select | ✅ | Values: `barcode`, `ocr`, `manual` |
| `location` | Text | ❌ | - |
| `tts_played` | Bool | ❌ | - |

**API Rules:**
- List: `@request.auth.id = user.id || @request.auth.id ?= user.guardians.id`
- View: `@request.auth.id = user.id || @request.auth.id ?= user.guardians.id`
- Create: `@request.auth.id != ""`
- Update: `@request.auth.id = user.id`
- Delete: `@request.auth.id = user.id`

---

#### ⚠️ Collection 3: voice_phishing_logs

**Settings:**
- Name: `voice_phishing_logs`
- Type: `Base`

**Fields:**

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `user` | Relation | ✅ | Collection: `users`, Max: 1, Display: `name` |
| `transcript` | Editor | ✅ | - |
| `risk_level` | Select | ✅ | Values: `low`, `medium`, `high` |
| `detected_patterns` | JSON | ❌ | - |
| `caller_info` | JSON | ❌ | - |
| `duration` | Number | ❌ | Min: 0 |
| `guardian_notified` | Bool | ❌ | - |
| `is_blocked` | Bool | ❌ | - |
| `user_action` | Select | ❌ | Values: `none`, `reported`, `blocked`, `ignored` |

**API Rules:**
- List: `@request.auth.id = user.id || @request.auth.id ?= user.guardians.id`
- View: `@request.auth.id = user.id || @request.auth.id ?= user.guardians.id`
- Create: `@request.auth.id != ""`
- Update: `@request.auth.id = user.id || @request.auth.id ?= user.guardians.id`
- Delete: `@request.auth.id = user.id`

---

#### 🖥️ Collection 4: kiosk_sessions

**Settings:**
- Name: `kiosk_sessions`
- Type: `Base`

**Fields:**

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `user` | Relation | ✅ | Collection: `users`, Max: 1, Display: `name` |
| `kiosk_type` | Select | ✅ | Values: `fastfood`, `cafe`, `ticket`, `payment`, `other` |
| `location` | Text | ❌ | - |
| `screenshot` | File | ❌ | Max: 99, Max size: 5MB, Types: `image/*` |
| `steps_completed` | JSON | ❌ | - |
| `duration` | Number | ❌ | Min: 0 |
| `success` | Bool | ❌ | - |
| `help_requested` | Bool | ❌ | - |

**API Rules:**
- List: `@request.auth.id = user.id || @request.auth.id ?= user.guardians.id`
- View: `@request.auth.id = user.id || @request.auth.id ?= user.guardians.id`
- Create: `@request.auth.id != ""`
- Update: `@request.auth.id = user.id`
- Delete: `@request.auth.id = user.id`

---

#### 🔔 Collection 5: guardian_notifications

**Settings:**
- Name: `guardian_notifications`
- Type: `Base`

**Fields:**

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `guardian` | Relation | ✅ | Collection: `users`, Max: 1, Display: `name` |
| `elderly_user` | Relation | ✅ | Collection: `users`, Max: 1, Display: `name` |
| `notification_type` | Select | ✅ | Values: `voice_phishing`, `unusual_activity`, `emergency`, `daily_summary` |
| `title` | Text | ✅ | Max: 200 |
| `message` | Editor | ✅ | - |
| `priority` | Select | ❌ | Values: `low`, `medium`, `high`, `urgent` |
| `related_log` | Relation | ❌ | Collection: `voice_phishing_logs`, Max: 1 |
| `is_read` | Bool | ❌ | - |
| `read_at` | Date | ❌ | - |

**API Rules:**
- List: `@request.auth.id = guardian.id`
- View: `@request.auth.id = guardian.id`
- Create: `@request.auth.id != ""`
- Update: `@request.auth.id = guardian.id`
- Delete: `@request.auth.id = guardian.id`

---

#### 📞 Collection 6: emergency_contacts

**Settings:**
- Name: `emergency_contacts`
- Type: `Base`

**Fields:**

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `user` | Relation | ✅ | Collection: `users`, Max: 1, Display: `name` |
| `name` | Text | ✅ | Max: 100 |
| `relationship` | Text | ❌ | Max: 50 |
| `phone` | Text | ✅ | Max: 20 |
| `email` | Email | ❌ | - |
| `priority` | Number | ❌ | Min: 1, Max: 10, No decimal |
| `is_primary` | Bool | ❌ | - |

**API Rules:**
- List: `@request.auth.id = user.id || @request.auth.id ?= user.guardians.id`
- View: `@request.auth.id = user.id || @request.auth.id ?= user.guardians.id`
- Create: `@request.auth.id != ""`
- Update: `@request.auth.id = user.id`
- Delete: `@request.auth.id = user.id`

---

#### 📈 Collection 7: daily_activities

**Settings:**
- Name: `daily_activities`
- Type: `Base`

**Fields:**

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `user` | Relation | ✅ | Collection: `users`, Max: 1, Display: `name` |
| `date` | Date | ✅ | - |
| `barcode_scans` | Number | ❌ | Min: 0, No decimal |
| `kiosk_uses` | Number | ❌ | Min: 0, No decimal |
| `voice_phishing_detections` | Number | ❌ | Min: 0, No decimal |
| `active_time` | Number | ❌ | Min: 0, No decimal |
| `health_score` | Number | ❌ | Min: 0, Max: 100, No decimal |
| `summary` | Editor | ❌ | - |

**API Rules:**
- List: `@request.auth.id = user.id || @request.auth.id ?= user.guardians.id`
- View: `@request.auth.id = user.id || @request.auth.id ?= user.guardians.id`
- Create: `@request.auth.id != ""`
- Update: `@request.auth.id != ""`
- Delete: `@request.auth.id = user.id`

---

## 4단계: 샘플 데이터 생성

컬렉션 생성이 완료되면, 다음 명령어로 샘플 데이터를 생성합니다:

```bash
cd safelife-platform
npm run seed
```

이 명령은 다음을 생성합니다:
- 4명의 테스트 사용자 (어르신 2명, 보호자 2명)
- 10개의 상품 데이터
- 스캔 이력, 보이스피싱 로그, 키오스크 세션
- 긴급 연락처, 일일 활동, 보호자 알림

**테스트 계정:**
- Elderly 1: `elderly1@example.com` / `password123`
- Elderly 2: `elderly2@example.com` / `password123`
- Guardian 1: `guardian1@example.com` / `password123`
- Guardian 2: `guardian2@example.com` / `password123`

---

## 확인 사항

컬렉션 생성 후 확인:
1. ✅ 8개 컬렉션 (users + 7개 새 컬렉션) 존재
2. ✅ users 컬렉션에 5개 필드 추가됨
3. ✅ 모든 Relation 필드가 올바른 컬렉션 참조
4. ✅ API Rules 설정 완료

---

## 문제 해결

### Relation 필드 오류
- 참조하는 컬렉션이 먼저 생성되어 있어야 합니다
- 생성 순서: users → products → 나머지 컬렉션

### API Rules 오류
- `@request.auth.id`는 현재 인증된 사용자 ID
- `?=` 연산자는 배열에 값이 포함되어 있는지 확인
- `""` 는 공개 접근
- `null` 은 Admin 전용

### 샘플 데이터 생성 오류
- 컬렉션이 모두 생성되었는지 확인
- Admin 계정 정보가 올바른지 확인
- PocketBase 서버가 실행 중인지 확인
