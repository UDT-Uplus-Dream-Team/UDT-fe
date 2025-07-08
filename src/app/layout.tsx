import type { Metadata, Viewport } from 'next';
import './globals.css';
import BottomNavbar from '@/components/bottom-navbar';

export const metadata: Metadata = {
  title: 'Your App Title',
  description: 'Your app description',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <body className="bg-gray-100 min-h-screen">
        {/* 외부 컨테이너 - 큰 화면에서 다른 배경색 */}
        <div className="min-h-screen bg-gray-100 flex justify-center">
          {/* 앱 컨테이너 - 고정 너비 */}
          <div className="w-full max-w-160 bg-primary-800 text-white min-h-screen relative">
            <main className="pb-20 min-h-screen">{children}</main>
            <BottomNavbar />
          </div>
        </div>
      </body>
    </html>
  );
}
