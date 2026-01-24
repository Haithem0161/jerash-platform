import { create } from 'zustand'

type Theme = 'light'

interface ThemeState {
  theme: Theme
}

export const useThemeStore = create<ThemeState>()(() => ({
  theme: 'light',
}))

// Ensure light mode is always applied
if (typeof window !== 'undefined') {
  const root = window.document.documentElement
  root.classList.remove('dark')
  root.classList.add('light')
}
