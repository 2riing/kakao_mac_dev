# 목업 프로젝트 이식 가이드

이 프로젝트(oss-customer-kakao-web)를 사내 목업 프로젝트에 이식하기 위한 작업 가이드.
목업: React + Vite, 동일 기술스택, 사내 배포 파이프라인에 이미 연결됨(테스트 서버).
이식 끝나면 이 파일 삭제.


## 0. 핵심 한 줄

목업 = "배포 연결까지 끝난 빈 집", 이 프로젝트 = "채워 넣을 내용물".
집 주소·배선(배포설정)은 목업 걸 살리고, 내용물(src + 받침대 설정)만 이 프로젝트 걸 넣는다.
"src만" 넣으면 안 됨 — src를 받쳐주는 설정(alias/tailwind/진입점)을 같이 챙겨야 함.


## 1. 먼저 목업에서 확인할 것 (아침에 제일 먼저)

목업 레포 루트에서:

    ls -a
    cat vite.config.ts        # 있으면 resolve.alias 부분
    cat tsconfig.app.json     # paths 부분
    ls src/                   # 폴더 구조
    cat Dockerfile            # 있으면
    ls .github/workflows/     # 있으면 그 안 .yml

확인 목적 4가지:
- (A) vite.config.ts 있나? 있으면 resolve.alias에 @entities 등이 있나?
- (B) tsconfig.app.json paths에 alias 정의 있나?
- (C) 배포 방식 (.github/workflows = GitHub Actions / Dockerfile = Docker)
- (D) env 주입 지점 (VITE_BASE_URL을 어디서 넣나)


## 2. 확인 결과별 분기 (alias가 이식 난이도를 정함)

가장 중요. 목업의 alias 상태에 따라 작업량이 완전히 갈림.

경우 1) 목업에 vite.config 있고 alias(@entities 등)가 이 프로젝트와 동일
  -> 가장 쉬움. src/ 통째로 넣으면 import 바로 작동.

경우 2) 목업에 vite.config 없거나 alias가 없음
  -> 이 프로젝트의 vite.config.ts + tsconfig.app.json paths를 목업에 넣어주면 됨.
     (단 목업에 기존 vite.config가 있으면 배포 관련 설정은 보존하고 alias만 병합)

경우 3) 목업이 alias를 "제거"하고 상대경로로 바꿔서 배포함
  -> 가장 큰 작업. 이 프로젝트의 모든 @entities/@shared/@pages/@components/@app import를
     상대경로로 변환해야 함. 이 경우 작업 전에 다시 상의할 것.

판단법: 목업 vite.config의 resolve.alias를 보면 1/2, 없으면 2,
        그분이 "alias 빼고 상대경로로 바꿨다"고 하면 3.
        가장 빠른 확인: 목업 만진 분께 "alias 어떻게 하셨어요? src 넣으면 @entities import 되나요?" 한마디.


## 3. 이식 체크리스트 (src 넣을 때 같이 챙길 받침대)

순서대로:

