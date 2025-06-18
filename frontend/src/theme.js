import { createContext, useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

// Кольори для теми
export const tokens = (mode) => ({
    ...(mode === 'dark'
        ? {
            // ПАЛІТРА ДЛЯ ТЕМНОГО РЕЖИМУ
            // ВИПРАВЛЕНО: Повертаємо палітру 'grey'
            grey: {
                100: '#e0e0e0',
                200: '#c2c2c2',
                300: '#a3a3a3',
                400: '#858585',
                500: '#666666',
                600: '#525252',
                700: '#3d3d3d',
                800: '#292929',
                900: '#141414',
            },
            primary: {
                100: '#d9d9d9',
                200: '#b3b3b3',
                300: '#8c8c8c',
                400: '#666666',
                500: '#404040',
                600: '#333333',
                700: '#262626',
                800: '#1a1a1a',
                900: '#0d0d0d',
            },
            // Фіолетовий акцент
            greenAccent: {
                100: '#e6d4f9',
                200: '#ceb0f4',
                300: '#b58bed',
                400: '#9f53ec',
                500: '#8927e8',
                600: '#6e20b9',
                700: '#52188b',
                800: '#37105c',
                900: '#1b082e',
            },
        }
        : {
            // ПАЛІТРА ДЛЯ СВІТЛОГО РЕЖИМУ
            // ВИПРАВЛЕНО: Повертаємо палітру 'grey'
            grey: {
                100: '#e0e0e0',
                200: '#c2c2c2',
                300: '#a3a3a3',
                400: '#858585',
                500: '#666666',
                600: '#525252',
                700: '#3d3d3d',
                800: '#292929',
                900: '#141414',
            },
            primary: {
                100: '#0d0d0d',
                200: '#1a1a1a',
                300: '#262626',
                400: '#333333',
                500: '#404040',
                600: '#cccccc',
                700: '#d9d9d9',
                800: '#e6e6e6',
                900: '#f2f2f2',
            },
            // Фіолетовий акцент
            purpleAccent: {
                100: '#e6d4f9',
                200: '#ceb0f4',
                300: '#b58bed',
                400: '#9f53ec',
                500: '#8927e8',
                600: '#6e20b9',
                700: '#52188b',
                800: '#37105c',
                900: '#1b082e',
            },
        }),
});

// налаштування теми MUI
export const themeSettings = (mode) => {
    const colors = tokens(mode);
    return {
        palette: {
            mode: mode,
            ...(mode === 'dark'
                ? {
                    primary: {
                        main: colors.primary[100],
                    },
                    secondary: {
                        main: colors.purpleAccent[500],
                    },
                    neutral: {
                        dark: colors.grey[700], // Тепер цей рядок не буде викликати помилку
                        main: colors.grey[500],
                        light: colors.grey[100],
                    },
                    background: {
                        default: colors.primary[700],
                    },
                }
                : {
                    primary: {
                        main: colors.primary[100],
                    },
                    secondary: {
                        main: colors.purpleAccent[500],
                    },
                    neutral: {
                        dark: colors.grey[700], // Тепер цей рядок не буде викликати помилку
                        main: colors.grey[500],
                        light: colors.grey[100],
                    },
                    background: {
                        default: '#fcfcfc',
                    },
                }),
        },
        typography: {
            fontFamily: ['"Inter", sans-serif'].join(','),
            fontSize: 12,
            h1: {
                fontFamily: ['"Inter", sans-serif'].join(','),
                fontSize: 40,
            },
            h2: {
                fontFamily: ['"Inter", sans-serif'].join(','),
                fontSize: 32,
            },
            h3: {
                fontFamily: ['"Inter", sans-serif'].join(','),
                fontSize: 24,
            },
            h4: {
                fontFamily: ['"Inter", sans-serif'].join(','),
                fontSize: 20,
            },
            h5: {
                fontFamily: ['"Inter", sans-serif'].join(','),
                fontSize: 16,
            },
            h6: {
                fontFamily: ['"Inter", sans-serif'].join(','),
                fontSize: 14,
            },
        },
    };
};

export const ColorModeContext = createContext({
    toggleColorMode: () => {},
});

export const useMode = () => {
    const [mode, setMode] = useState('light');

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () =>
                setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
        }),
        [],
    );

    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
    return [theme, colorMode];
};