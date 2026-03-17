import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { cookies } from 'next/headers';
import Chatbot from '@/components/Chatbot/Chatbot';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Aarohan 2026 | NIT Durgapur Technical Fest",
  description: "Official website for Aarohan 2026, the annual technical festival of NIT Durgapur. Innovation, Creativity, and Excellence.",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  let session = null;

  if (sessionCookie) {
    try {
      session = JSON.parse(sessionCookie.value);
    } catch (e) {
      session = null;
    }
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster richColors position="top-right" />
        {children}
        {session && (
          <Chatbot userName={session.name} userRole={session.role} />
        )}
      </body>
    </html>
  );
}
