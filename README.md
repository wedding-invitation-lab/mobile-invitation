모바일 청첩장 SaaS — 다듬은 구축 계획 (MVP 우선)
====================================================

[Context — 왜 / 무엇이 바뀌었나]
신랑신부가 직접 가입해 자기 모바일 청첩장을 만들고 편집하는 셀프 빌더(B2C SaaS)와,
하객이 링크로 여는 게스트 공개 페이지를 구축한다.

기존 계획은 모든 섹션·기능을 한 번에 짓는 풀 빌드였다. 사용자 결정에 따라 다음과 같이 다듬었다:
- 대상: 여러 커플이 가입하는 SaaS (단일 청첩장 아님 → 멀티테넌시·보안 설계 추가)
- 출시 범위: MVP 먼저 → 핵심 섹션·기능만으로 빠르게 발행 가능 상태까지, 나머지는 Phase 2+
- 인증: 카카오 + 이메일 (Supabase Auth)
- 결제: 이번엔 없음, 추후 추가 가능하게 데이터/구조만 미리 준비

핵심 변경점 = ① MVP 경계를 명확히 잘랐고, ② SaaS라서 Supabase RLS 기반 멀티테넌시 보안과
③ 결제-레디 구조(요금제/구독 자리만 설계)를 추가했다.

현재 워크스페이스는 카드뉴스 콘텐츠 제작용 그린필드 — 앱 코드 없음.
신규 Next.js 앱을 하위 폴더 mobile-invitation/ 에 생성(기존 자산과 분리).


[기술 스택]
- Next.js 15 (App Router) + TypeScript + React — 빌더/게스트/API 단일 앱
- Tailwind CSS — 스타일링
- Supabase — Postgres + Auth(이메일 + 카카오) + Storage(이미지) + RLS(멀티테넌시 핵심)
- Prisma — ORM/마이그레이션 (스키마 소스 오브 트루스)
- 카카오 SDK — Kakao Maps(지도/길찾기), 카카오톡 공유
- 배포: Vercel + Supabase(매니지드)


[범위 구분 — 이번 다듬기의 핵심]

✅ MVP (Phase 1 — 이번에 끝까지)
빌더로 만들어 /i/[slug] 로 발행·공유까지 되는 최소 동작 제품.
게스트 섹션(MVP):
  1. Cover — 메인 사진, 신랑·신부 이름, 일시/장소 요약
  2. Greeting — 인사말
  3. CeremonyInfo — 날짜/시간/장소 상세 + D-day
  4. MapDirections — 카카오 지도 + 길찾기 버튼(카카오내비/티맵/네이버지도)
  5. Accounts — 마음 전하실 곳(아코디언 + 계좌번호 복사)
  6. Rsvp — 참석 의사/측/인원/식사/메시지 입력
  7. ShareBar — 카카오톡 공유 + 링크 복사
빌더(MVP): Dashboard(목록/생성/공개링크 복사) + Editor(섹션 폼 + 이미지 업로드 + 실시간 미리보기)
           + 발행(slug). 템플릿 1종.
인증(MVP): 카카오 + 이메일 로그인, 보호 라우트.

⏭ Phase 2 (다음)
- Gallery(그리드 + 라이트박스/스와이프), Guestbook(작성/목록/비번 삭제),
  BgmPlayer(우하단 floating, 인터랙션 후 재생)
- 두 번째 테마, options(JSON) 섹션 on/off 토글 UI 고도화

⏭ Phase 3 (추후)
- 결제/요금제: 무료=draft 또는 1개 제한, 유료=발행/다중/프리미엄 테마.
  PG(토스페이먼츠 등) 연동. (데이터 모델은 지금 미리 만들어 둠)
- AI: 인사말/문구 자동 생성(Claude API), 사진 보정, AI 영상


[아키텍처 / 라우트]
mobile-invitation/
  app/
    (builder)/                 # 로그인 필요
      dashboard/page.tsx       # 내 청첩장 목록 + 새로 만들기
      editor/[id]/page.tsx     # 섹션 폼 + 실시간 미리보기
    i/[slug]/page.tsx          # 게스트 공개 페이지(단일 스크롤, SSR)
      opengraph-image.tsx      # 카카오/링크 공유 미리보기
    login/page.tsx
    api/ (또는 server actions): rsvp, guestbook(Phase2)
    layout.tsx
  components/
    builder/                   # 폼 섹션, 미리보기, 이미지 업로더
    invitation/                # 게스트 섹션 (빌더 미리보기와 공유 = 단일 소스)
    templates/                 # 테마
  lib/
    supabase/                  # 클라/서버 클라이언트 + auth helper
    prisma.ts
    kakao.ts                   # 지도/공유 헬퍼
  prisma/schema.prisma


