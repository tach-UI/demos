/**
 * Main Calculator App Component
 *
 * Demonstrates:
 * - SwiftUI-style component composition
 * - Reactive state management with signals
 * - Clean component architecture
 */

import { createSignal, type ComponentInstance, Assets, infinity, EnvironmentObject } from '@tachui/core/minimal'
import { VStack, HStack, Text, Image, Spacer } from '@tachui/primitives'
import { CalculatorDisplay } from './CalculatorDisplay'
import { CalculatorKeypad } from './CalculatorKeypad'
import { calculatorReducer, initialState, type CalculatorState, type CalculatorButton } from '../logic/calculator-logic'
import { useKeyboardSupport } from '../hooks/useKeyboardSupport'
import type { TapeEntry } from '../types/calculator-tape'
import { AppStateKey } from '../store/appStateKey'
// Import font assets
import '../assets/calculator-fonts'
import { ThemeToggle } from './ThemeToggle'

export function CalculatorApp(): ComponentInstance {
  
  // Calculator state using TachUI's reactive signals
  const [state, setState] = createSignal<CalculatorState>(initialState)

  // Get the app state from the environment
  const appState = EnvironmentObject(AppStateKey)


  // Handle tape entry creation using AppStateStore
  const handleTapeEntry = (entry: TapeEntry) => {
    appState.wrappedValue.addTapeEntry(entry.operation)
  }

  // Handle tape clearing using AppStateStore
  const handleClearTape = () => {
    appState.wrappedValue.clearTape()
  }

  // Handle tape visibility toggle
  const handleToggleTape = () => {
    appState.wrappedValue.toggleTape()
  }

  // Handle button press
  const handleButtonPress = (button: CalculatorButton) => {
    // Handle Tape button separately
    if (button === 'Tape') {
      handleToggleTape()
      return
    }

    setState(prevState => {
      const newState = calculatorReducer(prevState, button, handleTapeEntry, handleClearTape)
      return newState
    })
  }

  // Enable keyboard support
  useKeyboardSupport({
    onButtonPress: handleButtonPress,
    enabled: true
  })

  const result = VStack({
    spacing: 0,
    children: [
      HStack({
        debugLabel: "Logo Row",
        children: [
          // App Logo
          Image(Assets.tachuiLogo)
            .frame({ height: 64 }),

          Text("tachulator")
            .font({
              family: Assets.calculatorLogoFont,
              size: 36,
              weight: 200
            })
            .foregroundColor(Assets.logoText)
            .lineHeight(1)
            .textCase('uppercase')
            .textAlign('left')
            .padding(0),

          Spacer(),

          ThemeToggle()
        ]
      })
        .padding({ vertical: 8 })
        .frame({ maxWidth: infinity }),

      // Calculator Display
      CalculatorDisplay({
        value: () => state().display,
        tapeEntries: appState.wrappedValue.tapeEntriesSignal,
        tapeVisible: appState.wrappedValue.tapeDisplaySignal
      }),

      // Calculator Keypad
      CalculatorKeypad({
        onButtonPress: handleButtonPress,
        currentOperation: () => state().operation
      })
    ]
  })
    .backgroundColor(Assets.calculatorBackground)
    .cornerRadius(24)
    .padding(0)
    .font({
      family: Assets.calculatorBaseFont,
      size: 36,
      weight: 200
    })
    .frame({ maxWidth: 480 })
    .shadow({ x: 0, y: 20, radius: 40, color: Assets.calculatorShadow })
    .border(1, Assets.calculatorBorder)
    .clipped()

  return result
}
