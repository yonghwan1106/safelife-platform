// SafeLife Platform - Mock Data
// 공모전 데모를 위한 목업 데이터

// ============================================
// 1. 제품 데이터 (바코드 스캐너용)
// ============================================

export interface MockProduct {
  barcode: string
  name: string
  manufacturer: string
  category: string
  ingredients: string[]
  allergens: string[]
  warnings: string[]
  volume?: string
  calories?: number
  expiryDays?: number
  image?: string
}

export const MOCK_PRODUCTS: MockProduct[] = [
  // 유제품
  {
    barcode: '8801115114239',
    name: '서울우유 오리지널',
    manufacturer: '서울우유협동조합',
    category: '유제품',
    ingredients: ['원유(국산) 100%'],
    allergens: ['우유'],
    warnings: ['냉장보관(0-10℃)', '개봉 후 빠른 시일 내 섭취'],
    volume: '1000ml',
    calories: 130,
    expiryDays: 14
  },
  {
    barcode: '8801069411576',
    name: '빙그레 바나나맛우유',
    manufacturer: '빙그레',
    category: '유제품',
    ingredients: ['원유', '정제수', '백설탕', '바나나농축액', '혼합제제'],
    allergens: ['우유'],
    warnings: ['냉장보관 필수'],
    volume: '240ml',
    calories: 225,
    expiryDays: 10
  },
  {
    barcode: '8801062871476',
    name: '매일 소화가 잘되는 우유',
    manufacturer: '매일유업',
    category: '유제품',
    ingredients: ['원유', '유당분해효소'],
    allergens: ['우유'],
    warnings: ['냉장보관(0-10℃)'],
    volume: '900ml',
    calories: 110,
    expiryDays: 12
  },
  {
    barcode: '8801037021011',
    name: '남양 GT 플레인',
    manufacturer: '남양유업',
    category: '유제품',
    ingredients: ['탈지농축유', '과당', '유크림'],
    allergens: ['우유'],
    warnings: ['냉장보관'],
    volume: '150ml',
    calories: 85,
    expiryDays: 21
  },

  // 음료
  {
    barcode: '8801094002701',
    name: '코카콜라 오리지널',
    manufacturer: '코카콜라음료',
    category: '탄산음료',
    ingredients: ['정제수', '고과당', '설탕', '탄산가스', '캐러멜색소', '인산', '천연향료', '카페인'],
    allergens: [],
    warnings: ['카페인 함유', '당뇨 환자 주의'],
    volume: '500ml',
    calories: 210,
    expiryDays: 365
  },
  {
    barcode: '8801056015688',
    name: '제주삼다수',
    manufacturer: '제주특별자치도개발공사',
    category: '생수',
    ingredients: ['먹는샘물'],
    allergens: [],
    warnings: [],
    volume: '2L',
    calories: 0,
    expiryDays: 730
  },
  {
    barcode: '8801042367516',
    name: '광동 비타500',
    manufacturer: '광동제약',
    category: '비타민음료',
    ingredients: ['정제수', '액상과당', '비타민C', '구연산', '비타민B2'],
    allergens: [],
    warnings: ['하루 1병 권장'],
    volume: '100ml',
    calories: 50,
    expiryDays: 365
  },
  {
    barcode: '8801104216814',
    name: '포카리스웨트',
    manufacturer: '동아오츠카',
    category: '이온음료',
    ingredients: ['정제수', '설탕', '포도당', '구연산', '구연산나트륨', '염화나트륨', '염화칼륨'],
    allergens: [],
    warnings: ['운동 후 섭취 권장'],
    volume: '500ml',
    calories: 125,
    expiryDays: 365
  },

  // 과자/스낵
  {
    barcode: '8801062333226',
    name: '오리온 초코파이',
    manufacturer: '오리온',
    category: '과자',
    ingredients: ['밀가루', '설탕', '코코아버터', '마시멜로', '계란', '식물성유지'],
    allergens: ['밀', '계란', '대두', '우유'],
    warnings: ['고열량 식품'],
    volume: '468g (12개입)',
    calories: 158,
    expiryDays: 180
  },
  {
    barcode: '8801043015868',
    name: '농심 새우깡',
    manufacturer: '농심',
    category: '과자',
    ingredients: ['밀가루', '새우분말', '식물성유지', '정제염', '설탕'],
    allergens: ['밀', '새우'],
    warnings: [],
    volume: '90g',
    calories: 475,
    expiryDays: 180
  },
  {
    barcode: '8801111186544',
    name: '롯데 빼빼로 오리지널',
    manufacturer: '롯데제과',
    category: '과자',
    ingredients: ['밀가루', '설탕', '코코아매스', '식물성유지', '전지분유'],
    allergens: ['밀', '대두', '우유'],
    warnings: [],
    volume: '54g',
    calories: 272,
    expiryDays: 365
  },
  {
    barcode: '8801019303456',
    name: '해태 맛동산',
    manufacturer: '해태제과',
    category: '과자',
    ingredients: ['밀가루', '물엿', '쌀가루', '땅콩', '설탕', '대두유'],
    allergens: ['밀', '땅콩', '대두'],
    warnings: ['땅콩 알레르기 주의'],
    volume: '100g',
    calories: 455,
    expiryDays: 180
  },
  {
    barcode: '8801062001477',
    name: '오리온 포카칩 오리지널',
    manufacturer: '오리온',
    category: '과자',
    ingredients: ['감자(외국산)', '식물성유지', '정제염', '설탕'],
    allergens: [],
    warnings: [],
    volume: '66g',
    calories: 360,
    expiryDays: 180
  },

  // 라면
  {
    barcode: '8801043157469',
    name: '농심 신라면',
    manufacturer: '농심',
    category: '라면',
    ingredients: ['면(밀가루, 팜유)', '분말스프(고춧가루, 정제염, 쇠고기분)', '건더기스프(표고버섯, 당근)'],
    allergens: ['밀', '대두', '쇠고기'],
    warnings: ['나트륨 함량 높음', '고혈압 환자 주의'],
    volume: '120g',
    calories: 505,
    expiryDays: 365
  },
  {
    barcode: '8801045522692',
    name: '오뚜기 진라면 순한맛',
    manufacturer: '오뚜기',
    category: '라면',
    ingredients: ['면(밀가루, 팜유)', '분말스프(정제염, 양파분)', '건더기스프(파, 당근)'],
    allergens: ['밀', '대두'],
    warnings: ['나트륨 함량 높음'],
    volume: '120g',
    calories: 495,
    expiryDays: 365
  },
  {
    barcode: '8801073113541',
    name: '삼양라면 오리지널',
    manufacturer: '삼양식품',
    category: '라면',
    ingredients: ['면(밀가루, 전분)', '분말스프(정제염, 쇠고기엑기스)'],
    allergens: ['밀', '쇠고기'],
    warnings: ['나트륨 함량 높음'],
    volume: '120g',
    calories: 470,
    expiryDays: 365
  },
  {
    barcode: '8801045572529',
    name: '오뚜기 컵밥 김치참치',
    manufacturer: '오뚜기',
    category: '즉석밥',
    ingredients: ['쌀밥', '참치', '김치', '고추장'],
    allergens: ['대두', '밀'],
    warnings: ['전자레인지 조리'],
    volume: '280g',
    calories: 395,
    expiryDays: 365
  },

  // 의약품
  {
    barcode: '8806469012345',
    name: '타이레놀 500mg',
    manufacturer: '한국얀센',
    category: '의약품',
    ingredients: ['아세트아미노펜 500mg'],
    allergens: [],
    warnings: ['성인 1회 1-2정', '1일 4회까지', '간장애 환자 주의', '알코올과 함께 복용 금지'],
    volume: '10정',
    expiryDays: 730
  },
  {
    barcode: '8806421012789',
    name: '부루펜 시럽',
    manufacturer: '삼일제약',
    category: '의약품',
    ingredients: ['이부프로펜'],
    allergens: [],
    warnings: ['소아용', '식후 복용', '아스피린 알레르기 환자 주의'],
    volume: '100ml',
    expiryDays: 730
  },
  {
    barcode: '8806541098765',
    name: '게보린',
    manufacturer: '삼진제약',
    category: '의약품',
    ingredients: ['아세트아미노펜', '이소프로필안티피린', '무수카페인'],
    allergens: [],
    warnings: ['두통, 치통, 생리통에 효과', '공복시 복용 주의', '1일 3회까지'],
    volume: '10정',
    expiryDays: 730
  },
  {
    barcode: '8806123456789',
    name: '판콜에이 내복액',
    manufacturer: '동화약품',
    category: '의약품',
    ingredients: ['아세트아미노펜', '클로르페니라민말레산염', '슈도에페드린염산염'],
    allergens: [],
    warnings: ['감기약', '졸음 유발 가능', '운전 전 복용 주의'],
    volume: '180ml',
    expiryDays: 730
  },

  // 건강기능식품
  {
    barcode: '8809234567890',
    name: '종근당 락토핏 생유산균',
    manufacturer: '종근당건강',
    category: '건강기능식품',
    ingredients: ['프로바이오틱스', '프리바이오틱스', '아연'],
    allergens: ['우유'],
    warnings: ['1일 1포', '냉장보관 권장'],
    volume: '2g x 50포',
    expiryDays: 365
  },
  {
    barcode: '8809345678901',
    name: '정관장 홍삼정 에브리타임',
    manufacturer: '한국인삼공사',
    category: '건강기능식품',
    ingredients: ['홍삼농축액(6년근 홍삼)', '정제수'],
    allergens: [],
    warnings: ['1일 1포', '고혈압 환자 의사와 상담'],
    volume: '10ml x 30포',
    expiryDays: 730
  },
  {
    barcode: '8809456789012',
    name: '뉴트리원 루테인 오메가3',
    manufacturer: '뉴트리원',
    category: '건강기능식품',
    ingredients: ['오메가3 지방산', '루테인', '비타민E'],
    allergens: [],
    warnings: ['1일 1캡슐', '임산부 섭취 전 의사 상담'],
    volume: '30캡슐',
    expiryDays: 365
  },

  // 생활용품
  {
    barcode: '8801234500001',
    name: 'LG 페리오 토탈7 치약',
    manufacturer: 'LG생활건강',
    category: '생활용품',
    ingredients: ['불소', '자일리톨', '녹차추출물'],
    allergens: [],
    warnings: ['6세 이하 어린이 사용량 주의', '삼키지 마세요'],
    volume: '150g',
    expiryDays: 1095
  },
  {
    barcode: '8801234500002',
    name: '애경 2080 미백치약',
    manufacturer: '애경산업',
    category: '생활용품',
    ingredients: ['불소', '과산화수소', '멘톨'],
    allergens: [],
    warnings: ['삼키지 마세요', '상처 부위에 사용 금지'],
    volume: '130g',
    expiryDays: 1095
  },

  // 조미료
  {
    barcode: '8801052001234',
    name: 'CJ 백설 설탕',
    manufacturer: 'CJ제일제당',
    category: '조미료',
    ingredients: ['원당(호주산, 태국산)'],
    allergens: [],
    warnings: ['당뇨 환자 섭취량 조절'],
    volume: '1kg',
    expiryDays: 1095
  },
  {
    barcode: '8801052005678',
    name: 'CJ 해찬들 태양초 고추장',
    manufacturer: 'CJ제일제당',
    category: '조미료',
    ingredients: ['찹쌀', '고춧가루', '소금', '매실액'],
    allergens: ['대두', '밀'],
    warnings: ['냉장보관 권장'],
    volume: '500g',
    expiryDays: 365
  },
  {
    barcode: '8801007109876',
    name: '대상 청정원 국간장',
    manufacturer: '대상',
    category: '조미료',
    ingredients: ['대두', '소금', '밀'],
    allergens: ['대두', '밀'],
    warnings: ['고혈압 환자 나트륨 주의'],
    volume: '500ml',
    expiryDays: 730
  }
]

