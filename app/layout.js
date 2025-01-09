import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from '@/lib/firebase/AuthContext';
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bost QR",
  description: "Bost room entry qr form",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>

        <Toaster />
        {children}
      </AuthProvider>
      </body>
    </html>
  );
}
