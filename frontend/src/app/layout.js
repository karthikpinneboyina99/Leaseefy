import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Leaseefy | Legal Rental Agreements in Minutes",
  description: "Leaseefy helps landlords generate legally compliant rental and lease agreements quickly, no matter the state or country.",
};

import Link from 'next/link';
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
