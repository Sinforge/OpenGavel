import {useAccount, useSignMessage} from 'wagmi';
import {useAuthorizeMutation} from "../../../shared/api/authApi";
import {useAppDispatch, useAppSelector} from "../../../app/store";
import {authActions} from "../model/authSlice";

const message = ("Message to verify login. (OpenGavel)")

export const LoginButton = () => {
    const { address } = useAccount()
    const { signMessageAsync } = useSignMessage()
    const [ authorize ] = useAuthorizeMutation()
    const { isAuthenticated, jwt } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()

    const handleAuth = async () => {
        if (!address) return

        try {

            console.log("handle")
            const signature = await signMessageAsync({ message })

            const { token } = await authorize({ address, message, signature }).unwrap()

            console.log('Auth token:', token)

            dispatch(authActions.setAuth( { jwt: token, walletAddress: address }));

        } catch (error) {
            console.error('Auth error:', error)
        }
    }

    if (isAuthenticated) {
        return <button onClick={() => dispatch(authActions.clearAuth())}>Logout</button>
    }

    return (
        <div>
            {!isAuthenticated && (<button onClick={handleAuth}>Sign In</button>)}
        </div>
    )
};