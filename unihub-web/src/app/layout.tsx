import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "@/lib/providers";
import { UserProvider } from "@/context/user-context";
import { ThemeProvider } from "@/context/theme-context";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "UniHub",
  description: "Premier event discovery platform for universities",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.png" type="image/png" />
        <link
          rel="apple-touch-icon"
          href="/icon.png"
          type="image/png"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${sora.variable} antialiased`}
      >
        <ThemeProvider>
          <Providers>
            <UserProvider>{children}</UserProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