[데이터 모델 (Prisma) — 결제-레디 포함]
- User — Supabase auth id 매핑. plan 필드(free|paid, 기본 free)로 결제-레디.
- Invitation — id, slug(unique 공개 URL), ownerId, templateId, status(draft|published),
               bgmUrl, options(JSON: 섹션 on/off)
    · 신랑/신부: groomName, brideName, groomParents, brideParents, groomPhone, bridePhone
    · 예식: weddingAt, venueName, venueHall, venueAddress, venueTel, lat, lng
    · 인사말: greetingTitle, greetingBody
- GalleryImage — invitationId, url, sortOrder (모델은 지금, UI는 Phase2)
- Account — invitationId, side(신랑측|신부측), bank, number, holder, kakaopayUrl
- Rsvp — invitationId, side, name, attending, headcount, mealYn, message, createdAt
- GuestbookEntry — invitationId, name, passwordHash, message, createdAt (모델은 지금, UI는 Phase2)
- (추후) Subscription/Payment — Phase3에서 추가.
  지금은 테이블 안 만들고 User.plan만 두어 발행 게이팅 자리 확보.


[SaaS 보안/멀티테넌시 — 새로 추가, SaaS라 필수]
- Supabase RLS 활성화: Invitation 등 소유자(ownerId = auth.uid())만 read/write.
  게스트 공개 페이지는 서버(서비스 롤) 또는 published 한정 public select 정책으로
  slug 조회만 노출(연락처 등 민감 필드 노출 범위 점검).
- 빌더 API/서버액션은 항상 ownerId 검증 후 mutate.
- slug 유니크 + 추측 어려운 값(예: 짧은 nanoid 또는 사용자 지정 + 충돌 검사).
- Rate limit: RSVP/방명록 등 비로그인 쓰기 엔드포인트에 IP 기반 제한(스팸 대비).
- 방명록 삭제는 bcrypt 비번 해시 비교(Phase2).


[빌더 UX]
- Dashboard: 내 청첩장 카드 목록, "새 청첩장 만들기", 상태(draft/published), 공개 링크 복사.
  (요금제 제한 자리: free는 발행/개수 제한 메시지 — 지금은 비활성 placeholder)
- Editor: 좌측 섹션 폼(기본정보 / 인물·연락처 / 예식정보 / 인사말 / 갤러리(Phase2) / 계좌 /
          옵션 토글 / 테마), 우측 실시간 모바일 미리보기(게스트 컴포넌트 재사용).
- 발행: slug 생성 → /i/[slug] 공개.


[구현 단계 (순서대로)]
1. 스캐폴드 & 인프라: mobile-invitation/에 Next.js 15 앱(create-next-app, TS, Tailwind, ESLint),
   git init. Supabase 프로젝트 생성, .env.local(Supabase URL/anon/service, 카카오 키).
2. DB & Auth: Prisma schema(위 모델) + 마이그레이션, RLS 정책 작성.
   Supabase Auth(이메일 + 카카오) 연동, 로그인 페이지, 보호 라우트 미들웨어.
3. 빌더: Dashboard(목록/생성) → Editor(폼 + Supabase Storage 이미지 업로드(서명 URL) +
   실시간 미리보기) → 발행/slug.
4. 게스트 렌더링: /i/[slug] SSR + 템플릿 1종 + MVP 섹션 1~7 + OG 이미지.
5. 인터랙션(MVP): RSVP(server action + DB), 카카오 지도·길찾기, 카카오톡 공유, 계좌 복사.
   RSVP 엔드포인트 rate limit.
6. 마무리: 반응형(360~430px)/접근성 점검, npm run build, Vercel 프리뷰 배포.
7. (Phase2 이후): Gallery/Guestbook/BGM → 두 번째 테마 → 결제/요금제 → AI.


[재사용/주의 포인트]
- 게스트 섹션 컴포넌트(components/invitation/)를 빌더 미리보기에서 그대로 재사용 → 단일 소스.
- 카카오 지도/공유는 JS SDK 키 필요(카카오 개발자 콘솔 앱 등록 + 플랫폼 도메인 등록).
  카카오 로그인도 동일 콘솔 설정.
- 이미지 업로드: Supabase Storage 버킷 + 클라이언트 서명 URL 직접 업로드, 표시는 next/image.
- BGM 자동재생은 브라우저 정책상 사용자 인터랙션 후 재생(Phase2).


[검증 (end-to-end)]
1. cd mobile-invitation && npm run dev → 로컬 구동.
2. 회원가입/로그인(이메일·카카오) → Dashboard 진입.
3. 새 청첩장 생성 → 섹션 입력 + 사진 업로드 → 실시간 미리보기 반영 → 발행.
4. 시크릿 창에서 /i/[slug] 열기 → MVP 섹션 1~7 렌더 확인.
5. RLS 점검: 다른 계정으로 로그인해 남의 청첩장 editor 직접 접근 시 차단되는지 확인.
6. 게스트로 RSVP 제출 → Dashboard/응답 목록에서 데이터 확인.
7. 지도 길찾기, 카카오톡 공유, 계좌 복사 동작 확인.
8. 모바일 뷰포트(360~430px) 레이아웃 + npm run build 성공 + Vercel 프리뷰 배포.
