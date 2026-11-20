import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { strings } from '../data/strings'

// =========================================================
// Dua bahasa (ID / EN)
//  - Teks antarmuka ada di data/strings.js → t('kunci', { var })
//  - Teks konten di data/profile.js boleh berupa string biasa (sama untuk dua bahasa)
//    atau { id: '...', en: '...' } → tx(nilai)
// =========================================================

export const LANGS = ['id', 'en']
const KEY = 'lang'

function initialLang() {
  try {
    const saved = localStorage.getItem(KEY)
    if (LANGS.includes(saved)) return saved
  } catch {
    // storage diblokir → pakai bahasa browser
  }
  return navigator.language?.toLowerCase().startsWith('id') ? 'id' : 'en'
}

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(KEY, lang)
    } catch {
      // abaikan
    }
  }, [lang])

  const t = useCallback(
    (key, vars) => {
      let s = strings[lang]?.[key] ?? strings.id[key] ?? key
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v)
      return s
    },
    [lang],
  )

  const tx = useCallback(
    (v) => {
      if (v && typeof v === 'object' && !Array.isArray(v)) return v[lang] ?? v.id
      return v
    },
    [lang],
  )

  const value = useMemo(
    () => ({ lang, setLang, toggleLang: () => setLang((l) => (l === 'id' ? 'en' : 'id')), t, tx }),
    [lang, t, tx],
  )
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
