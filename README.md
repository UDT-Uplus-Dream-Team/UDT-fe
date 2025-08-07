
# 🌌 반딧불 - OTT 콘텐츠 추천 서비스 (Front-end Repository)

> “어둠 속, 반딧불 하나의 빛으로.  
> 수많은 OTT 콘텐츠 숲을 단숨에 환히 밝히는 당신만의 가이드.”

---

## 🧭 프로젝트 개요

### 📌 기획 배경
 
OTT 콘텐츠가 넘쳐나는 시대, 아직도 “무엇을 볼지” 30분씩 고민하고 계신가요? <br>
**반딧불**은 사용자 취향을 바탕으로 빠른 시간 안에 나만을 위한 콘텐츠를 추천해주는,
직관적이고 사용자 친화적인 콘텐츠 큐레이션 서비스입니다.

- **콘텐츠 과잉**: OTT 서비스에 쏟아지는 수많은 콘텐츠로 선택 피로도 급증 (평균 탐색 시간 10~20분)
- **구독 플랫폼 분산**: 여러 OTT를 동시에 사용하는 사용자 증가, 통합 탐색의 어려움
- **피드백 부재**: 사용자 선호를 적극 반영하지 못해 추천의 정밀도가 낮음

### 🎯 서비스 목표

- **스와이프 기반 인터랙션**으로 콘텐츠 피드백 수집
- **실시간 개인화 추천**을 통해 탐색 시간 단축
- **구독 중인 OTT 우선 추천** + **발견 기반 큐레이션**
- **초반에 설문을 통해 얻은 정보로 cold-start 해결** + **빠른 리롤링 캐싱 전략**


###  📁 프로젝트 구조
```
🌌 UDT-fe/
├── 📂 .github/                     # GitHub 워크플로우 및 템플릿(CI/CD, Jira PR 처리 등 포함)
├── 📂 public/                      # 정적 자산
│   ├── icons/                      # 아이콘 파일들
│   └── images/                     # 이미지 자산
├── 📂 src/                        
│   ├── 📂 app/                     
│   │   ├── 📂 profile/             # 👤 마이페이지 & 사용자 관리
│   │   ├── 📂 explore/             # 🖥️ OTT 플랫폼과 같은 컨텐츠 찾아보기
│   │   ├── 📂 onboarding/          # 🎯 온보딩 튜토리얼 페이지
│   │   ├── 📂 recommend/           # 🎪 메인 추천 스와이프 페이지
│   │   ├── 📂 survey/              # 📊 초기 설문조사 페이지
│   │   ├── layout.tsx              # 루트 레이아웃
│   │   ├── globals.css             # 전역 스타일
│   │   └── page.tsx                # 로그인 페이지
│   ├── 📂 components/              # 재사용 가능한 UI 컴포넌트
│   │   ├── 📂 common/              # 🔄 공통 컴포넌트(Navbar, Toast)
│   │   ├── 📂 explore/             # 🖥️ 컨텐츠 둘러보기 관련 컴포넌트
│   │   ├── 📂 profile/             # 👤 마이페이지 관련 컴포넌트
│   │   ├── 📂 recommend/           # 🎪 추천 시스템 전용 컴포넌트
│   │   ├── 📂 survey/              # 📊 설문조사 전용 컴포넌트
│   │   └── 📂 ui/                  # 🎨 shadcn/ui 기반 기본 컴포넌트
│   ├── 📂 hooks/                   # Tanstack query 활용 상태 관리에 사용되는 custom Hook들
│   ├── 📂 lib/                     # 유틸리티 함수 및 설정
│   │   ├── 📂 apis/                # API 통신 관련 함수들
│   │   ├── 📂 store/               # Zustand 전역 상태 관리
│   │   ├── 📂 utils/               # 공통 유틸리티 함수
│   ├── 📂 types/                   # TypeScript 타입 정의
│   └── 📂 stories/                 # Storybook 컴포넌트 문서화
```

---

## 플로우 차트

