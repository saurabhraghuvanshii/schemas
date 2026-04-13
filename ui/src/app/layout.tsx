import type { Metadata } from "next";
import ThemeProvider from "./theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meshery Schemas Directory",
  description: "Visual documentation of Meshery Schemas — relationships, selectors, and all constructs.",
  icons: {
    icon: "/meshery-logo.svg",
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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
