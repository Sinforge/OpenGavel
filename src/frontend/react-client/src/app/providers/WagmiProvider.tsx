import { createConfig, WagmiProvider } from 'wagmi';
import {bsc, mainnet, sepolia, zksync} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'viem';

const customTestnet = {
    id: 31337,
    name: 'My Custom Testnet',
    network: 'my-custom-testnet',
    nativeCurrency: {
        name: 'MyToken',
        symbol: 'MTK',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ['http://127.0.0.1:8545'],
        },
        public: {
            http: ['http://127.0.0.1:8545'],
        },
    },
    blockExplorers: {
        default: {
            name: 'MyTestnetExplorer',
            url: 'http://127.0.0.1:8545',
        },
    },
};

const config = createConfig({
    chains: [mainnet, customTestnet, sepolia, zksync, bsc],
    transports: {
        [mainnet.id]: http(),
        [customTestnet.id]: http(),
        [sepolia.id]: http(),
        [zksync.id]: http(),
        [bsc.id]: http()
    }
});
const queryClient = new QueryClient();

export const WagmiWrapper = ({ children } : any) => (
    <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    </WagmiProvider>
);