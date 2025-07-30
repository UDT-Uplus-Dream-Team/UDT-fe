
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

---

## 플로우 차트

<img width="4528" height="2384" alt="융합 프로젝트 4조 chart" src="https://github.com/user-attachments/assets/a9cd3998-5b16-44b3-8882-7ea22455e0f2" />

---

## 🖥️ 주요 화면 및 기능

### 1. 설문조사 페이지 (`/survey`)
> 사용자의 취향을 파악하기 위한 설문 진행 및 결과 기반 맞춤 추천이 시작되는 첫 화면입니다.
- OTT 구독 서비스 선택
- 선호 장르 선택
- 관련 콘텐츠 리스트업 (회원들의 좋아요/싫어요 기반 정렬)
- Survey 완료 전 이탈 시 → 임시회원 처리 및 재접속 유도
- Survey 완료 시 → 일반회원 전환 후 메인 페이지 진입

<img width="300" height="778" alt="image" src="https://github.com/user-attachments/assets/ac8ce252-743b-4ee6-966b-90d4f13d6c7c" />
<img width="300" height="778" alt="image" src="https://github.com/user-attachments/assets/1f0cc4dd-b062-43e7-a21f-823aa4707459" />

### 2. 온보딩 페이지 (`/onboarding`)
> 서비스 이용 방법과 스와이프 인터랙션을 튜토리얼로 안내하는 페이지입니다.
- 스와이프 인터랙션 튜토리얼
- 추천 시스템 및 사용 방식 설명
- 모든 튜토리얼 완료 시 → 메인 페이지 진입

https://github.com/user-attachments/assets/f72a8e93-0234-4d8f-81cc-bc89ee466c19

https://github.com/user-attachments/assets/62a24579-3ecd-4d47-9bae-574e67a85192



### 3. 빠른 콘텐츠 추천 페이지 (`/recommend`)
> 스와이프 기반의 인터랙션으로 실시간 콘텐츠 추천 및 피드백을 제공하는 메인 페이지입니다.
- 카드 기반 릴스 UI로 콘텐츠 추천
  - 오른쪽 스와이프: 좋아요
  - 왼쪽 스와이프: 싫어요
  - 넘기기: 관심 없음
- **스와이프를 통한 피드백 진행 경과**에 따라 엄선된 결과 추천 페이지 트리거
- 엄선된 추천 결과가 준비되면 토스트 알림
- 추천 결과는 한 번씩 리롫이 가능하며, 각 컨텐츠의 상세 정보 조회 및 저장 가능


https://github.com/user-attachments/assets/a630cfd4-4dd1-4d9f-b8a6-7b9defb66c9b

https://github.com/user-attachments/assets/783100d6-4069-4b64-91e7-d955b226acfb



### 4. 마이페이지 (`/mypage`)
> 나의 선호, 구독 현황, 추천 및 활동 이력을 한 눈에 관리할 수 있는 개인화 페이지입니다.
- 사용자 정보, OTT 구독 현황, 선호 장르 수정 가능
- 좋아요/싫어요한 콘텐츠 및 추천 내역 조회 가능
- 불필요한 콘텐츠 이력 삭제 가능
- 콘텐츠 상세 조회 가능 (탭 → 카드 확장)

https://github.com/user-attachments/assets/ea4ddad5-b91d-453d-acc8-08fc9f1ea69c

https://github.com/user-attachments/assets/4d399b28-f4c9-44a6-bd8d-74f881309bb3


### 5. 리스트 페이지 (`/list`)
> 전체 콘텐츠를 필터링·검색하고 상세 정보를 확인할 수 있는 콘텐츠 탐색 페이지입니다.
- DB 전체 콘텐츠 필터링 및 검색
- 콘텐츠 상세 조회 제공
- 상세 조회에서 해당 콘텐츠를 서비스하는 OTT로의 바로가기 지원

https://github.com/user-attachments/assets/c399b362-cafd-4503-a772-63abbf15b038

https://github.com/user-attachments/assets/591d4065-c45b-446f-ba4c-d041a295e808


### 6. 백오피스 페이지 (`/admin`)
> 콘텐츠 및 통계를 효율적으로 관리할 수 있는 관리자 전용 백오피스 페이지입니다.
- 등록된 전체 콘텐츠 리스트 조회
- 콘텐츠 장르 기반 필터링
- 개별 콘텐츠 등록, 수정, 삭제 가능
- 콘텐츠 카드 클릭 시 모달 형태로 상세 정보 조회

<img width="800" height="921" alt="image" src="https://github.com/user-attachments/assets/365dc320-c791-410f-bf64-b9c5a60d915d" />

---

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
