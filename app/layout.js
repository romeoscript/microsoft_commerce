import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Euodia Whole Foods - Healthy, Therapeutic Meals for Wellness and Longevity",
  description:
  "Discover Euodia Whole Foods: your partner for wellness and longevity with sustainably sourced, great-tasting, healthy, and therapeutic meals. Order your next meal with a click!",
  openGraph: {
    title: "Euodia Whole Foods - Healthy, Therapeutic Meals for Wellness and Longevity",
    description:
    "Discover Euodia Whole Foods: your partner for wellness and longevity with sustainably sourced, great-tasting, healthy, and therapeutic meals. Order your next meal with a click!",
    url: "https://euodiawholefoods.com",
    siteName: "Euodia Services",
    images: [
      {
        url: "https://euodiawholefoods.com",
        width: 800,
        height: 600,
        alt: "Euodia OpenGraph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.ico", // Correct the path to start from the root
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        url: "/favicon-32x32.png",
        sizes: "32x32",
      },
      {
        rel: "icon",
        url: "/favicon-16x16.png",
        sizes: "16x16",
      },
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },
};

export function generateViewport() {
  return {
    themeColor: "#ffffff",
  };
}
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className=" h-full">
        <div className="flex-grow">
          <ToastContainer />
          <StoreProvider>{children}</StoreProvider>
        </div>
      </body>
    </html>
  );
}
