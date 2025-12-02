# PocketBase Database Schema

## Collections Overview

SafeLife 플랫폼을 위한 PocketBase 데이터베이스 스키마입니다.

---

## 1. users (사용자 정보)
**Type**: Auth Collection

### Fields:
- `id` (auto) - 사용자 ID
- `email` (email, required, unique) - 이메일
- `name` (text, required) - 사용자 이름
- `avatar` (file) - 프로필 사진
- `role` (select) - 역할 [elderly, guardian]
- `phone` (text) - 전화번호
- `birthdate` (date) - 생년월일
- `address` (text) - 주소
- `guardians` (relation, multiple) - 연결된 보호자들 (users)
- `created` (auto)
- `updated` (auto)

### API Rules:
- List/View: Authenticated users only
- Create: Anyone (회원가입)
- Update: Owner only
- Delete: Owner only

---

## 2. products (상품 정보)
**Type**: Base Collection

### Fields:
- `id` (auto)
- `barcode` (text, required, unique) - 바코드 번호
- `name` (text, required) - 상품명
- `brand` (text) - 브랜드
- `category` (select) - 카테고리 [food, medicine, cosmetic, other]
- `description` (editor) - 상품 설명
- `ingredients` (json) - 성분 정보
- `allergens` (json) - 알레르기 유발 물질
- `expiry_date` (date) - 유통기한
- `warnings` (editor) - 주의사항
- `image` (file) - 상품 이미지
- `created` (auto)
- `updated` (auto)

### API Rules:
- List/View: Anyone (공개)
- Create: Admin only
- Update: Admin only
- Delete: Admin only

---

## 3. scan_history (스캔 이력)
**Type**: Base Collection

### Fields:
- `id` (auto)
- `user` (relation, required) - 사용자 (users)
- `product` (relation, required) - 스캔한 상품 (products)
- `barcode` (text, required) - 스캔한 바코드
- `scan_type` (select) - 스캔 유형 [barcode, ocr, manual]
- `location` (text) - 스캔 위치 (GPS)
- `tts_played` (bool) - TTS 재생 여부
- `created` (auto)
- `updated` (auto)

### API Rules:
- List/View: Owner and their guardians
- Create: Authenticated users
- Update: Owner only
- Delete: Owner only

---

## 4. voice_phishing_logs (보이스피싱 감지 로그)
**Type**: Base Collection

### Fields:
- `id` (auto)
- `user` (relation, required) - 사용자 (users)
- `transcript` (editor, required) - 통화 내용 텍스트
- `risk_level` (select, required) - 위험도 [low, medium, high]
- `detected_patterns` (json) - 감지된 패턴들
- `caller_info` (json) - 발신자 정보
- `duration` (number) - 통화 시간 (초)
- `guardian_notified` (bool) - 보호자 알림 여부
- `is_blocked` (bool) - 차단 여부
- `user_action` (select) - 사용자 조치 [none, reported, blocked, ignored]
- `created` (auto)
- `updated` (auto)

### API Rules:
- List/View: Owner and their guardians
- Create: Authenticated users
- Update: Owner and their guardians
- Delete: Owner only

---

## 5. kiosk_sessions (키오스크 사용 세션)
**Type**: Base Collection

### Fields:
- `id` (auto)
- `user` (relation, required) - 사용자 (users)
- `kiosk_type` (select) - 키오스크 유형 [fastfood, cafe, ticket, payment, other]
- `location` (text) - 위치
- `screenshot` (file, multiple) - 화면 캡처 이미지들
- `steps_completed` (json) - 완료한 단계들
- `duration` (number) - 사용 시간 (초)
- `success` (bool) - 성공 여부
- `help_requested` (bool) - 도움 요청 여부
- `created` (auto)
- `updated` (auto)

### API Rules:
- List/View: Owner and their guardians
- Create: Authenticated users
- Update: Owner only
- Delete: Owner only

---

## 6. guardian_notifications (보호자 알림)
**Type**: Base Collection

### Fields:
- `id` (auto)
- `guardian` (relation, required) - 보호자 (users)
- `elderly_user` (relation, required) - 어르신 (users)
- `notification_type` (select, required) - 알림 유형 [voice_phishing, unusual_activity, emergency, daily_summary]
- `title` (text, required) - 알림 제목
- `message` (editor, required) - 알림 내용
- `priority` (select) - 우선순위 [low, medium, high, urgent]
- `related_log` (relation) - 관련 로그 (voice_phishing_logs 등)
- `is_read` (bool) - 읽음 여부
- `read_at` (date) - 읽은 시각
- `created` (auto)
- `updated` (auto)

### API Rules:
- List/View: Guardian only
- Create: System (authenticated users)
- Update: Guardian only (for read status)
- Delete: Guardian only

---

## 7. emergency_contacts (긴급 연락처)
**Type**: Base Collection

### Fields:
- `id` (auto)
- `user` (relation, required) - 사용자 (users)
- `name` (text, required) - 이름
- `relationship` (text) - 관계
- `phone` (text, required) - 전화번호
- `email` (email) - 이메일
- `priority` (number) - 우선순위
- `is_primary` (bool) - 주 연락처 여부
- `created` (auto)
- `updated` (auto)

### API Rules:
- List/View: Owner and their guardians
- Create: Authenticated users
- Update: Owner only
- Delete: Owner only

---

## 8. daily_activities (일일 활동 로그)
**Type**: Base Collection

### Fields:
- `id` (auto)
- `user` (relation, required) - 사용자 (users)
- `date` (date, required) - 날짜
- `barcode_scans` (number) - 바코드 스캔 횟수
- `kiosk_uses` (number) - 키오스크 이용 횟수
- `voice_phishing_detections` (number) - 보이스피싱 감지 횟수
- `active_time` (number) - 활동 시간 (분)
- `health_score` (number) - 건강 점수 (0-100)
- `summary` (editor) - 일일 요약
- `created` (auto)
- `updated` (auto)

### API Rules:
- List/View: Owner and their guardians
- Create: System (authenticated users)
- Update: System only
- Delete: Owner only

---

## Implementation Steps

### Step 1: PocketBase Admin 접속
1. https://ai-life-solution-challenge.duckdns.org/_/ 접속
2. Admin 계정으로 로그인

### Step 2: 컬렉션 생성
각 컬렉션을 위 스펙대로 생성:
1. Collection 타입 선택 (Auth/Base)
2. 필드 추가
3. API Rules 설정

### Step 3: 샘플 데이터 추가
테스트를 위한 샘플 데이터:
- 테스트 사용자 (어르신/보호자)
- 샘플 상품 10개
- 샘플 스캔 이력
- 샘플 보이스피싱 로그

### Step 4: API 연동 테스트
- 프론트엔드에서 각 API 호출 테스트
- 권한 설정 확인
- 실시간 업데이트 확인
