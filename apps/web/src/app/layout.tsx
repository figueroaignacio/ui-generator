import { geistMono, geistSans, jetbrains } from '@/lib/fonts';
import { rootMetadata } from '@/lib/metadata';
import { QueryProvider } from '@/providers/query-provider';
import '@repo/ui/globals.css';
import dynamic from 'next/dynamic';

const AuthDialogWrapper = dynamic(
  () => import('@/features/auth/components/auth-dialog-wrapper').then(mod => mod.AuthDialogWrapper),
  { ssr: false },
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrains.variable} antialiased`}
      >
        <QueryProvider>
          <main>{children}</main>
          <AuthDialogWrapper />
        </QueryProvider>
      </body>
    </html>
  );
}

export const metadata = rootMetadata;
