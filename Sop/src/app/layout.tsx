import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const JakartaFont = Plus_Jakarta_Sans({
  variable: "--plus_Jakarta_Sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shopee SOP Assistant",
  description: "AI-powered SOP assistant for Shopee Return & Refund",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${JakartaFont.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
