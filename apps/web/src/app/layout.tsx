import { Providers } from '@/components/shared/providers';
import { AuthDialogWrapper } from '@/features/auth/components/auth-dialog-wrapper';
import { geistMono, geistSans, jetbrains, outfit } from '@/lib/fonts';
import { rootMetadata } from '@/lib/metadata';
import '@repo/ui/globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrains.variable} ${outfit.variable} antialiased`}
      >
        <Providers>
          <main>{children}</main>
          <AuthDialogWrapper />
        </Providers>
      </body>
    </html>
  );
}

export const metadata = rootMetadata;
