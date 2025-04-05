import { createConfig, WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'viem';

const config = createConfig({
    chains: [mainnet],
    transports: {
        [mainnet.id]: http(),
    },
});

const queryClient = new QueryClient();

export const WagmiWrapper = ({ children } : any) => (
    <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    </WagmiProvider>
);