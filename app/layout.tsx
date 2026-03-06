import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'HoseTrack Pro | Gestao Industrial',
  description: 'Sistema de rastreabilidade e manutencao de mangueiras e conexoes.',
  metadataBase: new URL('https://rastreabilidade-bpwc.vercel.app/'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'HoseTrack Pro | Gestao Industrial',
    description: 'Sistema de rastreabilidade e manutencao de mangueiras e conexoes.',
    url: 'https://rastreabilidade-bpwc.vercel.app/',
    siteName: 'HoseTrack Pro',
    type: 'website',
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: ['/icon.svg'],
    apple: [{ url: '/icon.svg' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
