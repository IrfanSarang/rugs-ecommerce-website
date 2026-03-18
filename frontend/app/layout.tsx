"use client";
import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import Footer from "@/components/Footer/Footer";
import "./globals.css";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(pathname);
  const isAdminPage = pathname.startsWith("/admin");
  const isSpecialPage = isAuthPage || isAdminPage;

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&family=Noto+Nastaliq+Urdu&display=swap" rel="stylesheet" />
      </head>
      <body className={isSpecialPage ? "auth-body" : ""}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                {!isSpecialPage && <Header />}
                {!isSpecialPage && <NavigationBar />}
                {children}
                {!isSpecialPage && <Footer />}
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
