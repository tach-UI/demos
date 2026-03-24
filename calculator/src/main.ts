/**
 * TachUI Calculator - Main Entry Point
 *
 * Demonstrates:
 * - Precise interaction patterns and styling
 * - Apple-like design system
 * - SwiftUI-style component composition
 * - Reactive state management
 * - Core-only bundle (~60KB target)
 */

import { provideEnvironmentObject, getCurrentComponentContext, createComponentContext, setCurrentComponentContext, setTheme, detectSystemTheme, mountRoot } from '@tachui/core/minimal'
import '@tachui/modifiers/preload/basic'
import '@tachui/modifiers/preload/effects'
// import { initializeResponsiveSystem } from '@tachui/core' // REMOVED: Causing 3.9MB bundle bloat

import { CalculatorApp } from './components/CalculatorApp'
import { AppStateStore } from './store/appStateStore'
import { AppStateKey } from './store/appStateKey'
import { handleDebug } from './logic/handleDebug'
import { createCalculatorAssets } from './assets/calculator-assets'

// Set initial theme properly BEFORE creating assets
const initialTheme = detectSystemTheme()
setTheme(initialTheme)
document.documentElement.classList.add(`${initialTheme}-theme`)

// Initialize responsive system
// initializeResponsiveSystem() // REMOVED: Causing 3.9MB bundle bloat

// Initialize calculator color assets after theme is set
createCalculatorAssets()

// Setup Debug Mode
handleDebug()

// Set up App State globally
const appState = new AppStateStore()

// Mount the app using standard TachUI mounting (like intro app)
mountRoot(() => {
  // Create a temporary context if none exists
  try {
    getCurrentComponentContext()
  } catch (_e) {
    const tempContext = createComponentContext('temp-calculator')
    setCurrentComponentContext(tempContext)
  }

  // Provide environment object within this context before calling CalculatorApp
  provideEnvironmentObject(AppStateKey, appState)
  
  // Create app AFTER assets are guaranteed to be available
  const app = CalculatorApp()
  return app
})

// Log bundle info for development
if (import.meta.env.DEV) {
  console.log('🧮 Tachulator loaded')

  // Show debug instructions only when relevant
  if (typeof window !== 'undefined' && !window.location?.search.includes('debug=true')) {
    console.log('💡 Add ?debug=true to URL for debug mode')
  }
}
