import Header from "@/components/Header/Header";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import Footer from "@/components/Footer/Footer";
import "./globals.css";

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>Farshe</title>
      </head>
      <body>
        <Header />
        <NavigationBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
