import { mountRoot, setTheme, detectSystemTheme, initializeResponsiveSystem } from '@tachui/core/minimal'
import { IntroApp } from './components/IntroApp'
import { createIntroAssets } from './assets/intro-assets'
// Import the auto-generated icon set to register it
import './icons/auto-generated'

// Set initial theme properly BEFORE creating assets
const initialTheme = detectSystemTheme()
setTheme(initialTheme)
document.documentElement.classList.add(`${initialTheme}-theme`)

// Initialize responsive system
initializeResponsiveSystem()

// Initialize assets at module load time (like calculator)
createIntroAssets()

// Mount the app using standard TachUI mounting
mountRoot(() => {
  // Create app AFTER assets are guaranteed to be available
  const app = IntroApp()
  return app
})
