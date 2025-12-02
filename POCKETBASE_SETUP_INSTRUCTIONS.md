# PocketBase 컬렉션 수동 설정 가이드

PocketBase Admin API가 프로그래매틱 접근을 지원하지 않아, 컬렉션을 Admin UI를 통해 수동으로 생성해야 합니다.

## 빠른 설정 방법

1. PocketBase Admin에 로그인: https://ai-life-solution-challenge.duckdns.org/_/
   - Email: sanoramyun8@gmail.com
   - Password: T22qjsrlf67!

2. Settings > Import collections로 이동

3. 다음 파일의 내용을 복사하여 붙여넣기:
   ```
   scripts/collections-import-with-ids.json
   ```

4. "Review" 버튼 클릭 후 "Confirm" 클릭

## 생성될 컬렉션 목록

1. **products** - 제품 정보 (바코드, 이름, 카테고리, 성분, 알레르기 정보 등)
2. **scan_history** - 바코드 스캔 기록
3. **voice_phishing_logs** - 보이스피싱 감지 로그
4. **kiosk_sessions** - 키오스크 사용 세션
5. **guardian_notifications** - 보호자 알림
6. **emergency_contacts** - 긴급 연락처
7. **daily_activities** - 일일 활동 요약

## users 컬렉션 수정사항

users 컬렉션에는 이미 다음 필드가 추가되어 있어야 합니다:
- role (Select: elderly, guardian) - Required
- phone (Text)
- birthdate (Date)
- address (Text)
- guardians (Relation to users, Multiple)

## 다음 단계

컬렉션 생성 후:
```bash
npm run seed
```

를 실행하여 샘플 데이터를 생성합니다.
