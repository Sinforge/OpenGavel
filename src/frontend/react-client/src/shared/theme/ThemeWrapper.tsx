import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#4a00e0', // deep violet
        },
        secondary: {
            main: '#ff6f00', // strong modern orange
        },
        background: {
            default: '#f2f3f5', // soft gray background
            paper: '#ffffff',  // crisp white card
        },
        text: {
            primary: '#1c1c1e', // near-black
            secondary: '#5f6368', // neutral gray
        },
        divider: '#dcdfe3',
    },
    shape: {
        borderRadius: 14,
    },
    typography: {
        fontFamily: 'Inter, Roboto, sans-serif',
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#7c4dff', // violet accent
        },
        secondary: {
            main: '#ff9800', // orange accent
        },
        background: {
            default: '#0d0d0d', // deep black
            paper: '#1c1c1c',   // dark gray
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
        },
        divider: '#333333',
    },
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: 'Roboto Mono, monospace',
    },
});

const ColorModeContext = createContext({ toggleColorMode: () => {} });
export const useColorMode = () => useContext(ColorModeContext);

export const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<'light' | 'dark'>('light');

    const toggleColorMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

    const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

    return (
        <ColorModeContext.Provider value={{ toggleColorMode }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ColorModeContext.Provider>
    );
};