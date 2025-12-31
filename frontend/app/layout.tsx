type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>My App</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
