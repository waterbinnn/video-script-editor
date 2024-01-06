import type { Metadata } from 'next';
import '@/styles/global.scss';

export const metadata: Metadata = {
  title: '인풋 에디터',
  description: 'input editor',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
