import "./globals.css";
import AuthGuard from './components/AuthGuard';

export const metadata = {
  title: "MarketMind AI — Smart Market Analysis Platform",
  description: "AI-powered daily analysis of Gold, Silver, Oil, Indian F&O, and global commodities. Get buy/sell signals, crash alerts, and daily email reports.",
  keywords: "gold price, silver price, crude oil, nifty options, commodity market, AI trading signals, market analysis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2c2c80ff" />
      </head>
      <body>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
