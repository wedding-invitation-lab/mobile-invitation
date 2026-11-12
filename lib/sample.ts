// 더미 데이터. 사진은 picsum 플레이스홀더 — 실제 사진으로 교체할 것.
const ph = (seed: string, w = 800, h = 1000, gray = false) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}${gray ? "?grayscale" : ""}`;

// public/photos 안의 실제 사진. GitHub Pages의 하위 경로(basePath)를 자동으로 붙임.
const photo = (name: string) => `${process.env.PAGES_BASE_PATH ?? ""}/photos/${name}`;

export const sample = {
  date: "2027-02-21T13:40:00+09:00",
  cover: photo("cover.jpg"),
  groom: {
    name: "승구",
    order: "장남",
    father: "이내현",
    mother: "", // 미정 — 비어 있으면 혼주 줄에서 생략됨
    phone: "010-0000-0000",
  },
  bride: {
    name: "예지",
    order: "차녀",
    father: "故 조원걸",
    mother: "장경옥",
    phone: "010-0000-0000",
  },
  quote: {
    lines: ["장담하건대. 세상이 다 겨울이어도", "우리 사랑은 늘 봄처럼 따뜻하고", "간혹, 여름처럼 뜨거울 겁니다"],
    source: "이수동, <사랑가>",
    photo: photo("quote.jpg"),
  },
  greeting: {
    photo: photo("greeting.jpg"),
    paragraphs: [
      ["서로의 이름을 부르는 것만으로도", "사랑의 깊이를 확인할 수 있는", "저희 두 사람이 결혼식을 올리게 되었습니다."],
      ["평생 서로를 귀하게 여기며", "첫 마음 그대로 존중하고 배려하며 살겠습니다."],
      ["오로지 믿음과 사랑을 약속하는 날,", "오셔서 축복해 주시면 큰 기쁨으로 간직하겠습니다."],
    ],
  },
  gallery: Array.from({ length: 9 }, (_, i) => ph(`g${i}`, 800, 800)),
  venue: {
    name: "루이비스 문정",
    hall: "아모리스홀",
    address: "서울 송파구 법원로9길 26 H비즈니스파크 D동 루이비스컨벤션 B1층",
    tel: "02-000-0000",
    maps: [
      ["네이버 지도", "https://naver.me/Gctrli34"],
      ["카카오맵", "https://place.map.kakao.com/1862136403"],
      ["티맵", "https://tmap.life/b4c7a612"],
    ],
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
};

// ponytail: 타입은 더미에서 추론. Prisma 스키마가 생기면 그쪽 타입으로 교체.
export type InvitationData = typeof sample;
