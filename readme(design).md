# 디자인 — oss-customer-kakao-web

카카오 알림톡 진입 → KT 서비스 안내 웹뷰. 5~10분 단발 진입에 맞춘 간결한 모바일 UI.

## 철학

- 한 페이지 = 하나의 의도. 흐름 분기는 stage state로 (별도 라우트 분리 지양)
- 카카오톡 인앱브라우저(iOS·Android) 양쪽 동작 보장이 모든 결정의 1순위
- 시안 mockup → 그대로 구현 (재해석 최소화)
- 외부 의존 최소 (라이브러리 추가 금지)
- "충분히 작은 흔들림도 없는" 화면. 페이지 시각적 안정이 카카오 인앱 신뢰성

## 토큰

색은 @theme 토큰만 (text-kt-red). 임의 hex 금지.

- 브랜드: kt-red / kt-red-dark / kt-red-light / kt-red-border
- 텍스트: kt-ink / kt-gray-{100~700} / kt-border
- 상태: kt-success / kt-warn / kt-warn-urgent
- 외부: kakao-yellow

폰트는 Noto Sans KR + system fallback.

## 스타일

- Tailwind only. 인라인 style 사용 금지
- 미세 수치는 arbitrary value 허용 (mb-[11px], pt-[18px])
- keyframes는 global.css에 정의 후 클래스로 적용

## 레이아웃

- ScreenContainer: max-w-[480px] + h-dvh + flex flex-col
- 본문: flex-1 + overflow-y-auto
- BottomFixedBar: flex 자식 (shrink-0). absolute 금지
- safe-area는 BottomFixedBar 자체 padding으로 흡수

## 모바일 웹뷰 락다운 (global.css)

- overscroll-behavior: none — iOS 바운스 + pull-to-refresh 차단
- scrollbar-gutter: stable — 모달 open/close 시 가로 점프 차단
- -webkit-text-size-adjust: 100% — iOS 자동확대 차단
- -webkit-tap-highlight-color: transparent — 탭 회색 박스 제거
- -webkit-touch-callout: none — 길게 누름 콜아웃 차단
- touch-action: manipulation — 더블탭 줌 차단

## 컴포넌트

- shared/ui — 도메인 모르는 원자 컴포넌트 (단일 .tsx, 인덱스 폴더 사용 안 함)
- components/{도메인} — 도메인 종속 UI
- 외부 링크는 window.open(url, "_blank", "noopener,noreferrer")
- 전화는 `<a href="tel:100">`

## 시안

- docs/mockup/ — 원본 HTML/PNG 시안. 새 페이지 들어가기 전 확인
