모바일 청첩장 SaaS — 구현 계획 (MVP 우선)
====================================================

## Context

신랑신부가 직접 가입해 모바일 청첩장을 만들고 편집하는 셀프 빌더(B2C SaaS)와,
하객이 링크로 여는 게스트 공개 페이지를 구축한다.

- 대상: 여러 커플이 가입하는 SaaS (멀티테넌시·보안 설계)
- 출시 범위: MVP 먼저 → 핵심 섹션·기능만으로 발행 가능 상태까지
- 인증: 카카오 + 이메일 (Supabase Auth)
- 결제: 이번엔 없음, 추후 추가 가능하게 데이터/구조만 준비

**뷰포트 전략:**
- 모든 모바일 해상도(320px~430px+) 지원
- PC에서는 max-width 430px 컨테이너를 화면 중앙에 배치 (완전 반응형 사이트 아님)


## 기술 스택

- Next.js 15 (App Router) + TypeScript + React
- Tailwind CSS
- Supabase — Postgres + Auth(이메일 + 카카오) + Storage(이미지) + RLS(멀티테넌시)
- Prisma — ORM/마이그레이션
- 카카오 SDK — Kakao Maps(지도/길찾기), 카카오톡 공유
- 배포: Vercel + Supabase(매니지드)


## 범위 구분

### ✅ MVP (Phase 1)

**게스트 섹션:**
1. Cover — 메인 사진, 신랑·신부 이름, 일시/장소 요약
2. Greeting — 인사말
3. CeremonyInfo — 날짜/시간/장소 상세 + D-day
4. MapDirections — 카카오 지도 + 길찾기 버튼(카카오내비/티맵/네이버지도)
5. Accounts — 마음 전하실 곳(아코디언 + 계좌번호 복사)
6. Rsvp — 참석 의사/측/인원/식사/메시지 입력
7. ShareBar — 카카오톡 공유 + 링크 복사

**빌더(MVP):** Dashboard(목록/생성/공개링크 복사) + Editor(섹션 폼 + 이미지 업로드 + 실시간 미리보기) + 발행(slug). 템플릿 1종.

**인증(MVP):** 카카오 + 이메일 로그인, 보호 라우트.

### ⏭ Phase 2
- Gallery(그리드 + 라이트박스/스와이프), Guestbook(작성/목록/비번 삭제), BgmPlayer(floating)
- 두 번째 테마, options 토글 UI 고도화

### ⏭ Phase 3
- 결제/요금제 (PG 연동), AI 인사말/사진 보정


## 아키텍처

```
app/
  (builder)/
    dashboard/page.tsx       # 내 청첩장 목록 + 새로 만들기
    editor/[id]/page.tsx     # 섹션 폼 + 실시간 미리보기
  i/[slug]/page.tsx          # 게스트 공개 페이지 (SSR)
    opengraph-image.tsx      # 카카오/링크 공유 미리보기
  login/page.tsx
  auth/callback/route.ts
  api/rsvp/route.ts
  layout.tsx
components/
  builder/                   # 폼 섹션, 이미지 업로더
    sections/
  invitation/                # 게스트 섹션 (빌더 미리보기와 공유 = 단일 소스)
  templates/                 # 테마
  ui/                        # Toast 등 공용 UI
lib/
  supabase/                  # 클라/서버/어드민 클라이언트
  prisma.ts
  kakao.ts                   # 지도/공유 헬퍼
  auth.ts                    # getSessionUser
  rate-limit.ts
prisma/schema.prisma
middleware.ts
```


## 데이터 모델 (Prisma)

- **User** — Supabase auth id 매핑. plan 필드(free|paid, 기본 free)
- **Invitation** — id, slug(unique), ownerId, templateId, status(draft|published), 신랑/신부 정보, 예식 정보, 인사말, coverImageUrl, bgmUrl, options(JSON)
- **GalleryImage** — invitationId, url, sortOrder (모델만, UI는 Phase 2)
- **Account** — invitationId, side, role, bank, number, holder, kakaopayUrl
- **Rsvp** — invitationId, side, name, attending, headcount, mealYn, message
- **GuestbookEntry** — invitationId, name, passwordHash, message (모델만, UI는 Phase 2)


