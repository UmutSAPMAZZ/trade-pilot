import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AuthProvider from '@/components/AuthProvider';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TradePilot - AI Destekli Yatırım Platformu',
  description: 'Yapay zeka ile otomatik kripto para ve hisse senedi alım satımı',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow p-4 md:p-6">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
            <footer className="py-6 border-t border-slate-700">
              <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
                <p>© {new Date().getFullYear()} TradePilot. Tüm hakları saklıdır.</p>
                <p className="mt-2 text-sm">Yatırım tavsiyesi değildir. Kripto para yatırımları yüksek risk içerir.</p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}