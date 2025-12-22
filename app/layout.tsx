import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chat AI | Powered by OpenRouter AI',
  description: 'Production-grade chat application powered by OpenRouter AI'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
