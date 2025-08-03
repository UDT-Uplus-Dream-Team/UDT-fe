import type { Metadata, Viewport } from 'next';
import Providers from './providers';
import './globals.css';
import LayoutWrapper from './layout-wrapper';
import { Toaster } from 'sonner';
import { AuthToastHandler } from '@/components/common/AuthToastHandler';
import { GoogleAnalytics } from '@next/third-parties/google'; // 구글 애널리틱스 추가

export const metadata: Metadata = {
  title: '반딧불',
  description: '30초만에 수많은 OTT 콘텐츠 숲을 밝히는 작은 빛',
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
      <body className="w-[100vw] flex justify-center bg-gray-100 h-[100svh] overflow-x-hidden">
        <Providers>
          <Toaster
            position="top-center"
            toastOptions={{ className: 'w-full' }}
          />
          <AuthToastHandler />
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
      </body>
    </html>
  );
}
