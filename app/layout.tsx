import "./globals.css";

import { Lora } from "next/font/google";

import type { ReactNode } from "react";

import Header from "@/components/Header";

import Footer from "@/components/Footer";

const lora = Lora({

  subsets: ["latin"],

  variable: "--font-lora",
  
});

export default function RootLayout({

  children,

}: Readonly<{

  children: ReactNode;

}>) {

  return (
    
    <html lang="en">
      
      <body className={lora.className}>
        
        <Header />
        
        {children}
        
        <Footer />
        
      </body>
      
    </html>
    
  );
  
}