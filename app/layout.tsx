import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/contexts/UserContext";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Concept Flow - Healthcare Information Systems Manager",
  description: "A platform for managing healthcare information systems metadata",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
