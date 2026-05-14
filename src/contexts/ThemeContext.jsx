import { useEffect, createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children, defaultTheme = "dark" }) {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("theme");
            return stored || defaultTheme;
        }
        return defaultTheme;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}