<img width="4528" height="2384" alt="융합 프로젝트 4조 chart" src="https://github.com/user-attachments/assets/a9cd3998-5b16-44b3-8882-7ea22455e0f2" />

---

## 🚀 로컬 개발 환경 설정

### 필수 요구사항
- Node.js 18.17.0 이상
- npm 또는 yarn 패키지 매니저

## 🛠️ 로컬 개발 환경 실행 방법

### 1. 패키지 설치

```bash
npm install
````

#### 2.1 mkcert 설치 및 SSL 인증서 생성

**macOS (Homebrew):**
```bash
# mkcert 설치
brew install mkcert
brew install nss # Firefox 사용 시

# 로컬 인증 기관(CA) 생성 및 시스템에 설치
mkcert -install

# localhost와 local.banditbool.com 도메인용 인증서 생성
mkcert localhost local.banditbool.com 127.0.0.1 ::1

### 3. 실행 방법

#### 3.1 개발 환경 실행

```bash
npm run dev:https
```

**Windows (Chocolatey):**
```bash
# mkcert 설치
choco install mkcert

# 로컬 인증 기관(CA) 생성 및 시스템에 설치
mkcert -install

# localhost와 local.banditbool.com 도메인용 인증서 생성
mkcert localhost local.banditbool.com 127.0.0.1 ::1
```

#### 2.2 인증서 배치(위치 변경 및 이름 변경)
```
프로젝트루트/
├── localhost+3.pem        # SSL 인증서
├── localhost+3-key.pem    # 개인키
└── ... (기타 프로젝트 파일들)
```


### 3. 실행 방법

#### 3.1 개발 환경 실행

```bash
npm run dev:https
```

#### 3.2 프로덕션 빌드 및 실행

```bash
npm run build
```

#### 3.3 테스트 진행(선택)

```bash
#서버를 킨 상태에서 
npm run test
```

### 3. 접속

