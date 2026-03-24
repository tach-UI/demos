/**
 * Calculator Display Component
 *
 * Shows the current value with proper formatting and styling
 * Now includes integrated calculator tape above the main display
 */

import { type ComponentInstance, Assets, infinity, withComponentContext } from '@tachui/core/minimal'
import { VStack, Text } from '@tachui/primitives'
import { Show } from '@tachui/flow-control'

import { CalculatorTape } from './CalculatorTape'
import type { TapeEntry } from '../types/calculator-tape'
// Import font assets
import '../assets/calculator-fonts'

export interface CalculatorDisplayProps {
  value: string | (() => string)
  /** Tape entries to display */
  tapeEntries?: TapeEntry[] | (() => TapeEntry[])
  /** Whether tape is visible */
  tapeVisible?: boolean | (() => boolean)
}

// Format display value for better presentation
const formatDisplayValue = (val: string): string => {
  if (val === 'Error') return val
  if (val === '0') return val

  // Add thousand separators for large numbers
  const parts = val.split('.')
  if (parts[0].length > 3) {
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return parts.join('.')
}

function _CalculatorDisplay({
  value,
  tapeEntries,
  tapeVisible
}: CalculatorDisplayProps): ComponentInstance {
  return VStack({
    spacing: 0,
    children: [
      // Calculator Tape (collapsible) - Use Show for reactive conditional rendering
      Show({
        when: typeof tapeVisible === 'function' ? tapeVisible : () => tapeVisible ?? false,
        children: CalculatorTape({
          entries: tapeEntries,
          visible: true
        })
      }),

      // Main display value
      Text(() => {
        const currentValue = typeof value === 'function' ? value() : value
        return formatDisplayValue(currentValue)
      })
        .font({
          family: Assets.calculatorBaseFont,
          size: 48,
          weight: 400
        })
        .foregroundColor(Assets.displayText)
        .textAlign('right')
        .letterSpacing('-0.5px')
        .padding(20)
    ]
  })
    .backgroundColor(Assets.displayBackground)
    .cornerRadius(0)
    .padding(8)
    .frame({ maxWidth: infinity, minHeight: 80 })
    .width('100%')
}

// Export the wrapped version with component context
export const CalculatorDisplay = withComponentContext(_CalculatorDisplay, 'CalculatorDisplay')
