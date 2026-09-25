// Load the global design tokens and utility styles once for the whole app.
import "./globals.css";

// Use Next's font loader so the chosen font is optimized and self-hosted at build time.
import { Lora } from "next/font/google";

// Type the shared page slot accepted by the root layout.
import type { ReactNode } from "react";

// Keep the site header consistent across every route.
import Header from "@/components/Header";

// Keep the site footer consistent across every route.
import Footer from "@/components/Footer";

// Load the app-wide font once so every page shares the same typography.
const lora = Lora({
  // Only include the Latin glyph set used by the current interface.
  subsets: ["latin"],
  // Expose the generated font through a reusable CSS custom property.
  variable: "--font-lora",
});

// Wrap each route in the shared HTML shell.
export default function RootLayout({

  children,

}: Readonly<{

  children: ReactNode;

}>) {

  return (
    // Declare document language for browsers and assistive technology.
    <html lang="en">
      {/* Apply the downloaded font and shared chrome around each page. */}
      <body className={lora.className}>
        
        {/* Global shell for every route: header, page-specific content, footer. */}
        <Header />
        
        {/* Render whichever page or nested layout matches the current URL. */}
        {children}
        
        <Footer />
        
      </body>
      
    </html>
    
  );
  
}