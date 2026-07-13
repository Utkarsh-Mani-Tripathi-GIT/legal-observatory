import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Initialize fonts
const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | National Legal Observatory',
    default: 'National Legal Observatory - Independent Legal Research',
  },
  description:
    'A professional academic legal journal and policy think tank focused on constitutional reviews, data surveillance analysis, and climate litigation frontiers.',
  metadataBase: new URL('https://legal-observatory.org'),
  keywords: [
    'Legal Review',
    'Constitutional Law',
    'Judicial Judgments',
    'Policy Commentary',
    'Technology Regulation',
    'Human Rights Research',
  ],
  authors: [{ name: 'National Legal Observatory Editorial Board' }],
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://legal-observatory.org',
    title: 'National Legal Observatory Platform',
    description: 'Independent Legal Research.',
    siteName: 'National Legal Observatory',
    images: [
      {
        url: '/icon.png',
        width: 1200,
        height: 630,
        alt: 'National Legal Observatory Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'National Legal Observatory Platform',
    description: 'Independent Legal Research.',
    images: ['/icon.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col transition-colors duration-300">
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fade-in">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
