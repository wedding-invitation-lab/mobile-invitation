import type { NextConfig } from "next";

// ponytail: GitHub Pages용 정적 내보내기. 서버 기능(DB, 인증, RSVP 저장)을 붙일 때
// output/basePath를 지우고 Vercel로 옮길 것.
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.PAGES_BASE_PATH ?? "",
};

export default nextConfig;