## SaaS 보안/멀티테넌시

- Supabase RLS: Invitation 등 소유자(ownerId = auth.uid())만 read/write
- 게스트 공개 페이지는 published 한정 public SELECT
- 빌더 서버 액션은 항상 ownerId 검증
- Slug: nanoid(10) 기본 + 사용자 커스텀 + 중복 검사
- Rate limit: RSVP 등 비로그인 쓰기에 IP 기반 제한


## 구현 순서

### Step 1: 스캐폴드 & 인프라
- Next.js 15 앱 생성 (TS, Tailwind, ESLint)
- 의존성: prisma, @prisma/client, @supabase/supabase-js, @supabase/ssr, nanoid, bcryptjs
- `.env.example` (SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY, KAKAO_JS_KEY, DATABASE_URL, DIRECT_URL)
- `app/globals.css` — invitation-shell: `max-w-[430px] mx-auto w-full min-h-screen bg-white shadow-lg`
- `app/layout.tsx` — `<html lang="ko">`, Pretendard 폰트, Kakao SDK

### Step 2: DB & Auth
- Prisma 스키마 작성 + 마이그레이션
- Supabase 클라이언트 (client/server/admin)
- RLS 정책
- 로그인 페이지 (이메일 + 카카오)
- OAuth 콜백 + User upsert
- 보호 라우트 미들웨어

### Step 3: 게스트 섹션 컴포넌트
- `components/invitation/` — Cover, Greeting, CeremonyInfo, MapDirections, Accounts, RsvpForm, ShareBar
- `InvitationRenderer.tsx` — 전체 조합 + options 토글
- `components/templates/classic.tsx` — MVP 테마

### Step 4: 게스트 페이지 라우트
- `app/i/[slug]/page.tsx` — SSR + generateMetadata
- OG 이미지 생성
- 레이아웃: `bg-stone-100` 배경 + 중앙 invitation-shell

### Step 5: 빌더
- Dashboard: 청첩장 목록, 생성/삭제 서버 액션
- Editor: 좌측 폼 + 우측 미리보기 (375×812 폰 프레임)
  - BasicInfoForm, CeremonyForm, GreetingForm, CoverImageForm, AccountsForm, OptionsForm, PublishForm
  - ImageUploader (Supabase Storage 서명 URL)
  - 자동저장 (디바운스 1~2초)

### Step 6: 인터랙션
- RSVP API + rate limit
- RSVP 관리 (에디터 내 응답 목록)
- 카카오 지도 + 길찾기 딥링크
- 카카오톡 공유
- 계좌 복사 + Toast 알림

### Step 7: 마무리 & 배포
- 뷰포트 테스트 (320px, 375px, 390px, 430px, 768px+)
- 접근성 (touch target 44px, aria-label, heading 계층)
- 에러/404 페이지
- Supabase Storage 버킷 설정
- Vercel 배포 + 카카오 콘솔 도메인 등록


## 핵심 설계 결정

1. **Prisma + 서버 액션 우선** — Supabase client는 Auth/Storage만, 데이터는 Prisma. RLS는 방어 계층.
2. **컴포넌트 단일 소스** — `components/invitation/*`를 게스트 페이지와 빌더 미리보기에서 동일 재사용.
3. **미리보기 iframe 없음** — EditorLayout에서 직접 InvitationRenderer 렌더. 즉각 반영.
4. **모바일 레이아웃** — `max-w-[430px] mx-auto w-full` → 모바일 전체폭, 데스크톱 중앙 고정.


## 검증

1. `npm run dev` → 로컬 구동
2. 회원가입/로그인 → Dashboard 진입
3. 새 청첩장 생성 → 섹션 입력 + 사진 업로드 → 실시간 미리보기 → 발행
4. 시크릿 창에서 `/i/[slug]` → MVP 섹션 렌더 확인
5. DevTools로 320px~430px 뷰포트 테스트
6. RSVP 제출 → 에디터에서 응답 확인
7. 카카오 지도/길찾기/공유/계좌복사 동작 확인
8. `npm run build` 성공 + Vercel 프리뷰 배포
