import { createEnvironmentKey } from '@tachui/core/minimal'
import { AppStateStore } from './appStateStore'

// Create a shared environment key for AppStateStore
export const AppStateKey = createEnvironmentKey<AppStateStore>('AppStateStore')