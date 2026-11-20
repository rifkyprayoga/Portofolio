import { createContext, useContext, useEffect, useMemo, useState } from 'react'

// Tema gelap (bawaan) / terang. Atribut data-theme di <html> sudah dipasang
// oleh skrip kecil di index.html sebelum React jalan, supaya tidak ada kedipan.
const KEY = 'theme'
const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'))

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f5f7fb' : '#050510')
    try {
      localStorage.setItem(KEY, theme)
    } catch {
      // abaikan
    }
  }, [theme])

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }),
    [theme],
  )
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