// 바코드로 제품 찾기
export function getProductByBarcode(barcode: string): MockProduct | null {
  return MOCK_PRODUCTS.find(p => p.barcode === barcode) || null
}

// 랜덤 제품 가져오기 (데모용)
export function getRandomProducts(count: number): MockProduct[] {
  const shuffled = [...MOCK_PRODUCTS].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// 데모용 추천 제품 (알레르기 있는 제품 포함)
export function getDemoProducts(): MockProduct[] {
  // 데모 제품에 사용자 이미지 매핑
  const demoImages = [
    '/images/z1_seoul_milk.png',     // 서울우유
    '/images/z2_chochopie.webp',     // 초코파이
    '/images/z3_brupen.webp',        // 타이레놀 (부루펜 이미지 사용)
    '/images/z4_makdongsan.webp',    // 맛동산
    '/images/z5_samdasoo.webp',      // 삼다수
  ]

  const demoProductIndices = [0, 8, 18, 11, 5]

  return demoProductIndices.map((idx, i) => ({
    ...MOCK_PRODUCTS[idx],
    image: demoImages[i]
  }))
}


// ============================================
// 2. 보이스피싱 시나리오
// ============================================

export interface PhishingScenario {
  id: string
  type: string
  typeName: string
  title: string
  riskLevel: 'low' | 'medium' | 'high'
  transcript: string
  patterns: string[]
  recommendation: string
  duration: number // seconds
}

export const MOCK_PHISHING_SCENARIOS: PhishingScenario[] = [
  {
    id: 'phishing-1',
    type: 'institution',
    typeName: '기관 사칭형',
    title: '금융감독원 사칭',
    riskLevel: 'high',
    transcript: '안녕하세요, 금융감독원입니다. 고객님 명의의 계좌에서 불법 자금 거래가 감지되었습니다. 본인 확인을 위해 주민등록번호와 계좌번호를 말씀해 주시기 바랍니다. 협조하지 않으시면 법적 조치가 취해질 수 있습니다.',
    patterns: ['금융감독원 사칭', '개인정보 요구', '법적 조치 협박'],
    recommendation: '금융감독원은 절대 전화로 개인정보를 요구하지 않습니다. 즉시 전화를 끊고 금융감독원(1332)에 직접 확인하세요.',
    duration: 45
  },
  {
    id: 'phishing-2',
    type: 'prosecution',
    typeName: '수사기관 사칭형',
    title: '검찰청 사칭',
    riskLevel: 'high',
    transcript: '서울중앙지검 김검사입니다. 고객님 명의가 범죄에 도용되어 수사 중입니다. 피해 예방을 위해 안전계좌로 자금을 이체해 주셔야 합니다. 지금 바로 안내해 드리는 계좌로 송금해 주세요.',
    patterns: ['검찰청 사칭', '안전계좌 언급', '즉시 송금 요구'],
    recommendation: '검찰은 절대 전화로 송금을 요구하지 않습니다. 가짜 검찰 사칭입니다. 경찰(112)에 신고하세요.',
    duration: 50
  },
  {
    id: 'phishing-3',
    type: 'loan',
    typeName: '대출 사기형',
    title: '저금리 대출 권유',
    riskLevel: 'medium',
    transcript: '안녕하세요, OO저축은행입니다. 고객님께 특별 저금리 대출 상품을 안내드립니다. 연 2.5% 초저금리로 최대 5천만원까지 가능합니다. 대출 승인을 위해 선입금 200만원이 필요합니다.',
    patterns: ['저금리 대출 유혹', '선입금 요구', '과도한 조건 제시'],
    recommendation: '정상적인 대출은 선입금을 요구하지 않습니다. 대출 사기일 가능성이 높습니다.',
    duration: 40
  },
  {
    id: 'phishing-4',
    type: 'family',
    typeName: '가족 사칭형',
    title: '자녀 납치 사기',
    riskLevel: 'high',
    transcript: '엄마, 나 지금 큰일났어. 교통사고가 났는데 합의금이 필요해. 지금 당장 500만원만 보내줘. 제발 아빠한테는 말하지 마. 빨리 보내줘야 해.',
    patterns: ['가족 사칭', '긴급 상황 연출', '비밀 유지 요청', '즉시 송금 요구'],
    recommendation: '자녀에게 직접 전화해서 확인하세요. 가족 사칭 보이스피싱입니다.',
    duration: 35
  },
  {
    id: 'phishing-5',
    type: 'delivery',
    typeName: '택배 사칭형',
    title: '택배 배송 사칭',
    riskLevel: 'low',
    transcript: '안녕하세요, OO택배입니다. 고객님의 택배가 세관에 억류되어 있습니다. 통관 수수료 5만원을 납부하시면 배송됩니다. 지금 안내해 드리는 링크로 결제해 주세요.',
    patterns: ['택배 사칭', '통관 수수료 요구', '링크 클릭 유도'],
    recommendation: '택배사에서 세관 수수료를 전화로 요구하지 않습니다. 해당 택배사 고객센터에 직접 확인하세요.',
    duration: 30
  },
  {
    id: 'phishing-6',
    type: 'insurance',
    typeName: '보험금 사기형',
    title: '보험금 환급 사칭',
    riskLevel: 'medium',
    transcript: '국민건강보험공단입니다. 고객님께 과오납 보험료 35만원 환급금이 있습니다. 환급 처리를 위해 계좌번호와 공인인증서 비밀번호를 말씀해 주세요.',
    patterns: ['공공기관 사칭', '환급금 미끼', '금융정보 요구'],
    recommendation: '건강보험공단은 전화로 금융정보를 요구하지 않습니다. 공단(1577-1000)에 직접 확인하세요.',
    duration: 38
  },
  {
    id: 'phishing-7',
    type: 'remote',
    typeName: '원격제어 유도형',
    title: '보안 앱 설치 유도',
    riskLevel: 'high',
    transcript: '금융보안원입니다. 고객님 스마트폰이 해킹되어 금융정보가 유출되고 있습니다. 보안 앱을 설치해야 합니다. 제가 보내드리는 링크를 클릭해서 앱을 설치해 주세요.',
    patterns: ['보안기관 사칭', '해킹 공포 조성', '앱 설치 유도', '링크 클릭 요청'],
    recommendation: '금융보안원은 앱 설치를 요청하지 않습니다. 링크 클릭 시 악성 앱이 설치됩니다.',
    duration: 42
  },
  {
    id: 'phishing-8',
    type: 'investment',
    typeName: '투자 사기형',
    title: '주식/코인 투자 권유',
    riskLevel: 'medium',
    transcript: '안녕하세요, 전문 투자 컨설턴트입니다. 비공개 정보로 수익률 300% 보장 종목이 있습니다. 지금 투자하시면 원금 보장에 월 30% 수익이 가능합니다. 투자금을 입금해 주세요.',
    patterns: ['고수익 보장', '비공개 정보 언급', '원금 보장 주장', '투자금 입금 요구'],
    recommendation: '원금 보장과 고수익을 동시에 약속하는 투자는 사기입니다. 절대 입금하지 마세요.',
    duration: 45
  },
  {
    id: 'phishing-9',
    type: 'government',
    typeName: '정부지원금 사기형',
    title: '긴급재난지원금 사칭',
    riskLevel: 'medium',
    transcript: '정부 긴급재난지원금 안내입니다. 고객님께서 아직 신청하지 않은 100만원의 지원금이 있습니다. 지금 신청하시면 바로 지급됩니다. 본인 확인을 위해 주민번호와 계좌를 말씀해 주세요.',
    patterns: ['정부기관 사칭', '지원금 미끼', '개인정보 요구'],
    recommendation: '정부 지원금은 공식 홈페이지나 주민센터에서만 신청 가능합니다. 전화 신청은 사기입니다.',
    duration: 36
  },
  {
    id: 'phishing-10',
    type: 'friend',
    typeName: '지인 사칭형',
    title: '급전 요청 사기',
    riskLevel: 'high',
    transcript: '나야, 친구. 지금 급하게 돈이 필요한데 계좌가 막혀서 그래. 잠깐만 300만원만 빌려줘. 내일 바로 갚을게. 제발 부탁해. 다른 사람한테 말하지 말고.',
    patterns: ['지인 사칭', '급전 요청', '비밀 유지 요구', '계좌 문제 핑계'],
    recommendation: '본인에게 직접 전화해서 확인하세요. 메신저 계정 해킹 후 사칭하는 수법입니다.',
    duration: 32
  }
]

// 시나리오 ID로 찾기
export function getPhishingScenarioById(id: string): PhishingScenario | null {
  return MOCK_PHISHING_SCENARIOS.find(s => s.id === id) || null
}

// 위험도별 시나리오 필터
export function getScenariosByRiskLevel(level: 'low' | 'medium' | 'high'): PhishingScenario[] {
  return MOCK_PHISHING_SCENARIOS.filter(s => s.riskLevel === level)
}


// ============================================
// 3. 키오스크 시나리오
// ============================================

export interface KioskStep {
  step: number
  screenName: string
  instruction: string
  voiceGuide: string
  touchTarget: string // 터치해야 할 위치 설명
  confidence: number
}

export interface KioskScenario {
  id: string
  type: string
  name: string
  location: string
  icon: string
  steps: KioskStep[]
}

export const MOCK_KIOSK_SCENARIOS: Record<string, KioskScenario> = {
  fastfood: {
    id: 'kiosk-fastfood',
    type: 'fastfood',
    name: '패스트푸드 주문',
    location: '맥도날드 강남점',
    icon: '🍔',
    steps: [
      {
        step: 1,
        screenName: '메인 화면',
        instruction: '주문하기 버튼을 터치하세요',
        voiceGuide: '화면 중앙의 큰 "주문하기" 버튼을 손가락으로 터치해 주세요.',
        touchTarget: '화면 중앙 하단',
        confidence: 95
      },
      {
        step: 2,
        screenName: '식사 방법 선택',
        instruction: '매장 식사 또는 포장을 선택하세요',
        voiceGuide: '매장에서 드시려면 왼쪽 "매장 식사"를, 가져가시려면 오른쪽 "포장"을 터치하세요.',
        touchTarget: '왼쪽 또는 오른쪽 버튼',
        confidence: 92
      },
      {
        step: 3,
        screenName: '카테고리 선택',
        instruction: '원하시는 메뉴 카테고리를 선택하세요',
        voiceGuide: '화면 상단에 버거, 세트, 사이드, 음료 등의 카테고리가 있습니다. 원하시는 종류를 터치하세요.',
        touchTarget: '상단 카테고리 탭',
        confidence: 90
      },
      {
        step: 4,
        screenName: '메뉴 선택',
        instruction: '원하시는 메뉴를 터치하세요',
        voiceGuide: '화면에 여러 메뉴가 보입니다. 원하시는 메뉴 사진을 터치하시면 됩니다.',
        touchTarget: '메뉴 이미지',
        confidence: 93
      },
      {
        step: 5,
        screenName: '세트 옵션',
        instruction: '단품 또는 세트를 선택하세요',
        voiceGuide: '단품으로 드시려면 "단품"을, 음료와 감자튀김을 함께 드시려면 "세트"를 선택하세요.',
        touchTarget: '단품/세트 버튼',
        confidence: 91
      },
      {
        step: 6,
        screenName: '장바구니 확인',
        instruction: '주문 내역을 확인하고 결제하기를 누르세요',
        voiceGuide: '주문하신 메뉴가 맞는지 확인하시고, 화면 하단의 "결제하기" 버튼을 터치하세요.',
        touchTarget: '하단 결제하기 버튼',
        confidence: 94
      },
      {
        step: 7,
        screenName: '결제 방법 선택',
        instruction: '결제 방법을 선택하세요',
        voiceGuide: '카드로 결제하시려면 "카드 결제"를, 현금은 "현금 결제"를 터치하세요.',
        touchTarget: '결제 방법 버튼',
        confidence: 92
      },
      {
        step: 8,
        screenName: '결제 완료',
        instruction: '영수증을 받으시고 주문번호를 확인하세요',
        voiceGuide: '결제가 완료되었습니다. 영수증의 주문번호를 기억해 주세요. 번호가 호출되면 카운터에서 받으시면 됩니다.',
        touchTarget: '완료',
        confidence: 98
      }
    ]
  },
  cafe: {
    id: 'kiosk-cafe',
    type: 'cafe',
    name: '카페 주문',
    location: '스타벅스 종로점',
    icon: '☕',
    steps: [
      {
        step: 1,
        screenName: '메인 화면',
        instruction: '주문하기를 터치하세요',
        voiceGuide: '화면의 "주문하기" 버튼을 터치해 주세요.',
        touchTarget: '중앙 주문하기 버튼',
        confidence: 95
      },
      {
        step: 2,
        screenName: '매장/테이크아웃',
        instruction: '매장 이용 또는 테이크아웃을 선택하세요',
        voiceGuide: '매장에서 드시려면 "매장", 가져가시려면 "테이크아웃"을 선택하세요.',
        touchTarget: '매장/테이크아웃 버튼',
        confidence: 93
      },
      {
        step: 3,
        screenName: '음료 카테고리',
        instruction: '음료 종류를 선택하세요',
        voiceGuide: '커피, 티, 프라푸치노, 주스 중에서 원하시는 종류를 터치하세요.',
        touchTarget: '카테고리 버튼',
        confidence: 91
      },
      {
        step: 4,
        screenName: '메뉴 선택',
        instruction: '원하시는 음료를 선택하세요',
        voiceGuide: '메뉴 목록에서 원하시는 음료를 터치하세요.',
        touchTarget: '음료 이미지',
        confidence: 92
      },
      {
        step: 5,
        screenName: '사이즈/옵션',
        instruction: '사이즈와 옵션을 선택하세요',
        voiceGuide: '톨, 그란데, 벤티 중 사이즈를 선택하고, 얼음이나 시럽 등 옵션을 조절하세요.',
        touchTarget: '사이즈 버튼',
        confidence: 88
      },
      {
        step: 6,
        screenName: '장바구니',
        instruction: '주문을 확인하고 결제로 진행하세요',
        voiceGuide: '주문 내역을 확인하시고 "결제하기"를 터치하세요.',
        touchTarget: '결제하기 버튼',
        confidence: 94
      },
      {
        step: 7,
        screenName: '결제',
        instruction: '결제를 완료하세요',
        voiceGuide: '카드를 삽입하거나 터치하여 결제해 주세요.',
        touchTarget: '카드 단말기',
        confidence: 95
      }
    ]
  },
  ticket: {
    id: 'kiosk-ticket',
    type: 'ticket',
    name: '기차표 예매',
    location: '서울역',
    icon: '🚄',
    steps: [
      {
        step: 1,
        screenName: '시작 화면',
        instruction: '승차권 구매를 터치하세요',
        voiceGuide: '화면의 "승차권 구매" 버튼을 터치해 주세요.',
        touchTarget: '승차권 구매 버튼',
        confidence: 96
      },
      {
        step: 2,
        screenName: '출발역 선택',
        instruction: '출발역을 선택하세요',
        voiceGuide: '출발하실 역 이름을 터치하세요. 현재 위치가 자동 선택되어 있습니다.',
        touchTarget: '역 목록',
        confidence: 90
      },
      {
        step: 3,
        screenName: '도착역 선택',
        instruction: '도착역을 선택하세요',
        voiceGuide: '도착하실 역 이름을 터치하세요.',
        touchTarget: '역 목록',
        confidence: 90
      },
      {
        step: 4,
        screenName: '날짜/시간 선택',
        instruction: '출발 날짜와 시간을 선택하세요',
        voiceGuide: '달력에서 날짜를 선택하고, 원하시는 출발 시간대를 터치하세요.',
        touchTarget: '달력 및 시간',
        confidence: 85
      },
      {
        step: 5,
        screenName: '열차 선택',
        instruction: '원하시는 열차를 선택하세요',
        voiceGuide: '출발 시간과 남은 좌석 수를 확인하고 원하시는 열차를 선택하세요.',
        touchTarget: '열차 목록',
        confidence: 88
      },
      {
        step: 6,
        screenName: '좌석 선택',
        instruction: '좌석을 선택하세요',
        voiceGuide: '창가 또는 통로 좌석을 선택할 수 있습니다. 원하시는 좌석을 터치하세요.',
        touchTarget: '좌석 배치도',
        confidence: 82
      },
      {
        step: 7,
        screenName: '결제',
        instruction: '결제를 완료하세요',
        voiceGuide: '카드를 삽입하거나 터치하여 결제해 주세요.',
        touchTarget: '카드 단말기',
        confidence: 95
      },
      {
        step: 8,
        screenName: '발권',
        instruction: '승차권을 받으세요',
        voiceGuide: '아래 출력구에서 승차권을 받아가세요. 출발 시간을 꼭 확인해 주세요.',
        touchTarget: '출력구',
        confidence: 97
      }
    ]
  },
  atm: {
    id: 'kiosk-atm',
    type: 'atm',
    name: 'ATM 출금',
    location: '국민은행 ATM',
    icon: '🏧',
    steps: [
      {
        step: 1,
        screenName: '시작 화면',
        instruction: '카드를 넣어주세요',
        voiceGuide: '카드 투입구에 카드를 넣어주세요. 칩이 있는 면이 위로 가도록 해주세요.',
        touchTarget: '카드 투입구',
        confidence: 94
      },
      {
        step: 2,
        screenName: '언어 선택',
        instruction: '한국어를 선택하세요',
        voiceGuide: '"한국어" 버튼을 터치해 주세요.',
        touchTarget: '한국어 버튼',
        confidence: 98
      },
      {
        step: 3,
        screenName: '비밀번호 입력',
        instruction: '비밀번호 4자리를 입력하세요',
        voiceGuide: '카드 비밀번호 4자리를 숫자 버튼으로 입력해 주세요.',
        touchTarget: '숫자 키패드',
        confidence: 95
      },
      {
        step: 4,
        screenName: '거래 선택',
        instruction: '출금을 선택하세요',
        voiceGuide: '화면의 "출금" 버튼을 터치해 주세요.',
        touchTarget: '출금 버튼',
        confidence: 96
      },
      {
        step: 5,
        screenName: '금액 선택',
        instruction: '출금할 금액을 선택하세요',
        voiceGuide: '미리 설정된 금액을 선택하거나, "직접입력"을 눌러 원하시는 금액을 입력하세요.',
        touchTarget: '금액 버튼',
        confidence: 90
      },
      {
        step: 6,
        screenName: '출금 완료',
        instruction: '현금과 카드를 받으세요',
        voiceGuide: '현금과 카드를 받아가세요. 잊지 마시고 꼭 챙겨가세요.',
        touchTarget: '현금 출구, 카드 투입구',
        confidence: 97
      }
    ]
  },
  hospital: {
    id: 'kiosk-hospital',
    type: 'hospital',
    name: '병원 접수',
    location: '서울대병원',
    icon: '🏥',
    steps: [
      {
        step: 1,
        screenName: '시작 화면',
        instruction: '진료 접수를 터치하세요',
        voiceGuide: '화면의 "진료 접수" 버튼을 터치해 주세요.',
        touchTarget: '진료 접수 버튼',
        confidence: 95
      },
      {
        step: 2,
        screenName: '환자 확인',
        instruction: '주민등록번호 또는 QR코드로 본인 확인하세요',
        voiceGuide: '주민등록번호를 입력하거나, 건강보험증의 QR코드를 스캔해 주세요.',
        touchTarget: '번호 입력 또는 QR 스캐너',
        confidence: 88
      },
      {
        step: 3,
        screenName: '진료과 선택',
        instruction: '방문할 진료과를 선택하세요',
        voiceGuide: '내과, 외과, 정형외과 등 진료받으실 과를 선택해 주세요.',
        touchTarget: '진료과 목록',
        confidence: 85
      },
      {
        step: 4,
        screenName: '의사 선택',
        instruction: '진료 의사를 선택하세요',
        voiceGuide: '예약하신 의사 선생님을 선택하거나, 가능한 의사를 선택하세요.',
        touchTarget: '의사 목록',
        confidence: 83
      },
      {
        step: 5,
        screenName: '접수 확인',
        instruction: '접수 정보를 확인하고 완료하세요',
        voiceGuide: '접수 정보가 맞는지 확인하시고 "접수 완료" 버튼을 터치하세요.',
        touchTarget: '접수 완료 버튼',
        confidence: 94
      },
      {
        step: 6,
        screenName: '대기번호 발급',
        instruction: '대기번호표를 받으세요',
        voiceGuide: '대기번호표가 출력되었습니다. 해당 진료과 앞에서 대기해 주세요.',
        touchTarget: '출력구',
        confidence: 96
      }
    ]
  }
}

// 키오스크 타입으로 시나리오 가져오기
export function getKioskScenario(type: string): KioskScenario | null {
  return MOCK_KIOSK_SCENARIOS[type] || null
}

// 모든 키오스크 타입 목록
export function getKioskTypes(): { type: string; name: string; icon: string }[] {
  return Object.values(MOCK_KIOSK_SCENARIOS).map(k => ({
    type: k.type,
    name: k.name,
    icon: k.icon
  }))
}


// ============================================
// 4. 어르신 사용자 (대시보드용)
// ============================================

export interface ElderlyUser {
  id: string
  name: string
  relationship: string
  age: number
  status: 'safe' | 'warning' | 'danger'
  statusMessage: string
  lastActivity: number // timestamp
  lastActivityType: string
  photo: string
  phone: string
  address: string
  weeklyStats: {
    barcodeScans: number
    kioskHelps: number
    phishingBlocks: number
  }
}

export const MOCK_ELDERLY_USERS: ElderlyUser[] = [
  {
    id: 'elderly-1',
    name: '김순자',
    relationship: '어머니',
    age: 72,
    status: 'safe',
    statusMessage: '정상 활동 중',
    lastActivity: Date.now() - 30 * 60 * 1000, // 30분 전
    lastActivityType: '바코드 스캔',
    photo: '/images/profile_elderly_1.png',
    phone: '010-1234-5678',
    address: '서울시 강남구 테헤란로 123',
    weeklyStats: {
      barcodeScans: 24,
      kioskHelps: 5,
      phishingBlocks: 2
    }
  },
  {
    id: 'elderly-2',
    name: '김철수',
    relationship: '아버지',
    age: 75,
    status: 'warning',
    statusMessage: '2시간 동안 활동 없음',
    lastActivity: Date.now() - 2 * 60 * 60 * 1000, // 2시간 전
    lastActivityType: '키오스크 도움',
    photo: '/images/profile_elderly_2.png',
    phone: '010-2345-6789',
    address: '서울시 강남구 테헤란로 123',
    weeklyStats: {
      barcodeScans: 12,
      kioskHelps: 8,
      phishingBlocks: 1
    }
  },
  {
    id: 'elderly-3',
    name: '이영희',
    relationship: '외할머니',
    age: 78,
    status: 'safe',
    statusMessage: '정상 활동 중',
    lastActivity: Date.now() - 15 * 60 * 1000, // 15분 전
    lastActivityType: '바코드 스캔',
    photo: '/images/profile_elderly_3.png',
    phone: '010-3456-7890',
    address: '서울시 서초구 반포대로 45',
    weeklyStats: {
      barcodeScans: 18,
      kioskHelps: 3,
      phishingBlocks: 0
    }
  },
  {
    id: 'elderly-4',
    name: '박정수',
    relationship: '외할아버지',
    age: 80,
    status: 'safe',
    statusMessage: '정상 활동 중',
    lastActivity: Date.now() - 45 * 60 * 1000, // 45분 전
    lastActivityType: '앱 접속',
    photo: '/images/profile_elderly_4.png',
    phone: '010-4567-8901',
    address: '서울시 서초구 반포대로 45',
    weeklyStats: {
      barcodeScans: 8,
      kioskHelps: 2,
      phishingBlocks: 1
    }
  },
  {
    id: 'elderly-5',
    name: '최옥순',
    relationship: '이모',
    age: 68,
    status: 'danger',
    statusMessage: '보이스피싱 의심 전화 감지',
    lastActivity: Date.now() - 5 * 60 * 1000, // 5분 전
    lastActivityType: '피싱 감지',
    photo: '/images/profile_elderly_5.png',
    phone: '010-5678-9012',
    address: '경기도 성남시 분당구 정자동 78',
    weeklyStats: {
      barcodeScans: 15,
      kioskHelps: 6,
      phishingBlocks: 3
    }
  }
]


// ============================================
// 5. 알림 데이터 (대시보드용)
// ============================================

export interface Alert {
  id: string
  type: 'voice_phishing' | 'unusual_activity' | 'emergency' | 'daily_report'
  severity: 'low' | 'medium' | 'high'
  elderlyId: string
  elderlyName: string
  title: string
  message: string
  timestamp: number
  acknowledged: boolean
  actionTaken?: string
}

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'alert-1',
    type: 'voice_phishing',
    severity: 'high',
    elderlyId: 'elderly-5',
    elderlyName: '최옥순 (이모)',
    title: '보이스피싱 의심 전화 감지',
    message: '"금융감독원" 사칭 전화가 감지되었습니다. 계좌번호 요구 시도가 있었습니다.',
    timestamp: Date.now() - 5 * 60 * 1000,
    acknowledged: false
  },
  {
    id: 'alert-2',
    type: 'unusual_activity',
    severity: 'medium',
    elderlyId: 'elderly-2',
    elderlyName: '김철수 (아버지)',
    title: '장시간 활동 없음',
    message: '아버지가 2시간 동안 앱 활동이 없습니다. 안부 확인을 권장합니다.',
    timestamp: Date.now() - 30 * 60 * 1000,
    acknowledged: false
  },
  {
    id: 'alert-3',
    type: 'voice_phishing',
    severity: 'medium',
    elderlyId: 'elderly-1',
    elderlyName: '김순자 (어머니)',
    title: '의심 전화 차단',
    message: '저금리 대출 권유 전화가 자동 차단되었습니다.',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    acknowledged: true,
    actionTaken: '통화 종료'
  },
  {
    id: 'alert-4',
    type: 'daily_report',
    severity: 'low',
    elderlyId: 'elderly-1',
    elderlyName: '김순자 (어머니)',
    title: '일일 활동 리포트',
    message: '오늘 바코드 스캔 5회, 키오스크 도움 1회 사용하셨습니다.',
    timestamp: Date.now() - 6 * 60 * 60 * 1000,
    acknowledged: true
  },
  {
    id: 'alert-5',
    type: 'voice_phishing',
    severity: 'high',
    elderlyId: 'elderly-3',
    elderlyName: '이영희 (외할머니)',
    title: '검찰 사칭 전화 감지',
    message: '검찰을 사칭한 보이스피싱 시도가 감지되어 자동 경고되었습니다.',
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
    acknowledged: true,
    actionTaken: '경고 후 통화 종료'
  },
  {
    id: 'alert-6',
    type: 'unusual_activity',
    severity: 'low',
    elderlyId: 'elderly-4',
    elderlyName: '박정수 (외할아버지)',
    title: '새로운 기기 접속',
    message: '새로운 스마트폰에서 앱 접속이 감지되었습니다.',
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
    acknowledged: true
  },
  {
    id: 'alert-7',
    type: 'emergency',
    severity: 'high',
    elderlyId: 'elderly-2',
    elderlyName: '김철수 (아버지)',
    title: '긴급 버튼 누름',
    message: '아버지가 긴급 호출 버튼을 눌렀습니다. (테스트로 확인됨)',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    acknowledged: true,
    actionTaken: '통화로 안전 확인'
  },
  {
    id: 'alert-8',
    type: 'voice_phishing',
    severity: 'medium',
    elderlyId: 'elderly-5',
    elderlyName: '최옥순 (이모)',
    title: '택배 사칭 문자 감지',
    message: '택배 사칭 스미싱 문자가 감지되어 경고했습니다.',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    acknowledged: true
  },
  {
    id: 'alert-9',
    type: 'daily_report',
    severity: 'low',
    elderlyId: 'elderly-3',
    elderlyName: '이영희 (외할머니)',
    title: '주간 활동 요약',
    message: '이번 주 바코드 18회, 키오스크 3회, 피싱 차단 0회',
    timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
    acknowledged: true
  },
  {
    id: 'alert-10',
    type: 'voice_phishing',
    severity: 'high',
    elderlyId: 'elderly-1',
    elderlyName: '김순자 (어머니)',
    title: '투자 사기 전화 차단',
    message: '고수익 보장 투자 권유 전화가 감지되어 차단되었습니다.',
    timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
    acknowledged: true,
    actionTaken: '자동 차단'
  }
]

