// 더미 데이터. 사진은 picsum 플레이스홀더 — 실제 사진으로 교체할 것.
const ph = (seed: string, w = 800, h = 1000, gray = false) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}${gray ? "?grayscale" : ""}`;

export const sample = {
  date: "2027-04-17T14:30:00+09:00",
  cover: ph("cover", 860, 1200, true),
  groom: {
    name: "민준",
    order: "장남",
    father: "김영호",
    mother: "이정희",
    phone: "010-0000-0000",
    tag: "#ENFP",
    birth: "1995년 서울 출생",
    job: "소프트웨어 엔지니어",
    photo: ph("groom", 400, 400),
  },
  bride: {
    name: "서연",
    order: "장녀",
    father: "박성민",
    mother: "최은숙",
    phone: "010-0000-0000",
    tag: "#INTJ",
    birth: "1996년 부산 출생",
    job: "그래픽 디자이너",
    photo: ph("bride", 400, 400),
  },
  quote: {
    lines: ["서로를 바라보는 것이 아니라", "같은 방향을 함께 바라보는 것,", "그것이 사랑입니다"],
    source: "생텍쥐페리",
    photo: ph("quote", 600, 600, true),
  },
  greeting: {
    photo: ph("greeting", 860, 860, true),
    paragraphs: [
      ["서로의 이름을 부르는 것만으로도", "사랑의 깊이를 확인할 수 있는", "저희 두 사람이 결혼식을 올리게 되었습니다."],
      ["평생 서로를 귀하게 여기며", "첫 마음 그대로 존중하고 배려하며 살겠습니다."],
      ["오로지 믿음과 사랑을 약속하는 날,", "오셔서 축복해 주시면 큰 기쁨으로 간직하겠습니다."],
    ],
  },
  timeline: [
    { when: "21년 봄, 서울", title: "운명 같은 첫 만남", text: ["작은 카페에서", "우연이 운명이 된 날"], photo: ph("t1", 400, 400) },
    { when: "어느새 1000일", title: "함께 보낸 나날들", text: ["서로의 하루가 되어", "당연해진 우리"], photo: ph("t2", 400, 400) },
    { when: '대답은 "YES!"', title: "프로포즈", text: ["같은 마음으로", "같은 미래를 향한", "단 하나의 약속"], photo: ph("t3", 400, 400) },
  ],
  gallery: Array.from({ length: 9 }, (_, i) => ph(`g${i}`, 800, 800)),
  venue: {
    name: "라온 웨딩홀",
    hall: "그랜드홀",
    address: "서울 강남구 테헤란로 123",
    tel: "02-000-0000",
    lat: 37.5006,
    lng: 127.0364,
    transit: [
      { title: "버스 이용시", lines: ["일반버스 : 11-1, 3, 58, 7", "간선버스 : 101, 206, 110, 120"] },
      { title: "지하철 이용시", lines: ["2호선 : 역삼역 3번 출구 (도보 5분)"] },
      { title: "주차 이용시", lines: ["건물 내 주차장 이용", "※ 주차권은 1층 카운터에서 수령"] },
    ],
  },
  accounts: [
    {
      side: "신랑측",
      items: [
        { role: "신랑", holder: "김민준", bank: "국민은행", number: "000000-00-000000" },
        { role: "아버지", holder: "김영호", bank: "신한은행", number: "000-000-000000" },
      ],
    },
    {
      side: "신부측",
      items: [
        { role: "신부", holder: "박서연", bank: "우리은행", number: "0000-000-000000" },
        { role: "어머니", holder: "최은숙", bank: "농협", number: "000-0000-0000-00" },
      ],
    },
  ],
  closing: {
    photo: ph("closing", 860, 1150, true),
    lines: ["별을 보고 있으면 어둠", "두려워할 필요가 없잖아요.", "아름답구나, 그 생각부터 하게 되니까", "우리, 그렇게 사랑해요."],
    source: "정현주 <그래도, 사랑>",
  },
};

// ponytail: 타입은 더미에서 추론. Prisma 스키마가 생기면 그쪽 타입으로 교체.
export type InvitationData = typeof sample;
