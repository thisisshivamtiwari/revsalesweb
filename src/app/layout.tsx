// Import patch before anything else
import '@/lib/antd-patch';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import AntRegistry from '@/lib/AntRegistry';
import { ConfigProvider } from "antd";
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RevSales CRM | Modern Sales Platform",
  description: "Supercharge your sales with RevSales CRM - a powerful, intuitive platform designed for modern sales teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1890ff',
            },
          }}
        >
          <AuthProvider>
            <AntRegistry>
              {children}
              <Toaster richColors position="top-right" />
              <div id="modal-root" />
            </AntRegistry>
          </AuthProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
