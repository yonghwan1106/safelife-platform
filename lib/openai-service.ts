// OpenAI GPT-4 서비스 - 보이스피싱 감지 및 컨텍스트 분석
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Client-side usage
})

export interface VoicePhishingAnalysis {
  isRisky: boolean
  riskLevel: 'low' | 'medium' | 'high'
  confidence: number // 0-100
  detectedPatterns: string[]
  reasoning: string
  recommendation: string
  suspiciousKeywords: string[]
}

/**
 * GPT-4를 사용한 고급 보이스피싱 분석
 * @param transcript 통화 내용 전사 텍스트
 * @param context 추가 컨텍스트 (발신자 정보 등)
 * @returns 분석 결과
 */
export async function analyzeVoicePhishingWithGPT4(
  transcript: string,
  context?: {
    callerNumber?: string
    duration?: number
    previousTranscripts?: string[]
  }
): Promise<VoicePhishingAnalysis> {
  try {
    const systemPrompt = `당신은 한국의 보이스피싱(전화금융사기) 전문 분석가입니다.
고령자를 보호하기 위해 통화 내용을 분석하고 위험도를 평가합니다.

다음 보이스피싱 유형을 식별하세요:
1. 기관 사칭형 (금융감독원, 경찰, 검찰, 국세청 등)
2. 금융사 사칭형 (은행, 카드사, 보험사)
3. 대출/투자 유혹형
4. 가족/지인 사칭형
5. 택배/쇼핑몰 사칭형
6. 보안프로그램 설치 요구형

위험 신호:
- 계좌번호, 비밀번호, 보안카드 번호 요구
- 긴급성 강조 ("지금 바로", "빨리", "긴급")
- 금융거래 유도 ("송금", "이체", "입금")
- 개인정보 요구 ("주민번호", "카드번호")
- 협박/공포 조장
- 대출/투자 권유
- 보안프로그램 설치 요구
- 통장/카드 양도 요구

응답 형식 (JSON):
{
  "isRisky": boolean,
  "riskLevel": "low" | "medium" | "high",
  "confidence": number (0-100),
  "detectedPatterns": [설명1, 설명2, ...],
  "reasoning": "판단 근거 설명",
  "recommendation": "사용자에게 줄 권고사항",
  "suspiciousKeywords": [의심 키워드들]
}`

    const userPrompt = `
통화 내용:
"${transcript}"

${context?.callerNumber ? `발신 번호: ${context.callerNumber}` : ''}
${context?.duration ? `통화 시간: ${context.duration}초` : ''}
${context?.previousTranscripts && context.previousTranscripts.length > 0
  ? `이전 대화:\n${context.previousTranscripts.join('\n')}`
  : ''}

이 통화가 보이스피싱인지 분석하고 JSON 형식으로 응답해주세요.`

    console.log('Analyzing with GPT-4...')

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // 더 빠르고 저렴한 모델 사용
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3, // 일관된 분석을 위해 낮은 temperature
      max_tokens: 800,
      response_format: { type: 'json_object' }
    })

    const result = response.choices[0].message.content
    if (!result) {
      throw new Error('No response from GPT-4')
    }

    const analysis: VoicePhishingAnalysis = JSON.parse(result)
    console.log('GPT-4 analysis:', analysis)

    return analysis

  } catch (error) {
    console.error('GPT-4 analysis error:', error)

    // Fallback to simple pattern matching
    return fallbackPatternMatching(transcript)
  }
}

/**
 * GPT-4 실패 시 간단한 패턴 매칭 fallback
 */
