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
      <body className="bg-gray-100 min-h-screen overflow-hidden">
        <Providers>
          <Toaster position="top-center" />
          {/* 외부 컨테이너 - 큰 화면에서 다른 배경색 */}
          <div className="min-h-screen bg-gray-100 flex justify-center overflow-hidden">
            {/* 앱 컨테이너 - 고정 너비 */}
            <div className="w-full max-w-160 bg-gradient-to-b from-primary-900 via-purple-900 to-indigo-900 text-white h-screen flex flex-col relative overflow-hidden">
              <main className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto pb-[57px]">
                {children}
              </main>
              <BottomNavbar />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
