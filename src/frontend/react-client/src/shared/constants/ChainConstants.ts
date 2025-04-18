import {bsc, mainnet, sepolia, zksync} from "wagmi/chains";

export const CHAIN_ICONS: Record<number, string> = {
    11_155_111: "/images/networks/ethereum-eth-logo.svg",
    1: "/images/networks/ethereum-eth-logo.svg",
    324: "/images/networks/zkSync.png",
    56: "/images/networks/bnb-bnb-logo.svg",
};


export const CHAIN_NAMES: Record<number, string> = {
    11_155_111: sepolia.name,
    1: mainnet.name,
    324: zksync.name,
    56: bsc.name,
};