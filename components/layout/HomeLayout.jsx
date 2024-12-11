import { Inter } from 'next/font/google';
import '../../app/globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Euodia Foods',
  description:
    'Welcome to Euodia foods, get your next meal with just a click of a button',
  openGraph: {
    title: 'Euodia Foods',
    description:
      'Welcome to Euodia foods, get your next meal with just a click of a button',
    url: 'https://euodiafoods.com',
    siteName: 'Euodia Services',
    images: [
      {
        url: 'https://euodiafoods.com',
        width: 800,
        height: 600,
        alt: 'Euodia OpenGraph Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/favicon.ico', // Correct the path to start from the root
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        url: '/favicon-32x32.png',
        sizes: '32x32',
      },
      {
        rel: 'icon',
        url: '/favicon-16x16.png',
        sizes: '16x16',
      },
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      },
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
    ],
  },
};

export function generateViewport() {
  return {
    themeColor: '#ffffff',
  };
}
export default function HomeLayout({ children }) {
  return (
    <div className="bg-[#FF9E0C]/5 flex flex-col min-h-screen h-full">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Analytics />
      <SpeedInsights />
      <Footer />
    </div>
  );
}
