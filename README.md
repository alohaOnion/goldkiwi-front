# 골드키위 (GoldKiwi)

프리미엄 중고거래 플랫폼

## 📋 프로젝트 소개

골드키위는 사용자 친화적인 인터페이스와 현대적인 디자인을 갖춘 미술용품 중고거래 플랫폼입니다. 안전하고 편리한 거래 환경을 제공하며, 커뮤니티 기능과 유저 랭킹 시스템을 통해 활발한 거래 문화를 만들어갑니다.

## ✨ 주요 기능

- **상품 검색**: 빠르고 정확한 상품 검색 기능
- **카테고리별 분류**: 전자제품, 의류, 가구, 도서, 스포츠 등 다양한 카테고리
- **인기 상품**: 실시간 인기 상품 추천
- **커뮤니티 게시판**: 사용자 간 소통과 정보 공유
- **유저 랭킹**: 활발한 거래 활동을 보여주는 랭킹 시스템
- **로그인/회원가입**: 소셜 로그인 지원 (GitHub, Google)

## 🛠️ 기술 스택

### 프레임워크 & 라이브러리

- **Next.js** 16.1.1 - React 기반 풀스택 프레임워크
- **React** 19.2.3 - UI 라이브러리
- **TypeScript** 5 - 타입 안정성

### 스타일링

- **Tailwind CSS** 4 - 유틸리티 기반 CSS 프레임워크
- **shadcn/ui** - 재사용 가능한 UI 컴포넌트
- **Lucide React** - 아이콘 라이브러리

### 개발 도구

- **ESLint** - 코드 품질 관리
- **PostCSS** - CSS 후처리

## 📦 설치 및 실행

### 필수 요구사항

- Node.js 18 이상
- npm, yarn, pnpm 또는 bun

### 설치

```bash
# 의존성 설치
npm install
# 또는
yarn install
# 또는
pnpm install
```

### 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
```

개발 서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 프로덕션 빌드

```bash
# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 📁 프로젝트 구조

```
goldkiwi-front/
├── app/                    # Next.js App Router
│   ├── [id]/              # 동적 라우트 (상품 상세)
│   ├── login/             # 로그인 페이지
│   ├── globals.css        # 전역 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 메인 페이지
├── components/            # 재사용 가능한 컴포넌트
│   └── ui/               # shadcn/ui 컴포넌트
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib/                   # 유틸리티 함수
│   └── utils.ts
├── public/                # 정적 파일
│   └── images/           # 이미지 리소스
│       └── products/
├── components.json        # shadcn/ui 설정
├── next.config.ts        # Next.js 설정
├── tsconfig.json         # TypeScript 설정
└── package.json          # 프로젝트 의존성
```

## 🎨 디자인 시스템

프로젝트는 다크 테마를 기반으로 하며, 라임-옐로우 그라데이션을 주요 브랜드 컬러로 사용합니다.

- **주요 색상**: 라임-옐로우 그라데이션 (`from-lime-400 to-yellow-400`)
- **배경**: 다크 테마 (`zinc-950`, `black`)
- **카드**: 반투명 배경과 블러 효과 (`backdrop-blur`)

## 🚀 주요 페이지

- **메인 페이지** (`/`): 상품 검색, 카테고리, 인기 상품, 커뮤니티 게시판, 유저 랭킹
- **로그인 페이지** (`/login`): 이메일/비밀번호 로그인 및 소셜 로그인
- **상품 상세** (`/[id]`): 개별 상품 상세 정보

## 📝 스크립트

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm start` - 프로덕션 서버 실행
- `npm run lint` - ESLint 실행

## 🔧 환경 설정

현재 프로젝트는 기본 설정으로 구성되어 있습니다. 필요에 따라 다음 파일들을 수정할 수 있습니다:

- `next.config.ts` - Next.js 설정
- `tsconfig.json` - TypeScript 설정
- `components.json` - shadcn/ui 설정
- `app/globals.css` - 전역 스타일

## 📄 라이선스

이 프로젝트는 비공개 프로젝트입니다.

## 👥 기여

프로젝트 개선을 위한 제안이나 버그 리포트는 이슈로 등록해주세요.

---

© 2025 골드키위. All rights reserved.
