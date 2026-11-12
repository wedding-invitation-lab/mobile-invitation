import type { Metadata, Viewport } from "next";
import { Bodoni_Moda } from "next/font/google";
import "./globals.css";

const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--font-bodoni" });

export const metadata: Metadata = { title: "모바일 청첩장" };
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={bodoni.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
