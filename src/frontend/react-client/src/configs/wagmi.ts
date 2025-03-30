import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

const mainnetTransport = http();
const sepoliaTransport = http();

export const config = createConfig({
    chains: [mainnet, sepolia],
    connectors: [injected()],
    transports: {
        [mainnet.id]: mainnetTransport,
        [sepolia.id]: sepoliaTransport,
    }
})