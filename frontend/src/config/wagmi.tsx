"use client";
import { http, createConfig } from 'wagmi';
import { anvil } from 'wagmi/chains';
import { getDefaultConfig } from "connectkit";
import Navbar from "@/components/navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import { ConnectKitProvider } from 'connectkit';

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

// Initialize QueryClient outside the component to prevent re-creation on each render
const queryClient = new QueryClient();

export const config = createConfig(
  getDefaultConfig({
    chains: [anvil],
    transports: {
      [anvil.id]: http(`http://127.0.0.1:8545`),
    },
    walletConnectProjectId: process.env.WALLET_CONNECT_ID as string,
    appName: "Open Shop",
    appDescription: "Decentralized marketplace for buying and selling physical products",
  }),
);

export default function Wagmi({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <Navbar />
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
