import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {LoginButton} from "../../../features/auth";
import {useAppSelector} from "../../../app/store";
import {ConnectWalletPage} from "../../connect-wallet/ui/ConnectWalletPage";

export const AuthPage = () => {
    const navigate = useNavigate()
    const { isAuthenticated } = useAppSelector((state) => state.auth)

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated, navigate])

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1>Web3 Authorization</h1>
                <ConnectWalletPage/>
                <LoginButton />
            </div>
        </div>
    )
}