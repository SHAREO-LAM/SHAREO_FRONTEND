import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type ThemeMode = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  // Récupère le thème depuis localStorage ou utilise 'light' par défaut
  const savedTheme = localStorage.getItem('theme') as ThemeMode | null
  const theme = ref<ThemeMode>(savedTheme || 'light')

  // Applique le thème au chargement
  const applyTheme = (mode: ThemeMode) => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Applique le thème initial
  applyTheme(theme.value)

  // Toggle entre light et dark
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  // Set un thème spécifique
  const setTheme = (mode: ThemeMode) => {
    theme.value = mode
  }

  // Sauvegarde automatiquement le thème dans localStorage et applique les changements
  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  })

  return {
    theme,
    toggleTheme,
    setTheme,
  }
})