아래 주소로 접속:
[http://local.banditbool.com:3000](http://local.banditbool.com:3000)

## 🌐 배포 주소

### 🚀 프로덕션 환경
- **메인 서비스**: `www.banditbool.com`
> 서비스 로그인을 위해 카카오 계정이 필요합니다.

### 📱 접속 안내
- **권장 브라우저**: Chrome, Safari, Edge 최신 버전
- **모바일 최적화**: iOS Safari, Android Chrome 지원
- **반응형 디자인**: 데스크탑, 태블릿, 모바일 모든 디바이스 대응

> ⚠️ **주의사항**
>> 모바일 환경의 경우 375*667px 이하의 뷰포트를 가진 기기의 경우 일부 화면에서 사용에 불편함이 있을 수 있습니다.

---

## 🖥️ 주요 화면 및 기능

### 1. 설문조사 페이지 (`/survey`)
> 사용자의 취향을 파악하기 위한 설문이 진행되는 화면입니다.
- 구독 중인 OTT 서비스 선택
- 선호 장르(최대 3개) 선택
- Survey 완료 전 이탈 시 → 임시회원 처리 및 재접속 유도
- Survey 완료 시 → 일반회원 전환 후 메인 페이지 진입

<img width="360" height="778" alt="image" src="https://github.com/user-attachments/assets/c4a3c451-eaf0-4783-86bc-71b4ec0e48b6" />
<img width="360" height="778" alt="image" src="https://github.com/user-attachments/assets/4d8cb293-3383-496e-a91e-a60a2f49c16e" />


### 2. 온보딩 페이지 (`/onboarding`)
> 서비스 이용 방법과 스와이프 인터랙션을 튜토리얼로 안내하는 페이지입니다.
- 스와이프 인터랙션 튜토리얼
- 추천 시스템 및 사용 방식 설명
- 모든 튜토리얼 완료 시 → 메인 페이지 진입
- 튜토리얼에서의 스와이프 액션은 체험으로, 컨텐츠에 대해 제공하는 피드백으로 취급되지 않습니다.
- 메인 페이지 시작 화면에서 ? 버튼을 누르면 다시 튜토리얼을 진행할 수 있습니다.

https://github.com/user-attachments/assets/f9969c2d-2a04-4864-9a63-89c041da69e0


### 3. 빠른 콘텐츠 추천 페이지 (`/recommend`)
> 스와이프 기반의 인터랙션으로 실시간 콘텐츠 추천 및 피드백을 제공하는 메인 페이지입니다.
- 카드 기반 릴스 UI로 콘텐츠 추천
  - 오른쪽 스와이프: 좋아요
  - 왼쪽 스와이프: 싫어요
  - 넘기기: 관심 없음
- **스와이프를 통한 피드백 진행 경과**에 따라 엄선된 결과 추천 페이지 트리거
- 엄선된 추천 결과가 준비되면 토스트 알림(최대 2회)
- 토스트를 수락하면 **엄선된 컨텐츠**로 트리거되며, 거절 시 진행 게이지 바가 초기화 됩니다.
- 2번 거절 후 다시 진행 게이지 바를 채울 경우, 엄선된 컨텐츠 보러 가기 혹은 처음부터 다시 컨텐츠 추천 받기로 진행됩니다. 
- 추천 결과는 한 번씩 리롫이 가능하며, 각 컨텐츠의 상세 정보 조회 및 저장 가능

https://github.com/user-attachments/assets/8272de5c-2d44-4654-a334-56df89b4f474

### 4. 마이페이지 (`/mypage`)
> 나의 선호, 구독 현황, 추천 및 활동 이력을 한 눈에 관리할 수 있는 개인화 페이지입니다.
- 사용자 정보, OTT 구독 현황, 선호 장르 수정 가능
- 좋아요/싫어요한 콘텐츠 및 추천 내역 조회 가능
- 불필요한 콘텐츠 이력 삭제 가능
- 콘텐츠 상세 조회 가능 (탭 → 카드 확장)

https://github.com/user-attachments/assets/ea4ddad5-b91d-453d-acc8-08fc9f1ea69c

https://github.com/user-attachments/assets/4d399b28-f4c9-44a6-bd8d-74f881309bb3


### 5. 리스트 페이지 (`/explore`)
> 전체 콘텐츠를 필터링·검색하고 상세 정보를 확인할 수 있는 콘텐츠 탐색 페이지입니다.
- DB 전체 콘텐츠 필터링 및 검색
- 콘텐츠 상세 조회 제공(출연진, 줄거리, 트레일러 동영상, 지원 플랫폼 등)
- 인기 컨텐츠, 플랫폼 별 추천 컨텐츠, 요일 별 추천 컨텐츠 조회 가능
- 상세 조회에서 해당 콘텐츠를 서비스하는 OTT로의 바로가기 지원

https://github.com/user-attachments/assets/c399b362-cafd-4503-a772-63abbf15b038

https://github.com/user-attachments/assets/591d4065-c45b-446f-ba4c-d041a295e808

## 🧱 기술 스택

### 💻 Frontend

| 기술                          | 설명                                         |
| ----------------------------- | -------------------------------------------- |
| **TypeScript**                | 정적 타입으로 안정적인 협업 지원             |
| **React 19**                  | 컴포넌트 기반 UI, CSR 중심                   |
| **Next.js 15 (App Router)**   | SEO 대응 및 API Route, 이미지 최적화         |
| **Tailwind CSS + shadcn/ui**  | 유틸리티 퍼스트 CSS, 접근성 높은 UI 컴포넌트 |
| **Zustand**                   | 로컬 전역 상태 관리                          |
| **Tanstack Query + Axios**    | 서버 상태 캐싱 및 API 통신                   |
| **Storybook**                 | 컴포넌트 문서화 및 시각 테스트               |
| **ESLint + Prettier + Husky** | 코드 스타일 및 커밋 전 검사 자동화           |
| **PlayWright**                | 브라우저 환경에서 자동 테스팅            |

