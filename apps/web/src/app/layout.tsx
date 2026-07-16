
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import SiteLoader from "@/components/SiteLoader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

import { getGlobalSettings } from "@/lib/api/settings";
import SmoothScroll from "@/components/SmoothScroll";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getGlobalSettings();
    return {
      title: {
        template: `%s | ${settings?.companyName || 'Intelligen'}`,
        default: settings?.seoDefaultTitle || "Intelligen Immigration & Language Academy",
      },
      description: settings?.seoDefaultDescription || "Secure your global future with expert immigration services and professional language training.",
      openGraph: {
        images: settings?.logo ? [typeof settings.logo === 'object' ? settings.logo.secureUrl : settings.logo] : [],
      }
    };
  } catch (error) {
    return {
      title: "Intelligen Immigration & Language Academy",
      description: "Secure your global future with expert immigration services and professional language training.",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <body className="antialiased min-h-screen flex flex-col">
        <SiteLoader />
        <AuthProvider>
          <SmoothScroll>
            <div className="overflow-x-clip w-full relative flex flex-col flex-1">
              {children}
            </div>
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}
