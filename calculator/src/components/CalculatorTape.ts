/**
 * Calculator Tape Component
 *
 * Displays a scrollable list of calculator tape entries with dividers
 * Now using the reactive Show component for proper conditional rendering
 */

import { type ComponentInstance, Assets, infinity } from '@tachui/core/minimal'
import { VStack, ScrollView, Text } from '@tachui/primitives'
import { List } from '@tachui/data'
import type { TapeEntry } from '../types/calculator-tape'

export interface CalculatorTapeProps {
  /** Array of tape entries to display */
  entries?: TapeEntry[] | (() => TapeEntry[])
  /** Whether the tape is visible */
  visible?: boolean | (() => boolean)
}

export function CalculatorTape({
  entries = [],
}: CalculatorTapeProps): ComponentInstance {

  // Create reactive List component that will re-render when entries change
  const listComponent = List({
    data: typeof entries === 'function' ? entries : () => entries || [], // Pass the signal directly
    renderItem: (entry: TapeEntry, _index: number) => {
      return VStack({
        children: [
          Text(entry.operation)
            .fontSize(15)
            .fontWeight(500)
            .foregroundColor(Assets.displayText)
            .frame({ maxWidth: infinity })
            .textAlign('right')
            .padding({ vertical: 4, right: 12 })
        ]
      })
    },
    emptyState: Text('No calculations yet')
  })

  // Remove the Show wrapper since CalculatorDisplay already handles visibility
  return ScrollView({
      children: [listComponent] // Use reactive List component
    })
      .frame({ height: 120 }) // Fixed height as per design
      .backgroundColor(Assets.displayBackground)
      .cornerRadius(12)
      .paddingVertical(4)
}
