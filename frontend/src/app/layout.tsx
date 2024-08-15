import "../globals.css";
import Wagmi from '@/config/wagmi';
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { NotificationProvider } from '../config/notificationprovider';
import NotificationList from "@/components/notificationlist";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Open Shop",
  description: "Decentralized marketplace for buying and selling physical products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-gradient text-white ${inter.className}`}>
        <Wagmi>
          <NotificationProvider>
            {children}
            <NotificationList />
          </NotificationProvider>
        </Wagmi>
      </body>
    </html>
  );
}
