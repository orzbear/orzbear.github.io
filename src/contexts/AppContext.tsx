import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Theme = "light" | "dark"
type Lang  = "en" | "zh"

interface AppContextValue {
  theme: Theme
  lang: Lang
  toggleTheme: () => void
  toggleLang: () => void
}

const AppContext = createContext<AppContextValue>({
  theme: "light",
  lang: "en",
  toggleTheme: () => {},
  toggleLang: () => {},
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || "light"
  )
  const [lang, setLang] = useState<Lang>(
    () => (localStorage.getItem("lang") as Lang) || "en"
  )

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem("lang", lang)
  }, [lang])

  return (
    <AppContext.Provider value={{
      theme,
      lang,
      toggleTheme: () => setTheme(t => t === "light" ? "dark" : "light"),
      toggleLang:  () => setLang(l  => l  === "en"    ? "zh"   : "en"),
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
