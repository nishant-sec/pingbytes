type Controller = {
  init: () => void
  cleanup?: () => void
}

/**
  * Register standard Astro lifecycle listeners (page-load, after-swap, before-swap)
  * for a controller. Returns an unregister function.
  */
export function registerPageController({ init, cleanup }: Controller) {
  if (typeof document === 'undefined') return () => {}

  const handlePageLoad = () => init()
  const handleAfterSwap = () => {
    cleanup?.()
    init()
  }
  const handleBeforeSwap = () => cleanup?.()

  document.addEventListener('astro:page-load', handlePageLoad)
  document.addEventListener('astro:after-swap', handleAfterSwap)
  document.addEventListener('astro:before-swap', handleBeforeSwap)

  return () => {
    document.removeEventListener('astro:page-load', handlePageLoad)
    document.removeEventListener('astro:after-swap', handleAfterSwap)
    document.removeEventListener('astro:before-swap', handleBeforeSwap)
  }
}
