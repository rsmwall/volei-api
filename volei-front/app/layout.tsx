'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Lista de rotas onde a Sidebar NÃO deve aparecer
  const isFullScreen = 
    pathname === '/login' || 
    pathname === '/register' || 
    pathname?.startsWith('/tickets/');

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-purple-50`}
        suppressHydrationWarning={true}
      >
        <div className="flex min-h-screen">
          {/* Renderiza Sidebar APENAS se não for tela cheia */}
          {!isFullScreen && <Sidebar />}

          {/* Se for tela cheia, remove a margem esquerda e o padding padrão */}
          <div className={`flex-1 ${!isFullScreen ? 'md:ml-64 p-8' : 'w-full'}`}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}