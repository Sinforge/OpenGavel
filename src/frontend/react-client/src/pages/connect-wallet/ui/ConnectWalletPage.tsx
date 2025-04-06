import {useAccount, useConnect, useDisconnect} from 'wagmi';
import {ConnectButton} from "../../../features/connect-wallet/ui/ConnectButton"

export const ConnectWalletPage = () => {
    const {connectors} = useConnect();

    return (

        <div className="grid grid-cols-1 gap-4">
            {connectors.map((connector) => (
                <ConnectButton
                    key={connector.uid}
                    connector={connector}
                />
            ))}
        </div>
    );
};