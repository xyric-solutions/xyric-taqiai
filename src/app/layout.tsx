import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Legal AI - Pakistani Law Assistant",
  description: "AI-powered legal document generation for Pakistani lawyers and advocates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap"
          rel="stylesheet"
        />
        {/* Apply theme before first paint — prevents flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var p = JSON.parse(localStorage.getItem('taqiai-prefs') || '{}');
                var root = document.documentElement;
                root.setAttribute('data-theme', p.theme || 'dark');
                root.setAttribute('data-font-size', p.fontSize || 'medium');
                root.setAttribute('data-density', p.density || 'default');
              } catch(e) {
                document.documentElement.setAttribute('data-theme', 'dark');
              }
            `,
          }}
        />
      </head>
      <body className="h-full antialiased font-sans">{children}</body>
    </html>
  );
}
