import type { Metadata, Viewport } from 'next';
import Providers from './providers';
import './globals.css';
import LayoutWrapper from './layout-wrapper';
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
      <body className="bg-gray-100 min-h-screen overflow-x-hidden">
        <Providers>
          <Toaster position="top-center" />
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
