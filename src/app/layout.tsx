import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KursPlatform - Modern Online Eğitim",
  description: "Uzman eğitmenlerden kaliteli online kurslar. Programlama, tasarım, iş dünyası ve daha fazlası.",
  keywords: ["online kurs", "eğitim", "programlama", "tasarım", "iş dünyası"],
  authors: [{ name: "KursPlatform" }],
  creator: "KursPlatform",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://kursplatform.com",
    title: "KursPlatform - Modern Online Eğitim",
    description: "Uzman eğitmenlerden kaliteli online kurslar. Programlama, tasarım, iş dünyası ve daha fazlası.",
    siteName: "KursPlatform",
  },
  twitter: {
    card: "summary_large_image",
    title: "KursPlatform - Modern Online Eğitim",
    description: "Uzman eğitmenlerden kaliteli online kurslar. Programlama, tasarım, iş dünyası ve daha fazlası.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
