import type { Metadata } from "next";
import "./globals.css";
import SessionProvComponent from "./providers/SessionProvider";
import UIProvider from "./providers/UiProvider";
import NavBar from "./components/navbar";
import Timer from "./components/buttons/timer";
export const metadata: Metadata = {
  title: "Dash Dish",
  description:
    "The recipe book for your kitchen - find recipes based on the ingredients you have at home.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <meta
          property="og:title"
          content="Dash Dish - Discover Delicious Recipes"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.dashdish.co.uk" />
        <meta
          property="og:description"
          content="Explore Dash Dish to find the perfect recipe for any occasion. Utilize the ingredients you already have at home to create delicious meals."
        />
        <meta
          property="og:image"
          content="https://www.dashdish.co.uk/_next/static/media/logo.c58f19bb.png"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="content-language" content="en" />
        <meta name="robots" content="index, follow" />
      </head>
      <body>
        <SessionProvComponent>
          <UIProvider>
            <NavBar />
            {children}
            <Timer />
          </UIProvider>
        </SessionProvComponent>
      </body>
    </html>
  );
}
