import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Japan Cyber Shield - 国民参加型サイバー防衛プラットフォーム",
  description:
    "フィッシング・詐欺・マルウェアなどの脅威情報をリアルタイムに共有し、日本全体のサイバー防御力を高めるオープンソースプラットフォーム",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
