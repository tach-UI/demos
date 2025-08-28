/**
 * Theme Toggle Component
 *
 * Provides a toggle button for switching between light and dark themes
 * Demonstrates theme switching and reactive state management
 */

import { Button, ComponentInstance, createSignal, Assets, setTheme, getCurrentTheme } from '@tachui/core/minimal'
import { updateGradientColors } from '../assets/calculator-assets'
import { useThemeReactivity } from '../hooks/useTheme'

// Connect to TachUI's theme system
const [isDarkMode, setIsDarkMode] = createSignal(getCurrentTheme() === 'dark')

// Function to toggle theme
export function toggleTheme() {
  const newTheme = !isDarkMode()
  setIsDarkMode(newTheme)
  // Use TachUI's built-in theme system
  setTheme(newTheme ? 'dark' : 'light')

  // Update document class for CSS gradient switching
  if (newTheme) {
    document.documentElement.classList.add('dark-theme')
    document.documentElement.classList.remove('light-theme')
  } else {
    document.documentElement.classList.add('light-theme')
    document.documentElement.classList.remove('dark-theme')
  }

  // Update gradient colors
  updateGradientColors(newTheme)
}

export function ThemeToggle(): ComponentInstance {
  // Make this component reactive to theme changes
  useThemeReactivity()

  // Use ColorAssets directly - now that reactive system is fixed

  return Button(() => isDarkMode() ? '𖤓' : '⏾', toggleTheme)
            .modifier
            .backgroundColor(Assets.logoText)
            .foregroundColor(Assets.numberButtonForeground)
            .cornerRadius(18)
            .padding(0)
            .fontSize(24)
            .border(0)
            .frame({ width: 36, height: 36 })
            .fontWeight('500')
            .margin({ right: 16})
            .build()
}

// Export the current theme state for other components
export const useIsDarkMode = () => isDarkMode()
