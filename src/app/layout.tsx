import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nature's Desktop",
  description: "A curated, read-only desktop of conversations and projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
