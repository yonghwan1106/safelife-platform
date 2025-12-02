// 식품안전나라 / 공공데이터포털 API 서비스
// API Documentation: https://www.data.go.kr/data/15064775/openapi.do

const API_KEY = process.env.NEXT_PUBLIC_FOOD_SAFETY_API_KEY || 'S1kBo55wOyrX9FdzDMbXL4blXSOj%2BmYuvk2s%2B%2Bw5iTb%2Ba7Uu3NWwqPjz6wv7H0JVRaHn4zM3AAJIHy8rTAiHLw%3D%3D'
const BASE_URL = 'http://openapi.foodsafetykorea.go.kr/api'

// API Response Types
export interface BarcodeProduct {
  PRDLST_REPORT_NO: string      // 품목제조번호
  PRMS_DT: string                 // 허가일자
  LCNS_NO: string                 // 인허가번호
  BSSH_NM: string                 // 업소명
  PRDLST_NM: string               // 제품명
  PRDLST_DCNM: string             // 유형
  RAWMTRL_NM: string              // 원재료명
  BAR_CD: string                  // 바코드
  PRDLST_CL_NM: string            // 품목군
  PRDT_SHAP_CD_NM: string         // 제품형태
  MNFTR_NM: string                // 제조사명
  POG_DAYCNT: string              // 유통기한
  NTQNT: string                   // 내용량
  DISTB_PD: string                // 유통기한
  RAWMTRL_DSR: string             // 원재료상세
}

export interface FoodSafetyApiResponse {
  I2570?: {
    total_count: string
    row?: BarcodeProduct[]
    RESULT: {
      MSG: string
      CODE: string
    }
  }
}

/**
 * 바코드로 제품 정보 조회
 * @param barcode 제품 바코드 번호
 * @returns 제품 정보 또는 null
 */
export async function getProductByBarcode(barcode: string): Promise<BarcodeProduct | null> {
  try {
    // API 엔드포인트 구성
    // http://openapi.foodsafetykorea.go.kr/api/{인증키}/I2570/json/1/5/BRCD_NO={바코드}
    const url = `${BASE_URL}/${API_KEY}/I2570/json/1/5/BAR_CD=${barcode}`

    console.log('Fetching from Food Safety API:', url.replace(API_KEY, 'API_KEY'))

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('Food Safety API error:', response.status, response.statusText)
      return null
    }

    const data: FoodSafetyApiResponse = await response.json()

    // 응답 체크
    if (!data.I2570) {
      console.log('No I2570 data in response')
      return null
    }

    // 에러 응답 체크
    if (data.I2570.RESULT.CODE !== 'INFO-000') {
      console.log('API returned error:', data.I2570.RESULT.MSG)
      return null
    }

    // 결과가 있는지 확인
    if (!data.I2570.row || data.I2570.row.length === 0) {
      console.log('No products found for barcode:', barcode)
      return null
    }

    // 첫 번째 제품 반환
    return data.I2570.row[0]

  } catch (error) {
    console.error('Error fetching from Food Safety API:', error)
    return null
  }
}

/**
 * 제품명으로 검색
 * @param productName 제품명
 * @param startIdx 시작 인덱스 (기본값: 1)
 * @param endIdx 종료 인덱스 (기본값: 10)
 * @returns 제품 목록
 */
export async function searchProductsByName(
  productName: string,
  startIdx: number = 1,
  endIdx: number = 10
): Promise<BarcodeProduct[]> {
  try {
    // URL 인코딩
    const encodedName = encodeURIComponent(productName)
    const url = `${BASE_URL}/${API_KEY}/I2570/json/${startIdx}/${endIdx}/PRDLST_NM=${encodedName}`

    console.log('Searching products by name:', productName)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('Food Safety API error:', response.status, response.statusText)
      return []
    }

    const data: FoodSafetyApiResponse = await response.json()

    if (!data.I2570 || !data.I2570.row) {
      return []
    }

    return data.I2570.row

  } catch (error) {
    console.error('Error searching products:', error)
    return []
  }
}

/**
 * BarcodeProduct를 ProductInfo 형식으로 변환
 */
export function convertToProductInfo(product: BarcodeProduct) {
  // 원재료명 파싱
  const ingredients = product.RAWMTRL_NM
    ? product.RAWMTRL_NM.split(',').map(i => i.trim())
    : []

  // 알레르기 유발 성분 추출 (원재료명에서 찾기)
  const allergenKeywords = ['밀', '대두', '땅콩', '호두', '계란', '우유', '새우', '게', '돼지고기', '쇠고기', '닭고기', '오징어', '고등어', '조개', '복숭아', '토마토']
  const allergens: string[] = []

  const rawMaterialText = product.RAWMTRL_NM?.toLowerCase() || ''
  allergenKeywords.forEach(keyword => {
    if (rawMaterialText.includes(keyword)) {
      allergens.push(keyword)
    }
  })

  return {
    code: product.BAR_CD,
    name: product.PRDLST_NM || '제품명 정보 없음',
    manufacturer: product.BSSH_NM || product.MNFTR_NM || '제조사 정보 없음',
    ingredients,
    allergens,
    warnings: product.POG_DAYCNT
      ? [`유통기한: ${product.POG_DAYCNT}일`]
      : [],
    category: product.PRDLST_CL_NM || '',
    description: product.PRDLST_DCNM || '',
    volume: product.NTQNT || ''
  }
}
