import type { Metadata } from "next";
import { Invitation } from "@/components/invitation/Invitation";
import { sample } from "@/lib/sample";

// ponytail: 어떤 slug든 더미 데이터를 렌더. DB(Prisma) 붙이면 slug로 조회 + notFound().
const title = `${sample.groom.name} ♥ ${sample.bride.name} 결혼합니다`;
const description = `${new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  dateStyle: "full",
  timeStyle: "short",
}).format(new Date(sample.date))} · ${sample.venue.name} ${sample.venue.hall}`;

// 링크 미리보기(카카오톡 등)는 절대 주소의 이미지가 필요함.
// ponytail: 호스팅 주소 하드코딩. 도메인이 바뀌면 여기만 수정.
const origin = "https://wedding-invitation-lab.github.io";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: [{ url: `${origin}${sample.cover.replace("cover.jpg", "og.jpg")}`, width: 1200, height: 630 }],
  },
};

// 정적 내보내기에서는 만들 slug를 미리 알려줘야 함
export const generateStaticParams = () => [{ slug: "sample" }];

export default function Page() {
  return <Invitation data={sample} />;
}
