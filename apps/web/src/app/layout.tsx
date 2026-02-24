import { geistMono, geistSans } from '@/lib/fonts';
import { QueryProvider } from '@/providers/query-provider';
import '@repo/ui/globals.css';
import type { Metadata } from 'next';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <main>{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: 'NachAI - AI User Interface Generator',
  description: 'Generate UI components with NachAI',
};
