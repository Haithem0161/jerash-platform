import { create } from 'zustand'

type Theme = 'dark'

interface ThemeState {
  theme: Theme
}

export const useThemeStore = create<ThemeState>()(() => ({
  theme: 'dark',
}))

// Ensure dark mode is always applied
if (typeof window !== 'undefined') {
  const root = window.document.documentElement
  root.classList.remove('light')
  root.classList.add('dark')
}
