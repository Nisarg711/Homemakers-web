import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/sessionprovider";
// import {auth} from "@/lib/auth"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Homemakers - A real estate management system",
  description: "Find your perfect home with Homemakers - A modern real estate platform",
  icons: {
    icon: '/favicon.svg',
  },
};

export default async function RootLayout({ children }) {
  // const session=await auth();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
        <SessionWrapper>
      <body className="min-h-full flex flex-col bg-dark-bg text-dark-text">{children}</body>
      </SessionWrapper>
    </html>
  );
}
