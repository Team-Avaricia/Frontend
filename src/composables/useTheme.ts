import { ref, watch, onMounted } from 'vue'

type Theme = 'light' | 'dark'

const theme = ref<Theme>('light')

export function useTheme() {
  const initTheme = () => {
    // Primero, verificar si hay una preferencia guardada en localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null

    if (savedTheme) {
      theme.value = savedTheme
    } else {
      // Si no hay preferencia guardada, usar la preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme.value = prefersDark ? 'dark' : 'light'
    }

    applyTheme(theme.value)
  }

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement

    if (newTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  const isDark = () => theme.value === 'dark'

  // Guardar en localStorage y aplicar cuando cambie el tema
  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  })

  // Escuchar cambios en las preferencias del sistema
  onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      // Solo cambiar automáticamente si el usuario no ha establecido una preferencia manual
      if (!localStorage.getItem('theme')) {
        theme.value = e.matches ? 'dark' : 'light'
      }
    }

    mediaQuery.addEventListener('change', handleChange)
  })

  return {
    theme,
    initTheme,
    toggleTheme,
    setTheme,
    isDark
  }
}

