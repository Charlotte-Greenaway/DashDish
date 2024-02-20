 import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvComponent from "./providers/SessionProvider";
import UIProvider from "./providers/UiProvider";
import NavBar from "./components/navbar";
import Timer from "./components/buttons/timer";
export const metadata: Metadata = {
  title: "Dash Dish",
  description: "The recipe book for your kitchen - find recipes based on the ingredients you have at home.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
      <SessionProvComponent>
        <UIProvider>

            <NavBar />
            {children}
            <Timer/>
        </UIProvider>
      </SessionProvComponent>
      </body>
      </html>
  );
}
