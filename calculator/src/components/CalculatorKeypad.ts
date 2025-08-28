/**
 * Calculator Keypad Component
 *
 * Grid layout of calculator buttons with proper styling and interactions
 * Demonstrates layout systems and button interactions
 */

import { VStack, HStack, Button, ComponentInstance, Assets, createSignal, createComputed } from '@tachui/core/minimal'
import { type CalculatorButton as CalculatorButtonType, type Operation } from '../logic/calculator-logic'
// Import font assets
import '../assets/calculator-fonts'

// Helper function to classify button types
const getButtonType = (button: string): 'number' | 'operator' | 'function' => {
  if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(button)) {
    return 'number'
  }
  if (['+', '-', '×', '÷', '='].includes(button)) {
    return 'operator'
  }
  return 'function' // AC, ±, %
}

export interface CalculatorKeypadProps {
  onButtonPress: (button: CalculatorButtonType) => void
  currentOperation: () => Operation
}

export function CalculatorKeypad({ onButtonPress, currentOperation }: CalculatorKeypadProps): ComponentInstance {

  // Helper function to create a button with proper styling
  const createButton = (value: CalculatorButtonType, size: string = '1') => {
    const buttonType = getButtonType(value)

    // Check if this operator button should be active (highlighted) - make it reactive
    // Note: '=' button should never be active since it completes operations
    const isActive = createComputed(() =>
      buttonType === 'operator' && value !== '=' && value === currentOperation()
    )

    const handlePress = () => {
      // Haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(10)
      }

      onButtonPress(value)

      // Special case: blur the Tape button after pressing to prevent Enter key focus issues
      if (value === 'Tape') {
        // Use setTimeout to allow the button press to complete first
        setTimeout(() => {
          const activeElement = document.activeElement as HTMLElement
          if (activeElement && activeElement.blur) {
            activeElement.blur()
          }
        }, 10)
      }
    }

    // hover tracking with reactive signal
    const [isHovered, setIsHovered] = createSignal(false);

    // Get colors based on button type using ColorAssets
    // Use ColorAssets directly - let modifier system handle reactivity
    const bgColor = createComputed(() => {
      const active = isActive()
      const _hovered = isHovered()
      let color
      switch (buttonType) {
        case 'number':
          color = Assets.numberButtonBackground
          break
        case 'operator':
          color = active ? Assets.operatorButtonBackgroundActive : Assets.operatorButtonBackground
          break
        case 'function':
          color = Assets.functionButtonBackground
          break
        default:
          color = Assets.numberButtonBackground
      }
      return color
    })

    const fgColor = createComputed(() => {
      const active = isActive()
      const hovered = isHovered()
      let color
      switch (buttonType) {
        case 'number':
          color = hovered ? Assets.operatorButtonBackground : Assets.numberButtonForeground
          break
        case 'operator':
          color = active ? Assets.operatorButtonForegroundActive : Assets.operatorButtonForeground
          break
        case 'function':
          color = Assets.functionButtonForeground
          break
        default:
          color = hovered ? Assets.systemWhite : Assets.numberButtonForeground
      }
      return color
    })

    const buttonWidth = (() => {
      switch (size) {
        case '2x2':
        case '2w':
          return 160
        default:
          return 80
      }
    })()
    const buttonHeight = (() => {
      switch (size) {
        case '2x2':
          return 160
        case '2w':
        default:
          return 80
      }
    })()

    return Button(value, handlePress)
      .modifier
      .frame({ width: buttonWidth, height: buttonHeight })
      .background(Assets.buttonGradientOverlay)
      .backgroundColor(bgColor)
      .foregroundColor(fgColor)
      .font({
        family: Assets.calculatorBaseFont,
        size: 40,
        weight: 400
      })
      .hover({
        filter: 'drop-shadow(0 0 5px hsla(35, 100%, 50%, 0.33))',
        transform: 'scale(1.05)'
      })
      .textAlign('center')
      .border(0)
      .letterSpacing('-0.25px')
      .onHover((hovered: boolean) => {
        setIsHovered(hovered)
      })
      .build()
  }

  return VStack({
    spacing: 0,
    debugLabel: "Calculator Keypad",
    style: {
      width: '100%'
    },
    children: [
      HStack({
        spacing: 0,
        debugLabel: "Top Row (AC, ⓘ, Tape)",
        style: {
          width: '100%'
        },
        children: [
          createButton('AC', '2w'),
          // createButton('ⓘ'),
          createButton('⌫'),
          createButton('Tape', '2w')
        ]
      }),
      HStack({
        spacing: 0,
        debugLabel: "Row 4 (7, 8, 9, -, ÷)",
        style: {
          width: '100%'
        },
        children: [
          createButton('7'),
          createButton('8'),
          createButton('9'),
          createButton('-'),
          createButton('÷')
        ]
      }),
      HStack({
        spacing: 0,
        debugLabel: "Row 3 (4, 5, 6, +, ×)",
        style: {
          width: '100%'
        },
        children: [
          createButton('4'),
          createButton('5'),
          createButton('6'),
          createButton('+'),
          createButton('×')
        ]
      }),
      HStack({
        spacing: 0,
        debugLabel: "Row 1+2",
        style: {
          width: '100%'
        },
        children: [
          VStack({
            spacing: 0,
            children: [
              createButton('1'),
              createButton('±')
            ]
          }),
          VStack({
            spacing: 0,
            children: [
              createButton('2'),
              createButton('0')
            ]
          }),
          VStack({
            spacing: 0,
            children: [
              createButton('3'),
              createButton('.')
            ]
          }),
          createButton('=', '2x2')
        ]
      })
    ]
  })
}
