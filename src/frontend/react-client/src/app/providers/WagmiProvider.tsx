    import { createConfig, WagmiProvider } from 'wagmi';
    import {bsc, Chain, mainnet, sepolia, zksync} from 'wagmi/chains';
    import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
    import { http } from 'viem';
    import { walletConnect, injected } from 'wagmi/connectors'

    const connectors = [injected(),
        walletConnect({
            projectId: '25df7e0cd632be08364fa915c7d0ad0b',
            showQrModal: true
        })];

    export const chains: Readonly<[Chain, ...Chain[]]> = [mainnet, sepolia, zksync, bsc]
    const config = createConfig({
        chains,
        connectors,
        transports: {
            [mainnet.id]: http(),
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