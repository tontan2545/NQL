import Footer from "@/components/footer";
import Header from "@/components/header";
import "@nql/ui/styles/globals.css";
import type { Metadata } from "next";

import { GeistSans, GeistMono } from "geist/font";

export const metadata: Metadata = {
  title: "NQL",
  description: "NQL Text-to-SQL solution using Amazon Bedrock",
  authors: [
    {
      name: "Nonthapat Kaewamporn",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-col flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