// 읽지 않은 알림 가져오기
export function getUnreadAlerts(): Alert[] {
  return MOCK_ALERTS.filter(a => !a.acknowledged)
}

// 심각도별 알림 필터
export function getAlertsBySeverity(severity: 'low' | 'medium' | 'high'): Alert[] {
  return MOCK_ALERTS.filter(a => a.severity === severity)
}


// ============================================
// 6. 활동 통계 (7일치)
// ============================================

export interface DailyActivity {
  date: string
  dayName: string
  barcodeScans: number
  kioskHelps: number
  phishingBlocks: number
  activeMinutes: number
}

export const MOCK_WEEKLY_ACTIVITIES: DailyActivity[] = [
  { date: '2025-11-26', dayName: '화', barcodeScans: 18, kioskHelps: 4, phishingBlocks: 1, activeMinutes: 45 },
  { date: '2025-11-27', dayName: '수', barcodeScans: 22, kioskHelps: 6, phishingBlocks: 0, activeMinutes: 62 },
  { date: '2025-11-28', dayName: '목', barcodeScans: 15, kioskHelps: 3, phishingBlocks: 2, activeMinutes: 38 },
  { date: '2025-11-29', dayName: '금', barcodeScans: 28, kioskHelps: 8, phishingBlocks: 1, activeMinutes: 75 },
  { date: '2025-11-30', dayName: '토', barcodeScans: 35, kioskHelps: 12, phishingBlocks: 0, activeMinutes: 95 },
  { date: '2025-12-01', dayName: '일', barcodeScans: 20, kioskHelps: 5, phishingBlocks: 1, activeMinutes: 52 },
  { date: '2025-12-02', dayName: '월', barcodeScans: 12, kioskHelps: 3, phishingBlocks: 0, activeMinutes: 28 }
]

