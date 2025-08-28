import { VStack, ComponentInstance } from '@tachui/core/minimal'
// import { backdropFilter, dropShadow, gradientText } from '@tachui/core/modifiers'
import { Header } from './Header'
import { Hero } from './Hero'
import { Features } from './Features'
import { Patterns } from './Patterns'
import { Modular } from './Modular'
import { Performance } from './Performance'
import { Build } from './Build'
import { Footer } from './Footer'

export function IntroApp(): ComponentInstance {

  return VStack({
    spacing: 0,
    children: [
      // Navigation Header
      Header(),
      Hero(),
      Features(),
      Patterns(),
      Modular(),
      Performance(),
      Build(),
      Footer(),
    ]
  })
}
