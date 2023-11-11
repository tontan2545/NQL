import Footer from "@/components/footer";
import Header from "@/components/header";
import { Toaster } from "@ui/components/toaster";
import "@nql/ui/styles/globals.css";
import type { Metadata } from "next";

import { GeistSans, GeistMono } from "geist/font";
import QueryClientProvider from "@/providers/query-provider";

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
        <QueryClientProvider>
          <Header />
          <main className="flex flex-col flex-1">{children}</main>
          <Footer />
          {/* <svg
            aria-hidden="true"
            className="pointer-events-none absolute -z-10 inset-0 h-full w-full fill-gray-300/20 stroke-gray-300/20 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
          >
            <defs>
              <pattern
                id=":r18:"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
                x="-1"
                y="-1"
              >
                <path d="M.5 30V.5H30" fill="none"></path>
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              strokeWidth="0"
              fill="url(#:r18:)"
            ></rect>
          </svg> */}
        </QueryClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