function fallbackPatternMatching(transcript: string): VoicePhishingAnalysis {
  const text = transcript.toLowerCase()

  // 고위험 패턴
  const highRiskPatterns = [
    { pattern: /(금융감독원|금감원|검찰|경찰청|국세청|법원).*?(계좌|입금|송금|이체)/i, description: '기관 사칭 + 금융거래 요구' },
    { pattern: /(계좌번호|비밀번호|보안카드|카드번호|주민번호).*?(알려|확인|말씀)/i, description: '개인정보 요구' },
    { pattern: /(안전계좌|안심계좌|보호계좌|검찰계좌).*?(이체|입금|송금)/i, description: '안전계좌 사기' },
    { pattern: /(원격|프로그램|설치|다운로드).*?(보안|안전|보호)/i, description: '원격 프로그램 설치 유도' },
  ]

  // 중위험 패턴
  const mediumRiskPatterns = [
    { pattern: /(대출|저금리|빠른|즉시|승인).*?(가능|도와|상담)/i, description: '대출 유혹' },
    { pattern: /(투자|수익|돈|벌|수익률)/i, description: '투자 유혹' },
    { pattern: /(긴급|급히|빨리|지금|즉시).*?(필요|해야|해주)/i, description: '긴급성 강조' },
    { pattern: /(아들|딸|엄마|아빠|가족).*?(사고|사건|문제|체포)/i, description: '가족 사칭' },
  ]

  // 저위험 패턴
  const lowRiskPatterns = [
    { pattern: /(택배|배송|물건).*?(확인|수령)/i, description: '택배 관련' },
    { pattern: /(할인|이벤트|무료|선물)/i, description: '판촉 전화' },
  ]

  const detectedPatterns: string[] = []
  let riskLevel: 'low' | 'medium' | 'high' = 'low'
  const suspiciousKeywords: string[] = []

  // 고위험 패턴 체크
  for (const { pattern, description } of highRiskPatterns) {
    if (pattern.test(text)) {
      detectedPatterns.push(description)
      riskLevel = 'high'
      const matches = text.match(pattern)
      if (matches) suspiciousKeywords.push(...matches.slice(1).filter(Boolean))
    }
  }

  // 중위험 패턴 체크 (고위험이 없을 때만)
  if (riskLevel !== 'high') {
    for (const { pattern, description } of mediumRiskPatterns) {
      if (pattern.test(text)) {
        detectedPatterns.push(description)
        riskLevel = 'medium'
        const matches = text.match(pattern)
        if (matches) suspiciousKeywords.push(...matches.slice(1).filter(Boolean))
      }
    }
  }

  // 저위험 패턴 체크 (고/중위험이 없을 때만)
  if (riskLevel === 'low') {
    for (const { pattern, description } of lowRiskPatterns) {
      if (pattern.test(text)) {
        detectedPatterns.push(description)
        const matches = text.match(pattern)
        if (matches) suspiciousKeywords.push(...matches.slice(1).filter(Boolean))
      }
    }
  }

  const isRisky = detectedPatterns.length > 0

  let recommendation = ''
  if (riskLevel === 'high') {
    recommendation = '즉시 전화를 끊고 112에 신고하세요. 절대 개인정보나 금융정보를 제공하지 마세요.'
  } else if (riskLevel === 'medium') {
    recommendation = '신중하게 대응하세요. 의심스러운 경우 전화를 끊고 공식 번호로 재확인하세요.'
  } else {
    recommendation = '주의가 필요한 단어가 감지되었습니다. 계속 주의하며 대화하세요.'
  }

  return {
    isRisky,
    riskLevel,
    confidence: isRisky ? 70 : 50, // Fallback은 낮은 신뢰도
    detectedPatterns,
    reasoning: detectedPatterns.length > 0
      ? `간단한 패턴 매칭으로 ${detectedPatterns.length}개의 의심 패턴 감지`
      : '의심스러운 패턴이 발견되지 않음',
    recommendation,
    suspiciousKeywords: [...new Set(suspiciousKeywords)]
  }
}

/**
 * 실시간 스트리밍 분석 (연속된 대화에서 컨텍스트 유지)
 */
export async function analyzeVoicePhishingStream(
  currentTranscript: string,
  conversationHistory: string[]
): Promise<VoicePhishingAnalysis> {
  // 전체 대화 내용을 결합하여 분석
  const fullContext = [...conversationHistory, currentTranscript].join('\n')

  return await analyzeVoicePhishingWithGPT4(fullContext, {
    previousTranscripts: conversationHistory
  })
}
