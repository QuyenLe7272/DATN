import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";
import ZaloButton from '@/components/ZaloButton';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Làm biển quảng cáo giá rẻ tại Đà Nẵng",
  description:
    "Xưởng in 1991 - Chuyên thiết kế và thi công bảng hiệu quảng cáo, chữ nổi Mica, bảng hiệu Alu, hộp đèn LED uy tín, chuyên nghiệp và giá rẻ nhất tại Đà Nẵng.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <ScrollToTop />
        <ZaloButton />
      </body>
    </html>
  );
}
