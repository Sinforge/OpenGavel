import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './configs/wagmi'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { BrowserRouter as Router } from 'react-router-dom';

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <Router>
                        <App />
                    </Router>
                </AuthProvider>
            </QueryClientProvider>
        </WagmiProvider>
    </React.StrictMode>
)