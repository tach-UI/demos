

export function handleDebug(coreEnableDebug?: any, debugManager?: any): void {
  try {
    if (!coreEnableDebug || !debugManager) {
      return
    }

    // Check if debug should be enabled via URL parameter
    const shouldEnable = typeof window !== 'undefined' &&
                        window.location?.search.includes('debug=true')

    // Enable debug mode if URL parameter is present
    if (shouldEnable) {
      coreEnableDebug({
        showLabels: true,
        showBounds: true,
        logComponentTree: false  // Disable noisy component tree logging
      })
      console.log('🔧 Debug mode enabled')
    }

    // Make debug functions available globally for manual control
    if (typeof window !== 'undefined') {
      (window as any).enableDebug = coreEnableDebug;
      (window as any).debugManager = debugManager;

      // Add helper function to check debug integration
      (window as any).checkDebugIntegration = () => {
        const debugElements = document.querySelectorAll('[data-tachui-component]')
        const labeledElements = document.querySelectorAll('[data-tachui-label]')

        console.group('🔧 Debug Integration Check')
        console.log(`Debug enabled: ${debugManager.isEnabled()}`)
        console.log(`Elements with debug attributes: ${debugElements.length}`)
        console.log(`Elements with debug labels: ${labeledElements.length}`)

        if (labeledElements.length > 0) {
          console.log('✅ Debug labels found:')
          labeledElements.forEach(el => {
            const component = el.getAttribute('data-tachui-component')
            const label = el.getAttribute('data-tachui-label')
            console.log(`  - ${component}: "${label}"`)
          })
        } else {
          console.log('❌ No debug labels found - integration may have issues')
        }
        console.groupEnd()

        return {
          enabled: debugManager.isEnabled(),
          debugElements: debugElements.length,
          labeledElements: labeledElements.length
        }
      }
    }

    // Only log if debug is actually enabled
    if (debugManager.isEnabled()) {
      console.log('🔧 Debug system ready - hover over elements to see labels')
    }
  } catch (_e) {
    // Silent fail for debug system - don't pollute console
  }
}
