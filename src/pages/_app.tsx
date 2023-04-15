import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { foundry, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { env } from "~/env.mjs";

const { chains, provider } = configureChains(
  [foundry, polygonMumbai],
  [publicProvider(), alchemyProvider({ apiKey: env.NEXT_PUBLIC_ALCHEMY_API_KEY })],
);
const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
};


export default api.withTRPC(MyApp);