// 통계 요약
export function getWeeklyStats(): {
  totalScans: number
  totalKioskHelps: number
  totalPhishingBlocks: number
  avgActiveMinutes: number
  trend: 'up' | 'down' | 'stable'
} {
  const total = MOCK_WEEKLY_ACTIVITIES.reduce((acc, day) => ({
    totalScans: acc.totalScans + day.barcodeScans,
    totalKioskHelps: acc.totalKioskHelps + day.kioskHelps,
    totalPhishingBlocks: acc.totalPhishingBlocks + day.phishingBlocks,
    totalMinutes: acc.totalMinutes + day.activeMinutes
  }), { totalScans: 0, totalKioskHelps: 0, totalPhishingBlocks: 0, totalMinutes: 0 })

  // 최근 3일 vs 이전 4일 비교로 트렌드 계산
  const recent = MOCK_WEEKLY_ACTIVITIES.slice(-3)
  const earlier = MOCK_WEEKLY_ACTIVITIES.slice(0, 4)
  const recentAvg = recent.reduce((sum, d) => sum + d.barcodeScans, 0) / 3
  const earlierAvg = earlier.reduce((sum, d) => sum + d.barcodeScans, 0) / 4

  let trend: 'up' | 'down' | 'stable' = 'stable'
  if (recentAvg > earlierAvg * 1.1) trend = 'up'
  else if (recentAvg < earlierAvg * 0.9) trend = 'down'

  return {
    totalScans: total.totalScans,
    totalKioskHelps: total.totalKioskHelps,
    totalPhishingBlocks: total.totalPhishingBlocks,
    avgActiveMinutes: Math.round(total.totalMinutes / 7),
    trend
  }
}


// ============================================
// 7. 데모 유틸리티 함수
// ============================================

// 데모 모드 시간 포맷
export function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  return `${days}일 전`
}

// 상태에 따른 색상 클래스
export function getStatusColor(status: 'safe' | 'warning' | 'danger'): string {
  switch (status) {
    case 'safe': return 'bg-green-100 text-green-800 border-green-200'
    case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'danger': return 'bg-red-100 text-red-800 border-red-200'
  }
}

// 심각도에 따른 색상 클래스
export function getSeverityColor(severity: 'low' | 'medium' | 'high'): string {
  switch (severity) {
    case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'high': return 'bg-red-100 text-red-800 border-red-200'
  }
}

// 알림 타입에 따른 아이콘 이름
export function getAlertIcon(type: Alert['type']): string {
  switch (type) {
    case 'voice_phishing': return 'Shield'
    case 'unusual_activity': return 'Clock'
    case 'emergency': return 'AlertTriangle'
    case 'daily_report': return 'FileText'
  }
}
