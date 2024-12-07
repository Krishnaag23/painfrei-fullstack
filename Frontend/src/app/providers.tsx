"use client";

import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/context/CartContext";
import { SessionProvider } from "next-auth/react";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="dark">
      <SessionProvider><CartProvider>{children}</CartProvider></SessionProvider>
      
    </ThemeProvider>
  );
}
