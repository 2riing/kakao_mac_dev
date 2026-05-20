# src/

## TypeScript + Vite 타입 설정

`import.meta.env`·`*.css` 등 Vite 전용 문법의 타입은 `tsconfig.app.json`의 `compilerOptions.types: ["vite/client"]` 에서 끌어옴.

Vite 공식 표준은 `src/vite-env.d.ts` 파일에 `/// <reference types="vite/client" />` 거는 방식이지만, 사내 컨벤션 통일을 위해 tsconfig 방식 채택. 그래서 이 폴더에 `vite-env.d.ts` 없음.

## 동작 결과

- 빌드: tsc + vite 둘 다 통과 (vite/client 타입 로드됨)
- `import "*.css"`, `import "*.svg"` 등 Vite 전용 import 정상 인식
- `import.meta.env.VITE_*` 는 `any`로 처리됨 — 자동완성 없음, 오타 검출 안 됨

## env 변수 자동완성이 필요해지면

`src/vite-env.d.ts` 다시 만들고 `ImportMetaEnv` 인터페이스 확장 추가:

```ts
interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_USE_MOCK?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

reference 줄(`/// <reference types="vite/client" />`)은 tsconfig에서 이미 처리하므로 생략.

## 관련 파일

- `tsconfig.app.json` — `types: ["vite/client"]`
- `vite.config.ts` — `envPrefix` 미지정 (Vite 기본 `VITE_` 사용)
- `.env.development` / `.env.production` / `.env.example`
- `src/shared/api/client.ts` — `import.meta.env.VITE_*` 사용처
