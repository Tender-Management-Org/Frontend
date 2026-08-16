import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import { ToastViewport } from "@/components/ui/ToastViewport";
import { ThemeProvider } from "@/context/ThemeContext";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://tenderkhoj.com"),
  title: "tenderkhoj",
  description: "tenderkhoj platform for tender management",
  applicationName: "tenderkhoj",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          // Runs before hydration to avoid a light-mode flash: applies the
          // saved theme (or OS preference) directly to <html>.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('tenderkhoj-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}}catch(e){}})();`,
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-D9V4VZ8Z7C"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-D9V4VZ8Z7C');
          `}
        </Script>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xb5qeoqhg5");
          `}
        </Script>
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          {children}
          <ToastViewport />
        </ThemeProvider>
      </body>
    </html>
  );
}
