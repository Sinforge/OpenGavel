import { useState, useEffect } from 'react'
import { useConnect, useAccount, useDisconnect, useSignMessage } from 'wagmi'
import { useBalance } from 'wagmi'
import { AuthApi } from '../api/auth_api'
import {AuthRequest, AuthResponse} from "../api/types";
import { useAuth } from '../contexts/AuthContext';
export default function ConnectButton() {
    const { connect, connectors, error: connectError, status: connectStatus } = useConnect()
    const { address, isConnected } = useAccount()
    const { disconnect } = useDisconnect()
    const { signMessageAsync } = useSignMessage()
    const [authError, setAuthError] = useState<string | null>(null)

    const { login } = useAuth();

    const { data: balance } = useBalance({
        address
    })

    const handleConnect = async () => {
        try {
            setAuthError(null)
            connect({ connector: connectors[0] })
        } catch (err) {
            setAuthError('Connection error')
        }
    }

    const handleSign = async () => {
        try {
            const message = `Register or login for OpenGavel`
            const signature = await signMessageAsync({ message })

            //let request: AuthRequest = {
            //    address: address,
            //    signature: signature,
            //    message: message
            //}
            //let response : AuthResponse = await auth_api.authorize(request);
            console.log(login)
            login("test_token");
            //console.log('Response:', response)

        } catch (err) {
            setAuthError('Signature error')
        }
    }

    if (!window.ethereum?.isMetaMask) {
        return (
            <div className="alert">
                <p>Need to download MetaMask</p>
                <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Download MetaMask
                </a>
            </div>
        )
    }

    if (isConnected) {
        return (
            <div className="wallet-info">
                <div className="address">
                    🔗 Connected: {truncateAddress(address)}
                </div>

                {balance && (
                    <div className="balance">
                        Balance: {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                    </div>
                )}

                <div className="button-group">
                    <button onClick={handleSign} className="btn sign-btn">
                        Sign message
                    </button>
                    <button onClick={() => disconnect()} className="btn disconnect-btn">
                        Disconnect
                    </button>
                </div>

                {authError && <div className="error">{authError}</div>}
            </div>
        )
    }

    return (
        <div className="connect-section">
            <button
                onClick={handleConnect}
                disabled={connectStatus === 'pending'}
                className="btn connect-btn"
            >
                {connectStatus === 'pending' ? (
                    'Connecting...'
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src="/images/MetaMaskIcon.svg" alt="MetaMask Icon" width="50" height="50" />
                        <span>Connect MetaMask</span>
                    </div>
                )}
            </button>

            {connectError && (
                <div className="error">{connectError.message}</div>
            )}
        </div>
    )
}

function truncateAddress(address?: string) {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''
}