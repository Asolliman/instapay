import React from "react";
import "./globals.css"; // Add your global styles here
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "Instapay",
  description: "A secure platform for managing your finances",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} bg-gray-100 text-gray-900`}>
        <header className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-lg font-bold">Instapay</h1>
          </div>
        </header>
        <main className="container mx-auto py-6">{children}</main>
        <footer className="bg-gray-200 text-center py-4 absolute bottom-0 w-full">
          <p>© {new Date().getFullYear()} Instapay. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
