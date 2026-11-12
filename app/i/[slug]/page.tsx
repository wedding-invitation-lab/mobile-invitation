import type { Metadata } from "next";
import { Invitation } from "@/components/invitation/Invitation";
import { sample } from "@/lib/sample";

// ponytail: 어떤 slug든 더미 데이터를 렌더. DB(Prisma) 붙이면 slug로 조회 + notFound().
export const metadata: Metadata = {
  title: `${sample.groom.name} ♥ ${sample.bride.name} 결혼합니다`,
};

// 정적 내보내기에서는 만들 slug를 미리 알려줘야 함
export const generateStaticParams = () => [{ slug: "sample" }];

export default function Page() {
  return <Invitation data={sample} />;
}
