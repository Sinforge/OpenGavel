import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { PaletteColor, SimplePaletteColorOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        accent: PaletteColor;
    }
    interface PaletteOptions {
        accent?: SimplePaletteColorOptions;
    }
}
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
            main: '#ffffff', // Белый как основной акцент
            contrastText: '#000000',
        },
        secondary: {
            main: '#7c4dff', // Фиолетовый акцент
            contrastText: '#ffffff',
        },
        info: {
            main: '#00e5ff', // Бирюзовый акцент
        },
        warning: {
            main: '#ff6f00', // Тёмно-оранжевый
        },
        success: {
            main: '#76ff03', // Салатовый
        },
        background: {
            default: '#000000', // Чёрный фон
            paper: '#121212', // Тёмные карточки
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
            disabled: '#666666',
        },
        divider: '#333333', // Контрастные разделители
        action: {
            active: '#7c4dff', // Фиолетовый для иконок
            hover: '#1a1a1a', // Тёмный ховер
        },
    },
    shape: {
        borderRadius: 8, // Четкие углы
    },
    typography: {
        fontFamily: 'Roboto Mono, monospace', // Техничный шрифт
        h4: {
            fontWeight: 700,
            letterSpacing: '-0.5px',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                '*': {
                    borderColor: '#333333 !important', // Контрастные контуры
                },
                body: {
                    background: 'linear-gradient(to bottom, #000000, #0a0a0a)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    border: '1px solid #333',
                    background: '#121212',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderWidth: '2px',
                    '&:hover': {
                        borderWidth: '2px',
                    },
                },
                contained: {
                    border: '2px solid transparent',
                },
                outlined: {
                    border: '2px solid #333',
                    '&:hover': {
                        border: '2px solid #7c4dff',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    border: '2px solid #333',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        borderColor: '#7c4dff',
                        boxShadow: '0 0 15px rgba(124, 77, 255, 0.3)',
                    },
                },
            },
        },
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