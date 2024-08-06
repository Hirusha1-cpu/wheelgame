"use client";

import "./globals.css";

import NavBar from "@/components/Navbar";
import { Inter } from "next/font/google";

import { StoreProvider } from "./StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={inter.className}>
          <NavBar />
          {children}
        </body>
      </html>
    </StoreProvider>
  );
}
