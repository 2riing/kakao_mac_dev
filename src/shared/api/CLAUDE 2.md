# shared/api

도메인 무관 네트워크 인프라. 모든 도메인의 `entities/{X}/api.ts`가 여기를 import.

## 파일 역할

### client.ts
axios 인스턴스. 모든 API 호출 출입구.

- baseURL: `import.meta.env.APP_BASE_URL`
- withCredentials: HttpOnly Cookie 자동 전달
- timeout: 15초 (모바일 LTE 변동 고려한 값. 일반 범위 5~30초)
- 401 응답 → `/login` 리다이렉트 (refresh 미사용. 액세스 토큰 10분 정책)
- `APP_USE_MOCK=true`일 때 매칭 요청에 한해 mock adapter 주입

### envelope.ts
백엔드 응답 표준 형식 타입 + 정상 코드 상수. 동작 코드 없음.

- `Envelope<T>` = `{ resultCode, resultMessage, data: T }`
- `RESULT_CODE_OK = "2000"` — 사내 표준
- 모든 응답이 이 envelope으로 옴 → unwrap 필요

### unwrap.ts
envelope 풀기 + 에러 변환.

- `unwrap<T>(envelope)` — resultCode가 OK면 data 반환, 아니면 `ApiError` throw
- `ApiError` 클래스 — resultCode + message 보존
- 도메인 api.ts에서 응답 받자마자 호출

### queryClient.ts
TanStack Query 전역 QueryClient. `app/providers.tsx`에서 한 번만 주입.

- 기본 옵션: `retry: 1`, `refetchOnWindowFocus: false`, `staleTime: 30초`
- 도메인 hook은 별도 설정 없이 자동 사용

### mock.ts
백엔드 미정합 동안 가짜 응답 분기.

- `getMockResponse(config)` — 요청의 method+url을 매핑 규칙에 맞춰 envelope 감싼 응답 반환
- 매핑 규칙은 9건 (auth, order, reservation) — worker는 order 도메인에 통합
- 백엔드 답 오면 이 파일 + `src/__mocks__/` + client.ts의 USE_MOCK 분기 삭제로 정리

## 신규 파일 추가 기준

이 폴더에 둘 자격:

- 도메인 모름 (특정 도메인 약어·타입 박혀있지 않음)
- 모든 API 호출에 공통 영향 (인터셉터·변환·인프라)

둘 다 YES면 OK. 한 도메인만 쓰면 `entities/{도메인}/api.ts`로.

## 알아둘 점

- env 변수는 `APP_` prefix (vite.config.ts의 `envPrefix` 옵션)
- 빌드 도구 바꾸면 `import.meta.env` 접근 부분만 수정 필요 (직접 접근, 추상화 미사용)
- 사용자 룰: `api.ts`는 외부 노출 X. 도메인 hooks를 통해서만 호출되어야 함 (envelope 처리 누락 방지)
