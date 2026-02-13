import { Instrument_Serif, Inter, Noto_Serif_SC } from 'next/font/google';
import Script from 'next/script';
import ThemeProvider from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';
import './highlight.css';

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const notoSerifSC = Noto_Serif_SC({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif-cn',
});

export const metadata = {
  title: 'Chang Haofei',
  description: 'Personal homepage of Chang Haofei — Computer Science student, researcher, and builder.',
  keywords: ['Chang Haofei', 'computer science', 'RUC', 'blog'],
  openGraph: {
    title: 'Chang Haofei',
    description: 'Personal homepage of Chang Haofei',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${inter.variable} ${notoSerifSC.variable}`}
      suppressHydrationWarning
    >
      <head />
      <body suppressHydrationWarning>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        <ThemeProvider>
          <div className="page-wrapper">
            <Header />
            <main className="main-content">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
