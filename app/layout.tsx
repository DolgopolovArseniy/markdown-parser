import type { Metadata } from 'next';
import './globals.css';
import LayoutWrapper from './components/LayoutWrapper';
import { MdProvider } from './context/MdContext';

export const metadata: Metadata = {
  title: '.md parser',
  description: 'Retro Japanese style Markdown parser',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <MdProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </MdProvider>
      </body>
    </html>
  );
}
