"use client";
import Navbar from "@/components/navbar";
import { http, createConfig } from 'wagmi';

import { anvil, optimismSepolia } from 'wagmi/chains';
import { getDefaultConfig } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import { ConnectKitProvider } from 'connectkit';
import { getClient } from '@wagmi/core';
import { Chain, Client, Transport } from "viem";


declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

// Initialize QueryClient outside the component to prevent re-creation on each render
const queryClient = new QueryClient();

export const config = createConfig(
  getDefaultConfig({
    chains: [optimismSepolia],
    transports: {
      [optimismSepolia.id]: http(`https://optimism-sepolia.infura.io/v3/231b4ca4d4ed49c988f63fc1e76bd037`),
      // [anvil.id]: http(`http://127.0.0.1:8545`),
    },
    walletConnectProjectId: process.env.WALLET_CONNECT_ID as string,
    appName: "Open Shop",
    appDescription: "Decentralized marketplace for buying and selling physical products",
  }),
);

export const publicClient: Client<Transport, Chain> | undefined = getClient(config)

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
