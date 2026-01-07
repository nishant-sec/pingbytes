type CopyOptions = {
  selector?: string
  successClass?: string
  successDuration?: number
  successLabel?: string
  errorLabel?: string
}

/**
 * Attach copy-to-clipboard handlers to buttons with data-share-url.
 * Returns a cleanup function to remove listeners and timeouts.
 */
export function registerCopyButtons({
  selector = 'button[data-share-url]',
  successClass = 'text-green-600 dark:text-green-400',
  successDuration = 2000,
  successLabel = 'Link copied!',
  errorLabel = 'Failed to copy link',
}: CopyOptions = {}): () => void {
  if (typeof document === 'undefined') return () => {}

  const buttons = Array.from(
    document.querySelectorAll<HTMLButtonElement>(selector),
  )
  const timeouts = new Map<HTMLElement, ReturnType<typeof setTimeout>>()

  const resetButton = (button: HTMLButtonElement) => {
    button.classList.remove(...successClass.split(' '))
    const originalLabel =
      button.getAttribute('data-original-aria-label') ||
      button.getAttribute('aria-label') ||
      'Copy link'
    button.setAttribute('aria-label', originalLabel)
    button.removeAttribute('data-original-aria-label')
  }

  const handleClick = async (event: Event) => {
    const button = event.currentTarget as HTMLButtonElement
    const url = button.dataset.shareUrl
    if (!url) return

    event.preventDefault()

    const originalLabel = button.getAttribute('aria-label') || 'Copy link'
    button.setAttribute('data-original-aria-label', originalLabel)

    const copySucceeded = await copy(url)
    const label = copySucceeded ? successLabel : errorLabel

    button.setAttribute('aria-label', label)
    if (copySucceeded) {
      button.classList.add(...successClass.split(' '))
    }

    const existing = timeouts.get(button)
    if (existing) clearTimeout(existing)
    const timeout = setTimeout(() => {
      resetButton(button)
      timeouts.delete(button)
    }, successDuration)
    timeouts.set(button, timeout)
  }

  buttons.forEach((button) => {
    button.addEventListener('click', handleClick)
  })

  return () => {
    buttons.forEach((button) => {
      button.removeEventListener('click', handleClick)
      const existing = timeouts.get(button)
      if (existing) clearTimeout(existing)
    })
    timeouts.clear()
  }
}

async function copy(text: string): Promise<boolean> {
  if (!navigator.clipboard || !window.isSecureContext) return false
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy link:', err)
    return false
  }
}
