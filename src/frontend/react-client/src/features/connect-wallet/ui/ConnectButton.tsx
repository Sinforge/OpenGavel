import {useConnect, useWalletClient} from "wagmi";
import {Button} from "@mui/material";
/*
import { toast } from 'react-toastify'
*/

type ConnectButtonProps = {
    connector: any;
};

export const ConnectButton = ({ connector }: ConnectButtonProps) => {
    const { connect, error } = useConnect();
    const handleConnect = async () => {
        try {
            await connect({ connector });
            console.log('Wallet connected!');
        } catch (e) {
            console.log(`Connection failed:`);
            console.error('Connection error:', e);
        }
    };
    return (
        <Button onClick={handleConnect}>
            {connector.name}
            {error && <span className="text-red-500 ml-2">{error.message}</span>}
        </Button>
    );
};