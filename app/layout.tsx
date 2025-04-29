import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cognifest",
  description:
    "Cognifest adalah platform untuk menemukan, mendaftar, dan mengelola berbagai acara seru seperti konser, festival kuliner, pameran seni, dan banyak lagi. Temukan pengalaman unik di setiap acara yang kami tawarkan!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