1. src/ 통째로 복사
   - 목업의 빈 src를 이 프로젝트 src로 대체
   - alias가 전부 ./src/* 기준이라 src 구조가 그대로 따라가면 alias 작동

2. 의존성 — 확인 완료, 손댈 것 거의 없음
   - 이 프로젝트 package.json은 애초에 목업에서 복사해 시작했고,
     런타임 deps(@tanstack/react-query, axios, react, react-dom, react-router, zustand)가 동일함을 확인함
   - 버전만 minor 차이(^ 캐럿이라 호환). 혹시 목업이 더 낮으면 npm install로 맞춤

3. path alias — 두 군데 다 (경우 2일 때)
   - vite.config.ts의 resolve.alias:
       @app -> ./src/app
       @pages -> ./src/pages
       @components -> ./src/components
       @entities -> ./src/entities
       @shared -> ./src/shared
   - tsconfig.app.json의 paths (위와 동일하게 /* 형태):
       "@app/*": ["./src/app/*"], "@pages/*": ["./src/pages/*"], ...
   - 주의: 둘 중 하나만 하면 안 됨.
     vite alias = 실제 빌드 시 경로 해소 / tsconfig paths = 타입체크용.
     목업 alias 배포 문제가 보통 이 둘 중 하나만 설정해서 생김.

4. Tailwind (안 하면 디자인 전부 깨짐)
   - vite.config.ts에 @tailwindcss/vite 플러그인 등록
   - src/shared/styles/global.css 가져가기 (kt-red, kt-ink 등 커스텀 색 토큰이 여기 있음)
   - 진입점(main.tsx)에서 global.css import 되어 있는지 확인

5. 진입점
   - src/app/main.tsx (이 프로젝트 진입점)
   - index.html (목업 거 쓰되 script src가 main.tsx 가리키는지)

6. env (테스트 서버 연동)
   - VITE_BASE_URL = 테스트 서버 API 주소  (현재 .env.production은 api.example.com placeholder임. 실주소로 교체 필수)
   - VITE_USE_MOCK = false  (production 빌드는 기본 false라 안 넣어도 됨)
   - 주의: 빌드타임 변수라 빌드 시점에 들어가야 함. 배포 파이프라인 env 주입 지점(2번 D)에 설정

7. 빼고 갈 것 (목업엔 테스트 라이브러리 없음)
   - tests/ 폴더, playwright.config.ts
   - 테스트 devDependencies: @playwright/test, vitest, @testing-library/*, msw, jsdom
   - (선택) __mocks__/ + src/shared/api/mock.ts + client.ts의 USE_MOCK 분기
     -> 실 서버 연동이지만 VITE_USE_MOCK=false면 안 돌아서 일단 둬도 무해.
        깔끔하게 정리하려면 셋 다 제거 (client.ts의 if(USE_MOCK) 블록 + import 포함)


## 4. 배포 설정 (거의 안 건드림)

목업이 이미 배포되고 있으면 파이프라인(자동 공장 라인)은 그대로 두고 내용물만 교체.
그 라인이 가정하는 게 이 프로젝트와 맞는지만 확인:
- 빌드 명령: npm run build  (이 프로젝트도 동일: tsc -b && vite build)
- 결과물 경로: dist/  (이 프로젝트도 동일)
- env 주입 지점: VITE_BASE_URL을 GitHub Actions secrets/env 또는 Dockerfile ARG/ENV로
  -> 여기가 테스트 서버 주소 넣는 곳

1·2번 같으니 사실상 env 주입 지점만 맞추면 됨.


## 5. 검증 (이식 후)

    npm install        # 의존성 맞춤
    npm run build      # tsc + vite build 통과하는지 (alias 안 맞으면 여기서 깨짐)
    npm run preview    # 로컬에서 프로덕션 빌드 확인

build에서 "@entities를 못 찾겠다" 류 에러 나면 -> alias 설정(3번) 누락. vite.config와 tsconfig 둘 다 확인.


## 6. 이식과 무관, 테스트 중 확인할 알려진 정합 이슈

이식해서 배포되면 화면에 이렇게 보일 텐데, 버그처럼 보여도 "백엔드 정합 대기" 항목임:

1. 작업 종류가 전부 "인터넷"으로 표시됨
   - 원인: spotWorkTypeCode 코드("1","2","3")의 의미가 미정.
     src/components/order/OrderInfoCard.tsx의 getCategory가 "TV"/"PHONE" 문자열 prefix를 기대하는데
     백엔드는 정수 코드를 줘서 전부 INTERNET fallback으로 떨어짐.
   - 해결: 테스트 서버에서 실제 spotWorkTypeCode 값별 의미 확인(1=?, 2=?, 3=?) -> getCategory 재작성.
     코드사전 받아오면 수정은 금방.

2. 방문 시간 표시
   - src/shared/lib/formatters.ts에 TODO: 백엔드 시간 필드(시작/끝 분리, timezone) 확정 대기


## 7. 참고 (이 프로젝트 현재 상태)

- 빌드/lint/e2e 전부 통과 상태
- 5계층 구조: app / pages / components / entities / shared
- 핵심 플로우: 카카오 진입 -> OTP 인증(AuthGuard) -> 예약 조회(청약상세)/변경
- 에러 처리: TanStack Query throwOnError -> ErrorBoundary 일괄 (조회 에러)
              / mutation onError -> navigate (변경 실패 등)
- help, 예약확정(confirm) 페이지는 1차 범위 아님 (confirm은 라우터에서 주석 처리됨)


## 다음 단계 (내일)

1. 위 1번대로 목업 vite.config / tsconfig / 배포설정 확인
2. 경우 1/2/3 중 어디인지 판단 (또는 만진 분께 alias 한마디 질문)
3. 경우 3(상대경로 전환)이면 작업 전 상의
4. 경우 1/2면 3번 체크리스트대로 진행 후 5번 검증
5. 막히면 목업 vite.config/tsconfig/Dockerfile 내용 가져와서 물어보기
