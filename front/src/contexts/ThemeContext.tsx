import { createContext, useContext, useState, useEffect, type ReactNode } from "react";


type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
    children: ReactNode
    defaultTheme?: Theme
}

export function ThemeProvider({children, defaultTheme = 'dark'}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme') as Theme
        return savedTheme || defaultTheme
    })

    useEffect(() => {
        localStorage.setItem('theme', theme)
        document.documentElement.setAttribute('data-theme', theme)

        document.body.classList.remove('light', 'dark')
        document.body.classList.add(theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme == 'light' ? 'dark' : 'light')
    }

    const value = {
        theme,
        toggleTheme,
        setTheme,
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context == undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

export function useThemeClasses() {
    const { theme } = useTheme()

    return {
        isDark: theme == 'dark',
        isLight: theme == 'light',
        themeClass: theme,
        getThemeClass: (lightClass: string, darkClass: string) => theme == 'light' ? lightClass : darkClass,
    }
}