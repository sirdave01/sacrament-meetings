import "./globals.css";

import type { ReactNode } from "react";

import Header from "@/components/Header";

import Footer from "@/components/Footer";

export default function RootLayout({

  children,

}: Readonly<{

  children: ReactNode;

}>) {

  return (
    
    <html lang="en">
      
      <body>
        
        <Header />
        
        {children}
        
        <Footer />
        
      </body>
      
    </html>
    
  );
  
}