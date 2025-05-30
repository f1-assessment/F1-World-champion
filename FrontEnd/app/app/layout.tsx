import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ErrorBoundary } from "@/components/error-boundary";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "F1 World Champions",
  description: "Explore Formula 1 World Champions from 2005 to the present day",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="pt-24 min-h-screen">{children}</main>
            <Footer />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}