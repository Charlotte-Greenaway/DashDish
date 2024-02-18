"use client"
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

export default function SessionProvComponent({
    children,
    session, // Add session as a prop here
  }: Readonly<{
    children: React.ReactNode;
    session?: Session; // session might be undefined, hence the optional type
  }>) {
    return (

          <SessionProvider session={session}> {/* Use session prop here */}
            {children}
          </SessionProvider>

    );
  }