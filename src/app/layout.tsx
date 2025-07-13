import type { Metadata, Viewport } from 'next';
import Providers from './providers';
import './globals.css';
import BottomNavbar from '@components/common/bottom-navbar';
import { Toaster } from 'sonner';

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
    <html lang="ko">
      <body className="bg-primary-800 min-h-screen overflow-x-hidden">
        <Providers>
          {/* 외부 컨테이너 - 큰 화면에서 다른 배경색 */}
          <div className="bg-primary-800 min-h-screen flex justify-center overflow-x-hidden">
            {/* 앱 컨테이너 - 고정 너비 */}
            <div className="pb-20 w-full max-w-160 text-white min-h-screen relative overflow-x-hidden">
              <main className="min-h-screen overflow-y-auto overflow-x-hidden">
                {children}
              </main>
              <BottomNavbar />
              <Toaster />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
