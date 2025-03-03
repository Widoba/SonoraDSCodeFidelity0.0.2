import './globals.css';
import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';

// Initialize the Open Sans font
const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Sonora Design System',
  description: 'Design token system bridging Figma with code implementation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-grey-fog ${openSans.className}`}>
        {children}
      </body>
    </html>
  );
}