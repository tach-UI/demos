/**
 * Calculator Tape Entry Component
 *
 * Renders a single tape entry with proper styling and opacity fade
 */

import { type ComponentInstance, Assets } from '@tachui/core/minimal'
import { VStack, Text } from '@tachui/primitives'
import type { TapeEntry } from '../types/calculator-tape'
import { calculateEntryOpacity } from '../utils/tape-utils'

export interface CalculatorTapeEntryProps {
  /** The tape entry to display */
  entry: TapeEntry
  /** The newest/most recent history index for opacity calculation */
  newestHistoryIndex: number
}

export function CalculatorTapeEntry({ 
  entry, 
  newestHistoryIndex 
}: CalculatorTapeEntryProps): ComponentInstance {
  
  // Calculate opacity based on position in history
  const opacity = calculateEntryOpacity(entry.historyIndex, newestHistoryIndex)
  
  return VStack({
    debugLabel: `Tape Entry ${entry.historyIndex}`,
    children: [
      Text(entry.operation)
        .font({
          family: Assets.calculatorMonospaceFont,
          size: 14,
          weight: 300
        })
        .foregroundColor(Assets.displayText)
        .textAlign('right')
        .opacity(opacity)
        .letterSpacing('-0.25px')
    ]
  })
    .frame({ width: '100%' })
    .paddingHorizontal(8)
    .paddingVertical(2)
}
