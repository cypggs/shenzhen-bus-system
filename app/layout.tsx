import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "深圳班车查询系统",
  description: "智能双关键字搜索，快速查找您的班车线路",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
