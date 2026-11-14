import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ler e Escrever a Brincar — Intervenção Psicopedagógica 1.º Ciclo',
  description:
    'Plataforma educativa interativa de apoio à leitura, escrita, linguagem oral e compreensão para alunos do 1.º Ciclo. Agrupamento de Escolas de Paço de Arcos.',
  openGraph: {
    title: 'Ler e Escrever a Brincar',
    description:
      'Plataforma educativa de intervenção psicopedagógica na leitura, escrita, linguagem e compreensão.',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The accessibility settings toggle the `dark` class and the root font
    // size on <html> after load, so React must not warn about the difference.
    <html lang="pt-PT" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;500;600;700&family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Caveat:wght@500;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.cdnfonts.com/css/opendyslexic"
          rel="stylesheet"
        />
      </head>
      <body className="bg-paper text-ink antialiased selection:bg-pencil selection:text-[#23201c]">
        {children}
      </body>
    </html>
  );
}
